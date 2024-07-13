import { Injectable } from "@nestjs/common";
import { Order } from "@/serial-communication/interfaces/order.interface";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class OrderService {
	private orders: Map<string, Order> = new Map();

	createOrder(orderData: Omit<Order, 'id'>): Order {
		const id = uuidv4();
		const order: Order = { id, ...orderData };
		this.orders.set(id, order);
		return order;
	}

	getOrderById(id: string): Order | undefined {
		return this.orders.get(id);
	}

	getAllOrders(): Order[] {
		return Array.from(this.orders.values());
	}
}
