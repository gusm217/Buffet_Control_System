import { Injectable } from '@nestjs/common';
import { SerialPort } from 'serialport';

interface PortConfig {
	path: string;
	baudRate: number;
}

@Injectable()
export class SerialCommunicationService {
	private ports: SerialPort[] = [];

	async initializePorts(): Promise<SerialPort[]> {
		const availablePorts = await SerialPort.list();
		this.ports = availablePorts.map(port => {
			const config: PortConfig = { path: port.path, baudRate: 9600 };
			return new SerialPort(config);
		})
		return this.ports;
	}

	onData(callback: (data: string) => void): void {
		this.ports.forEach(port => {
			port.on('data', (data:Buffer) => {
				callback(data.toString());
			});
		});
	}
}
