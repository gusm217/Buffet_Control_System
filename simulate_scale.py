import serial
import time
import random
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

def connect_to_serial(baud_rate=9600):
    port = find_socat_port()
    if port:
        try:
            return serial.Serial(port, baud_rate)
        except serial.SerialException:
            print(f"Não foi possível conectar à porta {port}.")
    else:
        print("Nenhuma porta socat encontrada. Verifique se o socat está rodando.")
    return None

ser = connect_to_serial()

if ser:
    print(f"Conectado à porta: {ser.port}")
    while True:
        weight = random.uniform(500, 2500)  # Peso em gramas entre 500g e 2.5kg
        data = f"{weight:.2f}\n".encode()
        ser.write(data)
        time.sleep(1)
