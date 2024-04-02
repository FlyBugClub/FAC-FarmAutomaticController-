#include "secret_pass.h"
#include <Wire.h>
#include "Adafruit_SHT31.h"
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

const char* serverUrl = "http://example.com/api/data";
const int pumpPin = D6;
bool autoControl = true;
float desiredTemperature = 25.0;
float desiredHumidity = 60.0;
unsigned long lastSprayTime = 0;
bool wifiConnected = false;
bool sensorConnected = false;

Adafruit_SHT31 sht31 = Adafruit_SHT31();

void setup() {
  pinMode(pumpPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("SHT31 test");

  connectToWiFi();
}

void reconnectSensor() {
  Serial.println("Attempting to reconnect sensor...");
  
  if (!sht31.begin(0x44)) {
    Serial.println("Couldn't find SHT31. Retrying...");
    delay(1000);
    return;
  }

  Serial.println("Sensor reconnected successfully.");
  sensorConnected = true;
}

void loop() {
  if (!wifiConnected) {
    connectToWiFi();
  }

  if (!sensorConnected) {
    reconnectSensor();
  } else {
    float temperature = sht31.readTemperature();
    float humidity = sht31.readHumidity();
    manageAutoControl();
  }
}

void connectToWiFi() {
  WiFi.begin(ssid, pass);
  unsigned long startTime = millis();
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
    if (millis() - startTime > 30000) {
      break;
    }
  }

  if (WiFi.status() == WL_CONNECTED) {
    wifiConnected = true;
    Serial.println("WiFi connected");
    autoControl = true;
  } else {
    wifiConnected = false;
    Serial.println("WiFi connection failed");
    autoControl = false;
    digitalWrite(pumpPin, LOW);
  }
}

void manageAutoControl() {
  if (autoControl) {
    autoControlMode(desiredTemperature, desiredHumidity);
  }
}

void autoControlMode(float& temperature, float& humidity) {
  float currentHumidity = sht31.readHumidity();
  unsigned long currentMillis = millis();

  if (currentHumidity < humidity && currentMillis - lastSprayTime >= 10000) {
    digitalWrite(pumpPin, HIGH);
    lastSprayTime = currentMillis;
    delay(2000);
    digitalWrite(pumpPin, LOW);
  } else {
    digitalWrite(pumpPin, LOW);
  }
}
