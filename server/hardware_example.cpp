/*
 * SENTRY Field Node - ESP32 / Arduino Microcontroller Sketch
 * Requirements: ESP32 board support, ArduinoJson library, HTTPClient
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Server URL (Replace with your server IP address, e.g., http://192.168.1.100:5000/api/nodes/telemetry)
const char* serverUrl = "http://192.168.1.100:5000/api/nodes/telemetry";

// Node Hardware Credentials & GPS Fix (Rohtang Pass Marhi Curve, Manali)
const char* nodeId = "NODE-01";
const float nodeLat = 32.3580;
const float nodeLng = 77.2215;

unsigned long lastSendTime = 0;
const unsigned long sendInterval = 5000; // Send telemetry every 5 seconds

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if (millis() - lastSendTime >= sendInterval) {
    lastSendTime = millis();
    
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(serverUrl);
      http.addHeader("Content-Type", "application/json");

      // Read real hardware sensors (e.g. analogRead(A0) for water sensor, DHT for temp)
      float tempVal = 28.5 + (random(-10, 10) / 10.0);
      float waterVal = 1.2 + (random(-1, 2) / 10.0);
      float windVal = 14.0 + (random(-2, 5) / 10.0);
      int batteryLevel = 92;

      // Construct JSON payload
      StaticJsonDocument<256> doc;
      doc["nodeId"] = nodeId;
      doc["lat"] = nodeLat;
      doc["lng"] = nodeLng;
      doc["temp"] = tempVal;
      doc["waterLevel"] = waterVal;
      doc["windSpeed"] = windVal;
      doc["battery"] = batteryLevel;
      doc["rssi"] = WiFi.RSSI();

      String jsonOutput;
      serializeJson(doc, jsonOutput);

      int httpResponseCode = http.POST(jsonOutput);
      
      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.print("Telemetry Sent OK: ");
        Serial.println(response);
      } else {
        Serial.print("Error sending HTTP POST: ");
        Serial.println(httpResponseCode);
      }
      http.end();
    } else {
      Serial.println("WiFi Disconnected!");
    }
  }
}
