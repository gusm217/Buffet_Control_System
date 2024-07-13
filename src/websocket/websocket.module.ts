import { Module } from "@nestjs/common";
import { BuffetGateway } from "@/websocket/buffet.gateway";
import { SerialCommunicationModule } from "@/serial-communication/serial-communication.module";
import { BuffetModule } from "@/buffet/buffet.module";

@Module({
	imports: [
		SerialCommunicationModule,
		BuffetModule,
	],
	providers: [BuffetGateway],
	exports: [BuffetGateway],
})

export class WebsocketModule {}
