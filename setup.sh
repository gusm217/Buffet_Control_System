#!/bin/bash

# Instalar dependências
npm install

# Instalar socat se não estiver instalado
if ! command -v socat &> /dev/null
then
    echo "socat não encontrado. Instalando..."
    sudo apt-get update
    sudo apt-get install -y socat
fi

# Criar portas seriais virtuais
echo "Criando portas seriais virtuais..."
SOCAT_OUTPUT=$(socat -d -d pty,raw,echo=0 pty,raw,echo=0 2>&1)
VIRT_PORT1=$(echo "$SOCAT_OUTPUT" | grep -o '/dev/pts/[0-9]*' | sed -n 1p)
VIRT_PORT2=$(echo "$SOCAT_OUTPUT" | grep -o '/dev/pts/[0-9]*' | sed -n 2p)

# Atualizar o arquivo de configuração
echo "Atualizando arquivo de configuração..."
cat > src/config/scale.config.ts << EOL
import { Scale } from '../serial-communication/interfaces/scale.interface';

export const scaleConfig: Scale[] = [{
    id: 'scale1',
    portPath: '${VIRT_PORT1}',
    baudRate: 9600,
    weighUnit: 'g'
}];

export const DEFAULT_PORT = '${VIRT_PORT1}';
EOL

# Atualizar o script Python
echo "Atualizando script de simulação da balança..."
cat > simulate_scale.py << EOL
import serial
import time
import random
import os
import glob

def find_socat_port():
    ports = glob.glob('/dev/pts/*')
    for port in ports:
        try:
            ser = serial.Serial(port)
            ser.close()
            return port
        except (OSError, serial.SerialException):
            pass
    return None

def connect_to_serial(default_port='${VIRT_PORT2}', baud_rate=9600):
    port = os.environ.get('SCALE_PORT') or find_socat_port() or default_port
    try:
        return serial.Serial(port, baud_rate)
    except serial.SerialException:
        print(f"Não foi possível conectar à porta {port}. Verifique se o socat está rodando.")
        return None

ser = connect_to_serial()

if ser:
    print(f"Conectado à porta: {ser.port}")
    while True:
        weight = random.uniform(500, 2500)  # Peso em gramas entre 500g e 2.5kg
        data = f"{weight:.2f}\n".encode()
        ser.write(data)
        time.sleep(1)
else:
    print("Não foi possível conectar a uma porta serial. Encerrando.")
EOL

echo "Configuração concluída!"
echo "Porta virtual 1 (para NestJS): ${VIRT_PORT1}"
echo "Porta virtual 2 (para simulação Python): ${VIRT_PORT2}"
echo "Para usar uma porta específica na simulação, execute:"
echo "SCALE_PORT=/dev/pts/X python simulate_scale.py"
