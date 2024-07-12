import { Test, TestingModule } from '@nestjs/testing';
import { BuffetService } from './buffet.service';

jest.useFakeTimers();

describe('BuffetService', () => {
	let service: BuffetService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [BuffetService],
		}).compile();

		service = module.get<BuffetService>(BuffetService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should calculate per-kilo price correctly', () => {
		const order = service.processOrder(0.5); //500g
		expect(order).not.toBeNull();
		if (order) {
			expect(order.type).toBe('per-kilo');
			expect(order.price).toBe(25); // 0.5 * 50 = 25
		}
	});

	it('should apply all-you-can-eat price when per-kilo price exceeds it', () => {
		const order = service.processOrder(2); //2kg
		expect(order).not.toBeNull();
		if (order) {
			expect(order.type).toBe('all-you-can-eat');
			expect(order.price).toBe(70);
		}
	});

	it('should generate unique order IDs', () => {
		const originalMinTime = (service as any ).setMinTimeBetweenOrders(10);

		const order1 = service.processOrder(1);

		jest.advanceTimersByTime(15);

		const order2 = service.processOrder(1);

		expect(order1).not.toBeNull();
		expect(order2).not.toBeNull();

		if (order1 && order2) {
			expect(order1.id).not.toBe(order2.id);
		}

		service.setMinTimeBetweenOrders(originalMinTime);
	});

	it('should return null for rapid plate changes', () => {
		const order1 = service.processOrder(1);
		expect(order1).not.toBeNull;

		const order2 = service.processOrder(1.5);
		expect(order2).toBeNull();
	})
});

afterAll(() => {
	jest.useRealTimers();
});
