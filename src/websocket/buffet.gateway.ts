import { WebSocketServer, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { SerialCommunicationService } from "../serial-communication/serial-communication.service";
import { OrderDto } from "../dto/order.dto";
import { WeightUpdateDto } from "../dto/weight-update.dto";
import { BuffetService } from "../buffet/buffet.service";
import { Logger } from "@nestjs/common";
import { Scale } from "@/serial-communication/interfaces/scale.interface";


@WebSocketGateway()
export class BuffetGateway {
	@WebSocketServer() server: Server
	private readonly logger = new Logger(BuffetGateway.name);

	constructor(
		private serialCommunicationService: SerialCommunicationService,
		private buffetService: BuffetService
	) {}

	afterInit() {
		this.initializeScales();
	}

	handleConnection(client: Socket) {
		console.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);
	}

	private initializeScales() {
		const scaleConfigs: Scale[] = [
			{ id: 'scale1', portPath: '/dev/ttyUSB0', baudRate: 9600, weighUnit: 'g' },
		];

		this.serialCommunicationService.initializeScales(scaleConfigs).then(() => {
			scaleConfigs.forEach(config => {
				this.serialCommunicationService.onData(config.id, (weight: number) => {
					const order = this.buffetService.processOrder(weight);
					if (order) {
						const orderDto: OrderDto = {
							id: order.id,
							weight: order.weight,
							price: order.price,
							type: order.type
						};
						this.server.emit('orderCreated', orderDto);
					}
					const weightUpdateDto: WeightUpdateDto = {
						scaleId: config.id,
						weight: weight
					};
					this.server.emit('weightUpdate', weightUpdateDto);
				});
			});
		}).catch(error => {
			this.logger.error('Failed to initiliaze scales', error.stack);
		});
	}

	@SubscribeMessage('requestCurrentWeight')
	handleRequestCurrentWeight(client: Socket) {
		const weights: WeightUpdateDto[] = [];
		const scaleIds = this.serialCommunicationService.getScaleIds();
		for (const scaleId of scaleIds) {
			const weight = this.serialCommunicationService.getCurrentWeight(scaleId);
			if ( weight !== null) {
				weights.push({ scaleId, weight });
			}
		}
		client.emit('currentWeights', weights);
	}
}
