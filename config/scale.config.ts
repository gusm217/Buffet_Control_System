import { Scale } from "@/serial-communication/interfaces/scale.interface";

export const scaleConfig: Scale[] = [{
  id: 'scale1',
  portPath: '${VIRT_PORT1}',
  baudRate: 9600,
  weighUnit: 'g'
}];
