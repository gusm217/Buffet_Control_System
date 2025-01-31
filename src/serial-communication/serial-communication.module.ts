import { Module } from '@nestjs/common';
import { SerialCommunicationService } from './serial-communication.service';

@Module({
  providers: [SerialCommunicationService],
	exports: [SerialCommunicationModule]
})
export class SerialCommunicationModule {}
