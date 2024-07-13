import { Test, TestingModule } from "@nestjs/testing";
import { OrderService } from "@/order/order.service";
import { Order } from "@/serial-communication/interfaces/order.interface";

describe('OrderService', () => {
	let service: OrderService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [OrderService],
		}).compile();

		service = module.get<OrderService>(OrderService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should create a new order', () => {
		const orderData: Omit<Order, 'id'> = {
			weight: 1.5,
			price: 75,
			type: 'per-kilo',
		};

		const order = service.createOrder(orderData);
		expect(order).toHaveProperty('id');
		expect(order.weight).toBe(orderData.weight);
		expect(order.price).toBe(orderData.price);
		expect(order.type).toBe(orderData.type);
	});


	it('should retrieve an order by id', () => {
		const orderData: Omit<Order, 'id'> = {
			weight: 1.5,
			price: 75,
			type: 'per-kilo',
		};

		const createdOrder = service.createOrder(orderData);
		const retrievedOrder = service.getOrderById(createdOrder.id);
		expect(retrievedOrder).toEqual(createdOrder);
	});
})
