#include <Arduino.h>
#include "wifiConnection.h"
#include "mqttConnection.h"
#include "PumpController.h"

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

const int NUM_PUMPS = 4;
const int pumpPins[NUM_PUMPS] = {2, 12, 13, 15};
// D5, D6, D7, D8
WiFiConnection wifiConn;//                           topic gửi lên        , topic đăng ký/lắng nghe
MQTTConnection mqttConn(mqtt_server, mqtt_client_id, char_x_send_to_client, char_x_client_to_server, char_x_last_will_message);
PumpController pumpControllers;

struct Pump {
  int index;         // Chỉ số của máy bơm
  String action;   // Hành động (action) của máy bơm
  String message;  // Tin nhắn (message) của máy bơm
  bool isOn;       // Trạng thái của máy bơm
};

Pump pumps[NUM_PUMPS] = {
  {1, "", "", false},
  {2, "", "", false},
  {3, "", "", false},
  {4, "", "", false}
};

void setup() {
  Serial.begin(9600);

  WiFiConnection::WifiCredentials wifiCreds = wifiConn.activateAPMode();
  ssid = wifiCreds.ssid;
  password = wifiCreds.password;

  wifiConn.connectToWiFi(ssid, password);

  mqttConn.setupMQTT();

  for (int i = 0; i < NUM_PUMPS; ++i) {
    pinMode(pumpPins[i], OUTPUT);
    digitalWrite(pumpPins[i], LOW); // Đặt các chân pin ở mức LOW ban đầu
  }
}

void loop() {
  if (!wifiConn.isConnected()) {
    wifiConn.connectToWiFi(ssid, password);
  }
  if (!mqttConn.connected()) {
    mqttConn.reconnectMQTT();
  }

  char* payload = nullptr;
  switch (mqttConn.currentIndex) {
    case 1:
      pumps[0].action = mqttConn.currentAction;
      pumps[0].message = mqttConn.currentMessage;
      payload = pumpControllers.handleAction(pumps[0].action.c_str(), pumps[0].message.c_str(), 1, 2);
      break;
    case 2:
      pumps[1].action = mqttConn.currentAction;
      pumps[1].message = mqttConn.currentMessage;
      payload = pumpControllers.handleAction(pumps[1].action.c_str(), pumps[1].message.c_str(), 2, 12);
      break;
    case 3:
      pumps[2].action = mqttConn.currentAction;
      pumps[2].message = mqttConn.currentMessage;
      payload = pumpControllers.handleAction(pumps[2].action.c_str(), pumps[2].message.c_str(), 3, 13);
      break;
    case 4:
      pumps[3].action = mqttConn.currentAction;
      pumps[3].message = mqttConn.currentMessage;
      payload = pumpControllers.handleAction(pumps[3].action.c_str(), pumps[3].message.c_str(), 4, 15);
      break;
    default:
      Serial.println("Index không hợp lệ");
      break;
  }

  if (payload != nullptr) {
    Serial.println(payload);  // In ra payload

    // Kiểm tra trạng thái hiện tại và trước đó của các máy bơm
    for (int i = 0; i < NUM_PUMPS; ++i) {
      bool currentState = digitalRead(pumpPins[i]);
      if (currentState != pumps[i].isOn) {
        mqttConn.publish(char_x_send_to_client, payload);  // Gửi lên MQTT nếu trạng thái thay đổi
        pumps[i].isOn = currentState;  // Cập nhật trạng thái trước đó
      }
    }
  }

  mqttConn.loop();
}
