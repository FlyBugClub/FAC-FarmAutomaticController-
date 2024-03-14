#include <Arduino.h>
#include <Wire.h>
#include "Adafruit_SHT31.h"

#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "secret_pass.h"

const char* mqtt_server = "broker.emqx.io";
const uint16_t mqtt_port = 1883;
const char* mqtt_topic_hello = "hello_topic";

WiFiClient espClient;
PubSubClient client(espClient);

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("helloem")) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(9600);

  // Initialize WiFi connection
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");

  // Initialize MQTT connection
  client.setServer(mqtt_server, mqtt_port);
  reconnect();
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Send "hello" message
  sendHelloMessage();
  delay(1000); // Adjust delay as needed
}

void sendHelloMessage() {
  if (client.connected()) {
    client.publish(mqtt_topic_hello, "hello");
  }
}
