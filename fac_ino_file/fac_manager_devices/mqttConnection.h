#ifndef MQTTCONNECTION_H
#define MQTTCONNECTION_H

#include <ESP8266WiFi.h>
#include <PubSubClient.h>

class MQTTConnection {
public:
  MQTTConnection(const char* server, const char* client_id, const char* topic_send, const char* topic_recive, const char* mqtt_topic_lwm);

  void setupMQTT();
  void loop();
  bool connected();
  void reconnectMQTT();
  void setCallback(MQTT_CALLBACK_SIGNATURE);

private:
  WiFiClient espClient;
  PubSubClient mqttClient;
  const char* mqtt_server;
  const char* mqtt_client_id;
  const char* mqtt_topic_send;
  const char* mqtt_topic_recive;
  const char* mqtt_topic_lwm;
  void mqttCallback(char* topic, byte* payload, unsigned int length);
};

#endif  // MQTTCONNECTION_H
