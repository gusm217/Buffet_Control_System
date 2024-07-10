import { Injectable } from '@nestjs/common';
import { SerialPort } from 'serialport';
import { Scale } from 'src/serial-communication/interfaces/scale.interface';

@Injectable()
export class SerialCommunicationService {
	private scales: Map<string, {port: SerialPort; config: Scale }> = new Map();

	async initializeScales(scaleConfigs: Scale[]): Promise<void> {
		for (const config of scaleConfigs) {
			const port = new SerialPort({
				path: config.portPath,
				baudRate: config.baudRate,
			});
			this.scales.set(config.id, { port, config });
		}
	}

	onData(scaleId: string, callback: (weight: number) => void): void {
		const scale = this.scales.get(scaleId);
		if (!scale) {
			throw new Error(`Scale with id ${scaleId} not found`);
		}

		scale.port.on('data', (data: Buffer) => {
			const weight = this.parseWeight(data, scale.config.weighUnit);
			callback(weight);
		})
	}

	private parseWeight(data: Buffer, unit: 'g' | 'kg'): number {
		const weightStr = data.toString().trim();
		const weight = parseFloat(weightStr);
		return unit === 'kg' ? weight : weight/1000;
	}
}
