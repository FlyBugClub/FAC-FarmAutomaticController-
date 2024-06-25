#include "mqttConnection.h"
#include <ArduinoJson.h> // Bao gồm thư viện ArduinoJSON
MQTTConnection::MQTTConnection(const char* server, const char* client_id, const char* topic_send, const char* topic_recive,  const char* mqtt_topic_lwm)
  : mqtt_server(server), mqtt_client_id(client_id), mqtt_topic_send(topic_send), mqtt_topic_recive(topic_recive), mqttClient(espClient), mqtt_topic_lwm(mqtt_topic_lwm) {
}

void MQTTConnection::setupMQTT() {
  mqttClient.setServer(mqtt_server, 1883);
  mqttClient.setCallback([this](char* topic, byte* payload, unsigned int length) {
    this->mqttCallback(topic, payload, length);
  });
}

void MQTTConnection::reconnectMQTT() {
  while (!mqttClient.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (mqttClient.connect(mqtt_client_id, mqtt_topic_lwm, 0, true, "{\"status\": false}")) {
      Serial.println("connected");
      mqttClient.publish(mqtt_topic_lwm, "{\"status\": true}", true);
      mqttClient.subscribe(mqtt_topic_recive);
      mqttClient.subscribe(mqtt_topic_send);
      Serial.println("mqtt_topic_lwm");
      Serial.println(mqtt_topic_lwm);
      mqttClient.subscribe(mqtt_topic_lwm);

    } else {
      Serial.print("failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void MQTTConnection::mqttCallback(char* topic, byte* payload, unsigned int length) {
  if (strcmp(topic, mqtt_topic_recive) == 0) {
     Serial.print("da nhan  o topic recive");
  } else if (strcmp(topic, mqtt_topic_recive) == 0) {
    Serial.print("da nhan o topic recive");
  }
}

void MQTTConnection::loop() {
  mqttClient.loop();
}

bool MQTTConnection::connected() {
  return mqttClient.connected();
}

void MQTTConnection::processPumps(const char* jsonPayload) {

  const char* message = "hello";
  Serial.println("Da gui");
  mqttClient.publish(mqtt_topic_send, message);
}
