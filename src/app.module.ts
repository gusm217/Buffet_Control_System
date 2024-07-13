import { Module } from '@nestjs/common';
import { SerialCommunicationService } from '@/serial-communication/serial-communication.service';
import { BuffetService } from '@/buffet/buffet.service';
import { BuffetGateway } from '@/websocket/buffet.gateway';
import { OrderModule } from '@/order/order.module';
import { SerialCommunicationModule } from '@/serial-communication/serial-communication.module';
import { BuffetModule } from '@/buffet/buffet.module';
import { WebsocketModule } from '@/websocket/websocket.module';

@Module({
  imports: [
		BuffetModule,
		OrderModule,
		SerialCommunicationModule,
		WebsocketModule,
	],
  providers: [SerialCommunicationService, BuffetService, BuffetGateway],
})
export class AppModule {}
