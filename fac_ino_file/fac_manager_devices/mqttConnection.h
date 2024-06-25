#ifndef MQTTConnection_h
#define MQTTConnection_h

#include <Arduino.h>
#include <WiFiClient.h>
#include <PubSubClient.h>
#include "PumpController.h" // Import PumpController class

class MQTTConnection {
public:
  MQTTConnection(const char* server, const char* client_id, const char* topic_send, const char* topic_recive,  const char* mqtt_topic_lwm);
  void setupMQTT();
  void reconnectMQTT();
  void loop();
  bool connected();
  void publish(const char* topic, const char* message, bool retain = false); // Thêm tham số retain mặc định là false

  const char* mqtt_server;
  const char* mqtt_client_id;
  const char* mqtt_topic_send;
  const char* mqtt_topic_recive;
  const char* mqtt_topic_lwm;
  WiFiClient espClient;
  PubSubClient mqttClient;
  PumpController pumpController; // Instance of PumpController

  void mqttCallback(char* topic, byte* payload, unsigned int length);
};

#endif
