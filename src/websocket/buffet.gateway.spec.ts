import { Test, TestingModule } from "@nestjs/testing";
import { SerialCommunicationService } from "../serial-communication/serial-communication.service";
import { BuffetService } from "../buffet/buffet.service";
import { BuffetGateway } from "../websocket/buffet.gateway";
import { Socket } from 'socket.io'

describe('BuffetGateway', () => {
	let gateway: BuffetGateway;
	let serialCommunicationService: SerialCommunicationService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BuffetGateway,
				{
					provide: SerialCommunicationService,
					useValue: {
						initializeScales: jest.fn().mockResolvedValue(undefined),
						onData: jest.fn(),
					},
				},
				BuffetService,
			],
		}).compile();

		gateway = module.get<BuffetGateway>(BuffetGateway);
		serialCommunicationService = module.get<SerialCommunicationService>(SerialCommunicationService);
	});

	it('should be defined', () => {
		expect(gateway).toBeDefined();
	});

	it('should initialize scales on afterInit', () => {
		gateway.afterInit();
		expect(serialCommunicationService.initializeScales).toHaveBeenCalled();
	});

	it('should handle client connection', () => {
		const mockClient = { id: 'test-client' } as Socket;
		const consoleSpy = jest.spyOn(console, 'log');

		gateway.handleConnection(mockClient);

		expect(consoleSpy).toHaveBeenCalledWith('Client connected: test-client');
	});

	it('should handle client disconnection', () => {
		const mockClient = { id: 'test-client' } as Socket;
		const consoleSpy = jest.spyOn(console, 'log');

		gateway.handleDisconnect(mockClient);

		expect(consoleSpy).toHaveBeenCalledWith('Client connected: test-client');
	})
});
