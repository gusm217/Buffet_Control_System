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

export const scaleConfig: Scale[] = {
	id: 'scale1',
  portPath: '${VIRT_PORT1}',
  baudRate: 9600,
  weighUnit: 'g'
};
EOL

# Atualizar o script Python
echo "Atualizando script de simulação da balança..."
cat > simulate_scale.py << EOL
import serial
import time
import random

ser = serial.Serial('${VIRT_PORT2}', 9600)

while True:
    weight = random.uniform(500, 2500)  # Peso em gramas entre 500g e 2.5kg
    data = f"{weight:.2f}\n".encode()
    ser.write(data)
    time.sleep(1)
EOL

echo "Configuração concluída!"
echo "Porta virtual 1 (para NestJS): ${VIRT_PORT1}"
echo "Porta virtual 2 (para simulação Python): ${VIRT_PORT2}"
