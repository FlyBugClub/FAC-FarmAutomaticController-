#include "mqttConnection.h"

MQTTConnection::MQTTConnection(const char* server, const char* client_id, const char* topic_send, const char* topic_hello)
  : mqtt_server(server), mqtt_client_id(client_id), mqtt_topic_send(topic_send), mqtt_topic_hello(topic_hello), mqttClient(espClient) {
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
  if (strcmp(topic, mqtt_topic_send) == 0) {
    processPumps((const char*)payload);
  } else if (strcmp(topic, mqtt_topic_hello) == 0) {
    // Handle other MQTT topics as needed
  }
}

void MQTTConnection::loop() {
  mqttClient.loop();
}

bool MQTTConnection::connected() {
  return mqttClient.connected();
}

void MQTTConnection::processPumps(const char* jsonPayload) {
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, jsonPayload);

  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.c_str());
    return;
  }

  int i = 0;
  for (JsonVariant v : doc.as<JsonArray>()) {
    JsonObject pumpData = v.as<JsonObject>();
    pumps[i].name = pumpData["name"].as<String>();
    pumps[i].sensor = pumpData["sensor"].as<String>();
    pumps[i].mode = pumpData["mode"].as<int>();
    i++;
    if (i >= sizeof(pumps) / sizeof(pumps[0])) {
      break;  // Ensure we don't exceed array bounds
    }
  }

  // Print out the pump information (for debugging)
  for (int j = 0; j < i; j++) {
    Serial.print("Pump ");
    Serial.print(j + 1);
    Serial.print(": Name=");
    Serial.print(pumps[j].name);
    Serial.print(", Sensor=");
    Serial.print(pumps[j].sensor);
    Serial.print(", Mode=");
    Serial.println(pumps[j].mode);
  }
}
