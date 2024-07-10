import { Test, TestingModule } from '@nestjs/testing';
import { SerialCommunicationService } from './serial-communication.service';
import { SerialPort } from 'serialport';
import { mock } from 'node:test';

jest.mock('serialport');
const mockOn = jest.fn();
const mockSerialPort = jest.fn().mockImplementation(() => ({
  on: mockOn,
}));
(SerialPort as jest.MockedClass<typeof SerialPort>).mockImplementation(mockSerialPort);

describe('SerialCommunicationService', () => {
  let service: SerialCommunicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SerialCommunicationService],
    }).compile();

    service = module.get<SerialCommunicationService>(SerialCommunicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

	it('should initialize serial ports', async () => {
		const mockPorts = [
			{ path: '/dev/ttyUSB0', manufacturer: 'FTDI' },
			{ path: '/dev/ttyUSB1', manufacturer: 'FTDI' },
		];

		(SerialPort.list as jest.Mock).mockResolvedValue(mockPorts);

		const ports = await service.initializePorts();
		expect(ports).toBeDefined();
		expect(Array.isArray(ports)).toBe(true);
		expect(ports.length).toBe(2);
	});

	it('should read data from serial port', (done) => {
		const mockPort = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600});
		(service as any).ports = [mockPort];

		service.onData((data: string) => {
			expect(data).toBeDefined();
			expect(typeof data).toBe('string');
			expect(data).toBe('Test data');
			done();
		});

		const onCallback = mockOn.mock.calls[0][1];
  	onCallback(Buffer.from('Test data'));
	})
});
