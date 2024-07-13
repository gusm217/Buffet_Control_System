import { Test, TestingModule } from "@nestjs/testing";
import { BuffetController } from "@/buffet/buffet.controller";
import { BuffetService } from "@/buffet/buffet.service";
import { OrderService } from "@/order/order.service";

describe('BuffetController',  () => {
	let controller: BuffetController;
	let buffetService: BuffetService;
	let orderService: OrderService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [BuffetController],
			providers: [
				{
					provide: BuffetService,
					useValue: {
						processOrder: jest.fn(),
					},
				},
				{
					provide: OrderService,
					useValue: {
						createOrder: jest.fn(),
					},
				},
			],
		}).compile();

		controller = module.get<BuffetController>(BuffetController);
		buffetService = module.get<BuffetService>(BuffetService);
		orderService = module.get<OrderService>(OrderService);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('getMockWeight', () => {
		it('should return a mock weight between 0.5 and 2.5', () => {
			const result = controller.getMockWeight('scale1');
			expect(result.data).toBeGreaterThanOrEqual(0.5);
			expect(result.data).toBeLessThanOrEqual(2.5);
			expect(result.message).toBe('Mock weight generated');
		});
	});

	describe('getMockOrder', () => {
		it('should create a mock order when proecssOrder returns an order', () => {
			const mockOrder = { id: '1', weight: 1.5, price: 75, type: 'per-kilo' as const };
			(buffetService.processOrder as jest.Mock).mockReturnValue(mockOrder);
			(orderService.createOrder as jest.Mock).mockReturnValue(mockOrder);

			const result = controller.getMockOrder();

			expect(result.data).toEqual(mockOrder);
			expect(result.message).toBe('Mock order created');
		});

		it('should return null data when processOrder returns null', () => {
			(buffetService.processOrder as jest.Mock).mockReturnValue(null);

			const result = controller.getMockOrder();

			expect(result.data).toBeNull();
			expect(result.message).toBe('Failed to create mock order');
		});
	});
});
