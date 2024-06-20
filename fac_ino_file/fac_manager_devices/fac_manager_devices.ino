#include <Arduino.h>
#include "my_module.h"
#include "wifiConnection.h"
#include "mqttConnection.h"

String ssid = "DAT_MOBILE";
String password = "ktd01042013";

const char* mqtt_server = "broker.emqx.io";
const uint16_t mqtt_port = 1883;
const char* mqtt_topic_iot = "fac_iot";
const char* mqtt_topic_app = "fac_app";
const char* mqtt_client_id = "helloem";

WiFiConnection wifiConn;
MQTTConnection mqttConn(mqtt_server, mqtt_client_id, mqtt_topic_app, mqtt_topic_iot);

void setup() {
  Serial.begin(9600);

  WiFiConnection::WifiCredentials wifiCreds = wifiConn.activateAPMode();
  ssid = wifiCreds.ssid;
  password = wifiCreds.password;

  wifiConn.connectToWiFi(ssid, password);

  mqttConn.setupMQTT();
}

void loop() {
  if (!wifiConn.isConnected()) {
    wifiConn.connectToWiFi(ssid, password);
  }
  if (!mqttConn.connected()) {
    mqttConn.reconnectMQTT();
  }
  mqttConn.loop();
}
