#include <Arduino.h>
#include "my_module.h"
#include "wifiConnection.h"
#include "mqttConnection.h"

String ssid = "DAT_MOBILE";
String password = "ktd01042013";

const char* mqtt_server = "broker.emqx.io";
const uint16_t mqtt_port = 1883;

String send_to_client = "SendToClient";
String client_to_server = "ClientToServer";
String last_will_message = "LastWillMessage";
const char* mqtt_client_id = "helloem";

String id_esp = "111";
String x_send_to_client = id_esp + send_to_client;
String x_client_to_server = id_esp + client_to_server;
String x_last_will_message = id_esp + last_will_message;

const char* char_x_send_to_client = x_send_to_client.c_str();
const char* char_x_client_to_server = x_client_to_server.c_str();
const char* char_x_last_will_message = x_last_will_message.c_str();

WiFiConnection wifiConn;//                           topic gửi lên        , topic đăng ký/lắng nghe
MQTTConnection mqttConn(mqtt_server, mqtt_client_id, char_x_send_to_client, char_x_client_to_server, char_x_last_will_message);

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
  // mqttConn.processPumps("dummy_json_payload");

  mqttConn.loop();
    
}
