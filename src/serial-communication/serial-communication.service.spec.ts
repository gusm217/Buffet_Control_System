import { Test, TestingModule } from '@nestjs/testing';
import { SerialCommunicationService } from './serial-communication.service';
import { SerialPort } from 'serialport';
import { Scale } from 'src/serial-communication/interfaces/scale.interface';
import { serialize } from 'v8';
import { mock } from 'node:test';

jest.mock('serialport');

describe('SerialCommunicationService', () => {
	let service: SerialCommunicationService;

	const mockOn = jest.fn();
	const mockSerialPort = jest.fn().mockImplementation(() => ({
		on: mockOn,
	}));

  beforeEach(async () => {
		(SerialPort as jest.MockedClass<typeof SerialPort>).mockImplementation(mockSerialPort);
    const module: TestingModule = await Test.createTestingModule({
      providers: [SerialCommunicationService],
    }).compile();

    service = module.get<SerialCommunicationService>(SerialCommunicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

	it('should initialize scales', async () => {
		const mockScales: Scale[] = [
			{ id: 'scale1', portPath: '/dev/ttyUSB0', baudRate: 9600, weighUnit: 'g' },
			{ id: 'scale2', portPath: '/dev/ttyUSB1', baudRate: 19200, weighUnit: 'kg' },
		];

		await service.initializeScales(mockScales);

		expect(mockSerialPort).toHaveBeenCalledTimes(2);
		expect(mockSerialPort).toHaveBeenCalledWith({ path: '/dev/ttyUSB0', baudRate: 9600 });
		expect(mockSerialPort).toHaveBeenCalledWith({ path: '/dev/ttyUSB1', baudRate: 19200 });
	});

	it('should read data from a specific scale', async () => {
		const mockScale: Scale[] = [
			{ id: 'scale1', portPath: '/dev/ttyUSB0', baudRate: 9600, weighUnit: 'g' },
		]

		await service.initializeScales(mockScale);

		const dataCallback = jest.fn();
		service.onData('scale1', dataCallback);

		expect(mockOn).toHaveBeenCalledWith('data', expect.any(Function));


		const onCallback = mockOn.mock.calls[0][1];
		onCallback(Buffer.from('1500'));

		expect(dataCallback).toHaveBeenLastCalledWith(1.5);
	});


	it('should throw an error for non-existent scale', () => {
		expect(() => service.onData('nonexistent', jest.fn())).toThrow('Scale with id nonexistent not found');
	});
});
