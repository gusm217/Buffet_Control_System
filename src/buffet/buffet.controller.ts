import { Controller, Get, Param } from '@nestjs/common';
import { BuffetService } from '@/buffet/buffet.service';
import { OrderService } from '@/order/order.service';
import { ApiResponse, OrderCreated } from '@/common/api-contracts';

@Controller('Buffet')
export class BuffetController {
	constructor(
		private readonly buffetService: BuffetService,
		private readonly orderService: OrderService,
	) {}

	@Get('mock-weight/:scaleId')
	getMockWeight(@Param('scaleId') scaleId: string): ApiResponse<number> {
		const getMockWeight = Math.random() * 2 + 0.5 // random weight between 0.5 and 2.5kg
		return { data: getMockWeight, message: 'Mock weight generated' };
	}

	@Get('mock-order')
	getMockOrder(): ApiResponse<OrderCreated> {
		const mockWeight = Math.random() * 2 + 0.5;
		const order = this.buffetService.processOrder(mockWeight);
		if (order) {
			const createdOrder = this.orderService.createOrder(order);
			return { data: createdOrder, message: 'Mock order created' };
		}

		return { data: null, message: 'Failed to create mock order' };
	}
}
