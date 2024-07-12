import { Injectable, Logger } from '@nestjs/common';
import { SerialPort } from 'serialport';
import { Scale } from 'src/serial-communication/interfaces/scale.interface';

@Injectable()
export class SerialCommunicationService {
	public getScaleIds(): string[] {
		return Array.from(this.scales.keys());
	}
	private scales: Map<string, {port: SerialPort; config: Scale, lastWeights: number[] }> = new Map();
	private readonly logger = new Logger(SerialCommunicationService.name);


	async initializeScales(scaleConfigs: Scale[]): Promise<void> {
		for (const config of scaleConfigs) {
			try {
				const port = new SerialPort({
					path: config.portPath,
					baudRate: config.baudRate,
				});
				this.scales.set(config.id, { port, config, lastWeights: [] });
				this.logger.log(`Scale ${config.id} initilialized`);
			} catch (error) {
				this.logger.error(`Failed to initialize scale ${config.id}`, error.stack);
			}
		}
	}

	onData(scaleId: string, callback: (weight: number) => void): void {
		const scale = this.scales.get(scaleId);
		if (!scale) {
			throw new Error(`Scale with id ${scaleId} not found`);
		}

		scale.port.on('data', (data: Buffer) => {
			const weight = this.parseWeight(data, scale.config.weighUnit);
			scale.lastWeights.push(weight);
			if(scale.lastWeights.length > 5) {
				scale.lastWeights.shift();
			}
			if(this.isWeightStable(scale.lastWeights)) {
				callback(weight);
			}
		})
	}

	private parseWeight(data: Buffer, unit: 'g' | 'kg'): number {
		const weightStr = data.toString().trim();
		const weight = parseFloat(weightStr);
		return unit === 'kg' ? weight : weight/1000;
	}

	private isWeightStable(weights: number[]): boolean {
		if (weights.length < 3) return false;
		const tolerance = 0.005; // 5g tolerance
		const avg = weights.reduce((a, b) => a + b) / weights.length;
		return weights.every(w => Math.abs(w - avg) <= tolerance);
	}

	getCurrentWeight(scaleId: string): number | null {
		const scale = this.scales.get(scaleId);
		if (!scale || scale.lastWeights.length === 0) {
			return null;
		}
		return scale.lastWeights[scale.lastWeights.length - 1];
	}
}
