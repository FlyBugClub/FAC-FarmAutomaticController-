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
const char* mqtt_topic_hi = "hi_topic";

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
  client.setCallback(callback);
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
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.println(topic);

  // Check if the received message is from the "hello" topic
  if (strcmp(topic, mqtt_topic_hello) == 0) {
    // Convert payload to string
    String payloadStr;
    for (int i = 0; i < length; i++) {
      payloadStr += (char)payload[i];
    }
    
    // Parse the JSON payload
    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, payloadStr);

    // Check for parsing errors
    if (error) {
      Serial.print("deserializeJson() failed: ");
      Serial.println(error.f_str());
      return;
    }

    // Extract value based on key
    const char* msg = doc["msg"];

    // Print the extracted value
    Serial.print("Received message: ");
    Serial.println(msg);
    
    // Send "hi" message in response
    sendHiMessage();
  }
}


void sendHelloMessage() {
  StaticJsonDocument<200> doc;
  doc["msg"] = "hello";
  
  char buffer[256];
  size_t n = serializeJson(doc, buffer);

  if (client.connected()) {
    client.publish(mqtt_topic_hello, buffer, n);
  }
}


void sendHiMessage() {
  StaticJsonDocument<200> doc;
  doc["msg"] = "hi";
  
  char buffer[256];
  size_t n = serializeJson(doc, buffer);

  if (client.connected()) {
    client.publish(mqtt_topic_hi, buffer, n);
  }
}