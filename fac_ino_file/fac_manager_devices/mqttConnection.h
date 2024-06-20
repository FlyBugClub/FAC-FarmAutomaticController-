#ifndef MQTTCONNECTION_H
#define MQTTCONNECTION_H

#include <ESP8266WiFi.h>
#include <PubSubClient.h>

class MQTTConnection {
public:
  MQTTConnection(const char* server, const char* client_id, const char* topic_send, const char* topic_hello);

  void setupMQTT();
  void reconnectMQTT();
  void mqttCallback(char* topic, byte* payload, unsigned int length);
  void loop();
  bool connected();

private:
  WiFiClient espClient;
  PubSubClient mqttClient;
  const char* mqtt_server;
  const char* mqtt_client_id;
  const char* mqtt_topic_send;
  const char* mqtt_topic_hello;
};

#endif  // MQTTCONNECTION_H
