#include "mqttConnection.h"

WiFiClient espClient;
PubSubClient mqttClient(espClient);


const char* mqtt_server = "broker.emqx.io";
const uint16_t mqtt_port = 1883;
const char* mqtt_topic_hello = "hello_topic";
const char* mqtt_topic_send = "hihihihihehe";
const char* mqtt_client_id = "helloem";

void setupMQTT(PubSubClient& mqttClient) {
  
  mqttClient.setServer(mqtt_server, mqtt_port);
  mqttClient.setCallback(mqttCallback);
}

void reconnectMQTT(PubSubClient& mqttClient) {
  while (!mqttClient.connected()) {
    Serial.print("Attempting MQTT connection...");
    
    if (mqttClient.connect(mqtt_client_id)) {
      Serial.println("connected");
      mqttClient.subscribe("hello_topic");
    } else {
      Serial.print("failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}