import { Injectable } from "@nestjs/common";
import { Order } from "src/serial-communication/interfaces/order.interface";

@Injectable()
export class BuffetService {
	private perKiloPrice: number = 50; //por quilo
	private AllYouCanEatPrice: number = 70; //por pessoa
	private lastOrderTime: number = 0;
	private minTimeBetweenOrders: number = 5000; // 5 segundos

	processOrder(weight: number): Order | null {
		const now = Date.now();
		if (now - this.lastOrderTime < this.minTimeBetweenOrders) {
			// Detectada troca rápida de pratos
			return null;
		}

		const perKiloTotal = weight * this.perKiloPrice;
		const type = perKiloTotal > this.AllYouCanEatPrice ? 'all-you-can-eat' :'per-kilo';
		const price = type === 'all-you-can-eat' ? this.AllYouCanEatPrice : perKiloTotal;

		this.lastOrderTime = now;

		return {
			id: this.generateOrderId(),
			weight,
			price,
			type,
		};
	}

	private generateOrderId(): string {
		return `ORDER-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
	}

	setMinTimeBetweenOrders(time: number) {
		this.minTimeBetweenOrders = time;
	}
}
