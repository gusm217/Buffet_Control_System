import { Module } from "@nestjs/common";
import { BuffetController } from "@/buffet/buffet.controller";
import { BuffetService } from "@/buffet/buffet.service";
import { OrderModule } from "@/order/order.module";

@Module ({
	imports: [OrderModule],
	controllers: [BuffetController],
	providers: [BuffetService],
	exports: [BuffetService],
})

export class BuffetModule {}
