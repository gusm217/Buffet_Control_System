import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SerialCommunicationModule } from './serial-communication/serial-communication.module';

@Module({
  imports: [SerialCommunicationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
