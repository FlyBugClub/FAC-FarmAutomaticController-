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
const int pumpPins[NUM_PUMPS] = { 2, 12, 13, 15 };
// D5, D6, D7, D8
WiFiConnection wifiConn;  //                           topic gửi lên        , topic đăng ký/lắng nghe
MQTTConnection mqttConn(mqtt_server, mqtt_client_id, char_x_send_to_client, char_x_client_to_server, char_x_last_will_message);
PumpController pumpControllers;

struct Pump {
  int index;               // Chỉ số của máy bơm
  String action;           // Hành động (action) của máy bơm
  String message;          // Tin nhắn (message) của máy bơm
  bool isOn;               // Trạng thái của máy bơm
  String lastPayloadSent;  // Payload cuối cùng được gửi
};

Pump pumps[NUM_PUMPS] = {
  { 1, "manual", "on", false },
  { 2, "manual", "on", false },
  { 3, "manual", "on", false },
  { 4, "manual", "on", false }
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
    digitalWrite(pumpPins[i], LOW);  // Đặt các chân pin ở mức LOW ban đầu
  }
}

void loop() {
  if (!wifiConn.isConnected()) {
    wifiConn.connectToWiFi(ssid, password);
  }
  if (!mqttConn.connected()) {
    mqttConn.reconnectMQTT();
  }

  String payload_sum = "[";     // Chuỗi JSON tổng hợp payload
  bool payloadChanged = false;  // Biến đánh dấu sự thay đổi payload

  for (int i = 0; i < NUM_PUMPS; ++i) {
    String currentPayload;

    // Kiểm tra nếu index của máy bơm khớp với currentIndex từ MQTT
    if (mqttConn.currentIndex == pumps[i].index) {
      // Lấy action và message hiện tại từ MQTT
      pumps[i].action = mqttConn.currentAction;
      pumps[i].message = mqttConn.currentMessage;

      // Xử lý action của máy bơm và nhận lại payload
      char* payload = pumpControllers.handleAction(pumps[i].action.c_str(), pumps[i].message.c_str(), pumps[i].index, pumpPins[i]);

      currentPayload = "{\"index\":\"" + String(pumps[i].index) + "\",\"payload\":{\"action\":\"" + pumps[i].action + "\",\"messages\":\"" + pumps[i].message + "\"}}";

      // Kiểm tra sự thay đổi so với payload trước đó của máy bơm
      if (currentPayload != pumps[i].lastPayloadSent) {
        pumps[i].lastPayloadSent = currentPayload;  // Lưu lại payload gửi gần đây nhất
        payloadChanged = true;                      // Đánh dấu có sự thay đổi payload
      }
    } else {
      // Nếu không phải là máy bơm có index khớp, giữ nguyên payload trước đó
      currentPayload = pumps[i].lastPayloadSent;
    }

    payload_sum += currentPayload;  // Thêm payload vào chuỗi tổng hợp
    if (i < NUM_PUMPS - 1) {
      payload_sum += ",";  // Thêm dấu phẩy nếu không phải là phần tử cuối cùng
    }
  }

  payload_sum += "]";  // Kết thúc chuỗi JSON tổng hợp

  // Kiểm tra nếu có sự thay đổi payload thì mới gửi lên MQTT
  if (payloadChanged) {
    Serial.println(payload_sum);                                   // In ra payload tổng hợp
    mqttConn.publish(char_x_send_to_client, payload_sum.c_str());  // Gửi payload tổng hợp lên MQTT
  }


  mqttConn.loop();
}
