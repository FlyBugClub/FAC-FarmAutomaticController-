#include <Arduino.h>
#include "my_module.h"
#include "wifiConnection.h"
#include "mqttConnection.h"

String ssid = "DAT_MOBILE";
String password = "ktd01042013";

const char* mqtt_server = "broker.emqx.io";
const uint16_t mqtt_port = 1883;

const char* send_to_client = "SendToClient";
const char* client_to_server = "ClientToServer";
const char* mqtt_client_id = "helloem";


WiFiConnection wifiConn;//                           topic gửi lên , topic đăng ký/lắng nghe
MQTTConnection mqttConn(mqtt_server, mqtt_client_id, send_to_client, client_to_server);

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
