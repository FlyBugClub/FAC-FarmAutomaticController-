#include <EEPROM.h>
#include <ArduinoJson.h>
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

// String id_esp = "111";
uint32_t chipId = ESP.getChipId();
String id_esp = String(chipId, HEX);

String x_send_to_client = chipId + send_to_client;
String x_client_to_server = chipId + client_to_server;
String x_last_will_message = chipId + last_will_message;

const char* char_x_send_to_client = x_send_to_client.c_str();
const char* char_x_client_to_server = x_client_to_server.c_str();
const char* char_x_last_will_message = x_last_will_message.c_str();

const int NUM_PUMPS = 4;
const int pumpPins[NUM_PUMPS] = { 14, 12, 13, 15 };  // D5, D6, D7, D8
WiFiConnection wifiConn;  
MQTTConnection mqttConn(mqtt_server, mqtt_client_id, char_x_send_to_client, char_x_client_to_server, char_x_last_will_message);
PumpController pumpControllers;

struct Pump {
  int index;               
  String action;           
  String message;          
  bool isOn;               
  String lastPayloadSent;  
};

Pump pumps[NUM_PUMPS] = {
  { 1, "manual", "off", false },
  { 2, "manual", "off", false },
  { 3, "manual", "off", false },
  { 4, "manual", "off", false }
};

// Hàm lưu payload_sum vào EEPROM
void savePayloadSumToEEPROM(const String& payload_sum) {
  for (int i = 0; i < payload_sum.length(); ++i) {
    EEPROM.write(i, payload_sum[i]);
  }
  EEPROM.write(payload_sum.length(), '\0');  
  EEPROM.commit();
}
bool isJsonPayloadValid(const String& payload) {
  // Tạo một bộ đệm đủ lớn để chứa dữ liệu JSON
  StaticJsonDocument<512> doc;

  // Phân tích chuỗi JSON và kiểm tra tính hợp lệ
  DeserializationError error = deserializeJson(doc, payload);

  // Kiểm tra lỗi phân tích JSON
  if (error) {
    Serial.print("deserializeJson() failed: ");
    Serial.println(error.c_str());
    return false;
  }

  // Kiểm tra xem JSON có phải là một mảng và có các trường cần thiết không
  if (!doc.is<JsonArray>()) {
    Serial.println("Invalid JSON format: Not an array.");
    return false;
  }

  // Kiểm tra các yêu cầu khác tùy theo cấu trúc của JSON của bạn

  // Nếu không có lỗi và JSON hợp lệ, trả về true
  return true;
}
// Hàm đọc payload_sum từ EEPROM
String loadPayloadSumFromEEPROM() {
  char buffer[512];
  size_t i;
  for (i = 0; i < sizeof(buffer) - 1; ++i) {
    buffer[i] = EEPROM.read(i);
    if (buffer[i] == '\0') break;
  }
  buffer[i] = '\0';
  return String(buffer);
}

void setup() {
  Serial.begin(9600);
  EEPROM.begin(512);  // Initialize EEPROM with size 512 bytes

  // Kiểm tra xem EEPROM đã có dữ liệu hay chưa
  String initialPayload = loadPayloadSumFromEEPROM();
  bool validPayload = isJsonPayloadValid(initialPayload);

  // Kết nối đến mạng WiFi
  WiFiConnection::WifiCredentials wifiCreds = wifiConn.activateAPMode();
  ssid = wifiCreds.ssid;
  password = wifiCreds.password;
  wifiConn.connectToWiFi(ssid, password);

  // Chờ kết nối WiFi thành công
  while (!wifiConn.isConnected()) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected");

  // Kết nối đến broker MQTT
  mqttConn.setupMQTT();
  while (!mqttConn.connected()) {
    mqttConn.reconnectMQTT();
    delay(500);
    Serial.print(".");
  }
  Serial.println("MQTT connected");

  // Khởi tạo các chân pin điều khiển bơm
  for (int i = 0; i < NUM_PUMPS; ++i) {
    pinMode(pumpPins[i], OUTPUT);
    digitalWrite(pumpPins[i], LOW);  // Mặc định tắt các bơm
  }

  // Nếu EEPROM có dữ liệu hợp lệ, sử dụng giá trị từ EEPROM
  if (validPayload) {
    // Gửi payload tổng hợp lên MQTT khi kết nối lần đầu tiên
    mqttConn.publish(char_x_send_to_client, initialPayload.c_str());
  } else {
    // Khởi tạo payload sum ban đầu và lưu vào EEPROM
    StaticJsonDocument<512> doc;
    JsonArray arr = doc.to<JsonArray>();
    for (int i = 0; i < NUM_PUMPS; ++i) {
      JsonObject pump = arr.createNestedObject();
      pump["index"] = pumps[i].index;
      pump["payload"]["action"] = pumps[i].action;
      pump["payload"]["messages"] = pumps[i].message;
    }
    serializeJson(doc, initialPayload);
    savePayloadSumToEEPROM(initialPayload);

    // Gửi payload tổng hợp lên MQTT khi khởi tạo lần đầu tiên
    mqttConn.publish(char_x_send_to_client, initialPayload.c_str());
  }
}

void loop() {
  // Kiểm tra và tái kết nối WiFi, MQTT khi cần thiết
  if (!wifiConn.isConnected()) {
    wifiConn.connectToWiFi(ssid, password);
  }
  if (!mqttConn.connected()) {
    mqttConn.reconnectMQTT();
  }

  // Lấy payload từ EEPROM
  String payload_sum = loadPayloadSumFromEEPROM();

  // Cập nhật payload_sum từ handleNewMessages
  String updatedPayload = pumpControllers.handleNewMessages(mqttConn.currentAction, mqttConn.currentMessage, mqttConn.currentIndex, payload_sum.c_str());
  if (updatedPayload.length() > 0 && updatedPayload != payload_sum) {
    payload_sum = updatedPayload;
    // Lưu lại vào EEPROM khi có sự thay đổi
    savePayloadSumToEEPROM(payload_sum);

    // Gửi payload tổng hợp lên MQTT
    mqttConn.publish(char_x_send_to_client, payload_sum.c_str());
  }

  // Xử lý các hành động bơm nước
  pumpControllers.processPumpAction(payload_sum.c_str(), pumpPins, NUM_PUMPS);

  // Xử lý MQTT
  mqttConn.loop();
}

