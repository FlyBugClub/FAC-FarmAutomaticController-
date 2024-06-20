#ifndef MQTTCONNECTION_H
#define MQTTCONNECTION_H

#include <ESP8266WiFi.h>
#include <PubSubClient.h>

extern WiFiClient espClient;
extern PubSubClient mqttClient;

extern const char* mqtt_server;
extern const char* mqtt_client_id;
extern const char* mqtt_topic_send;
extern const char* mqtt_topic_hello;

void mqttCallback(char* topic, byte* payload, unsigned int length);
void setupMQTT(PubSubClient& mqttClient);
void reconnectMQTT(PubSubClient& mqttClient);

#endif  // WIFICONNECTION_H