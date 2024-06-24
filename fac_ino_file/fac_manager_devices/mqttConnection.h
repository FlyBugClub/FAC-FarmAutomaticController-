#ifndef MQTTCONNECTION_H
#define MQTTCONNECTION_H

#include <ESP8266WiFi.h>
#include <PubSubClient.h>

class MQTTConnection {
public:
struct Pump {
    String name;
    String sensor;
    int mode;
  };

  MQTTConnection(const char* server, const char* client_id, const char* topic_send, const char* topic_recive);

  void setupMQTT();
  void reconnectMQTT();

  void loop();
  bool connected();

  void processPumps(const char* jsonPayload);

private:
  WiFiClient espClient;
  PubSubClient mqttClient;
  const char* mqtt_server;
  const char* mqtt_client_id;
  const char* mqtt_topic_send;
  const char* mqtt_topic_recive;
  Pump pumps[3]; // Maximum 3 pumps, adjust as needed
  void mqttCallback(char* topic, byte* payload, unsigned int length);
};

#endif  // MQTTCONNECTION_H
