#include "mqttConnection.h"

MQTTConnection::MQTTConnection(const char* server, const char* client_id, const char* topic_send, const char* topic_hello)
  : mqtt_server(server), mqtt_client_id(client_id), mqtt_topic_send(topic_send), mqtt_topic_hello(topic_hello), mqttClient(espClient) {
}

void MQTTConnection::setupMQTT() {
    mqttClient.setServer(mqtt_server, 1883);
    mqttClient.setCallback([this](char* topic, byte* payload, unsigned int length) { this->mqttCallback(topic, payload, length); });
}

void MQTTConnection::reconnectMQTT() {
    while (!mqttClient.connected()) {
        Serial.print("Attempting MQTT connection...");
        if (mqttClient.connect(mqtt_client_id)) {
            Serial.println("connected");
            mqttClient.subscribe(mqtt_topic_hello);
        } else {
            Serial.print("failed, rc=");
            Serial.print(mqttClient.state());
            Serial.println(" try again in 5 seconds");
            delay(5000);
        }
    }
}

void MQTTConnection::mqttCallback(char* topic, byte* payload, unsigned int length) {
    Serial.print("Message arrived [");
    Serial.print(topic);
    Serial.print("] ");
    for (unsigned int i = 0; i < length; i++) {
        Serial.print((char)payload[i]);
    }
    Serial.println();
}

void MQTTConnection::loop() {
    mqttClient.loop();
}

bool MQTTConnection::connected() {
    return mqttClient.connected();
}
