"""
SENTRY Telemetry Hardware Node Client (Python Example)
Run this script on a Raspberry Pi, Jetson Nano, or Python-enabled IoT gateway
connected to sensors (DHT22, Water Level Sensor, Anemometer, GPS module).
"""

import time
import random
import json
import urllib.request

# Central SENTRY Server Endpoint
SERVER_URL = "http://localhost:5000/api/nodes/telemetry"

# Config for this hardware node (Manali Accident & Avalanche Sector)
NODE_ID = "NODE-06"
NODE_NAME = "Gulaba Avalanche & Hairpin Hazard Checkpoint"
LATITUDE = 32.3210
LONGITUDE = 77.2080
ELEVATION = "2,780m"

def read_hardware_sensors():
    """
    Replace this simulated sensor reader with actual GPIO / Serial / I2C calls.
    Example:
      - DHT22 / BME280 for Temp
      - Ultrasonic sensor for Water Depth
      - Anemometer pulse counter for Wind Speed
    """
    return {
        "nodeId": NODE_ID,
        "name": NODE_NAME,
        "lat": LATITUDE + random.uniform(-0.0005, 0.0005),
        "lng": LONGITUDE + random.uniform(-0.0005, 0.0005),
        "elevation": ELEVATION,
        "temp": round(26.5 + random.uniform(-1.5, 2.0), 1),
        "waterLevel": round(1.4 + random.uniform(-0.2, 0.4), 2),
        "windSpeed": round(15.0 + random.uniform(-3.0, 5.0), 1),
        "battery": random.randint(85, 95),
        "rssi": random.randint(-75, -60)
    }

def send_telemetry():
    payload = read_hardware_sensors()
    data = json.dumps(payload).encode('utf-8')
    
    req = urllib.request.Request(SERVER_URL, data=data, headers={'Content-Type': 'application/json'})
    
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode('utf-8')
            print(f"[{time.strftime('%H:%M:%S')}] Telemetry Sent -> Server Response:", res_body)
    except Exception as e:
        print(f"[{time.strftime('%H:%M:%S')}] Failed to send telemetry:", e)

if __name__ == "__main__":
    print(f"--- SENTRY Telemetry Node {NODE_ID} Started ---")
    print(f"Target Server: {SERVER_URL}")
    print("Streaming sensor updates every 5 seconds...")
    
    while True:
        send_telemetry()
        time.sleep(5)
