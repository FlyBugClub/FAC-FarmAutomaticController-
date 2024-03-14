#include <Arduino.h>
#include <Wire.h>
#include "Adafruit_SHT31.h"

#include <ESP8266WiFi.h> // Include the ESP8266WiFi library
#include <PubSubClient.h>
#include <ArduinoJson.h>
// Thông tin về MQTT Broker
#define mqtt_server "broker.emqx.io"
#include "secret_pass.h"

const uint16_t mqtt_port = 1883; //Port của MQTT broker
#define mqtt_topic_temp "temperature"
#define mqtt_topic_humi "humidity"
WiFiClient espClient; // Now WiFiClient should be recognized
PubSubClient client(espClient);
StaticJsonDocument<256> doc;

Adafruit_SHT31 sht31 = Adafruit_SHT31();

const int pumpPin = D6; // Chân kết nối của máy bơm với ESP8266

bool autoControl = true;
float desiredTemperature = 25.0;
float desiredHumidity = 60.0;

unsigned long lastSprayTime = 0;

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("helloem")) {
      client.subscribe(mqtt_topic_humi);
      client.subscribe(mqtt_topic_temp);
      
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  pinMode(pumpPin, OUTPUT);
  Serial.begin(9600);
  
  while (!Serial)
    delay(10);

  Serial.println("SHT31 test");
  if (!sht31.begin(0x44)) {   // Set to 0x45 for alternate i2c addr
    Serial.println("Couldn't find SHT31");
    while (1) delay(1);
  }

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  reconnect();
}

void autoControlMode(float& temperature, float& humidity) {
  float t = sht31.readTemperature();
  float currentHumidity = sht31.readHumidity();

  unsigned long currentMillis = millis();
  
  if (currentHumidity < humidity) {
    if (currentMillis - lastSprayTime >= 10000) {
      digitalWrite(pumpPin, HIGH);
      lastSprayTime = currentMillis; 
      delay(2000);
      digitalWrite(pumpPin, LOW);
    }
  } else {
    digitalWrite(pumpPin, LOW);
  }
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  
  client.loop();

  if (autoControl) {
    autoControlMode(desiredTemperature, desiredHumidity);
  }

  float temperature = sht31.readTemperature();
  float humidity = sht31.readHumidity();

  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.print("% - Temperature: ");
  Serial.print(temperature);
  Serial.println("°C");

  publishData(temperature, humidity);
  delay(2000); // Đợi 2 giây trước khi đọc lại dữ liệu từ cảm biến
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.println(topic);
}

void publishData(float temperature, float humidity) {
  doc["temperature"] = temperature;
  doc["humidity"] = humidity;

  char buffer[256];
  size_t n = serializeJson(doc, buffer);
  
  client.publish(mqtt_topic_temp, buffer, n);
}

