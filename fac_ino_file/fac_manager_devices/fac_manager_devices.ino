#include <EEPROM.h>
#include <ArduinoJson.h>
#include "wifiConnection.h"
#include "mqttConnection.h"
#include "PumpController.h"

String ssid = "DAT_MOBILE";
String password = "ktd01042013";

const char* mqtt_server = "broker.emqx.io";
const uint16_t mqtt_port = 1883;

String send_to_client = "ServerToClient";
String client_to_server = "ClientToServer";
String last_will_message = "LastWillMessage";
const char* mqtt_client_id = "helloem";

uint32_t chipId = ESP.getChipId();
String id_esp = String(chipId, HEX);

String x_send_to_client = id_esp + send_to_client;
String x_client_to_server = id_esp + client_to_server;
String x_last_will_message = id_esp + last_will_message;

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
  { 2, "auto", "80", false },
  { 3, "manual", "off", false },
  { 4, "manual", "off", false }
};
unsigned long lastSendTime = 0;
const unsigned long sendInterval = 5000;

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

  // Kiểm tra xem payload có phải là một mảng không
  if (!doc.is<JsonArray>()) {
    Serial.println("JSON is not an array");
    return false;
  }

  // Lấy mảng JSON từ doc
  JsonArray arr = doc.as<JsonArray>();

  // Kiểm tra xem mảng có đủ 4 phần tử không
  if (arr.size() != NUM_PUMPS) {
    Serial.print("JSON array size is not ");
    Serial.println(NUM_PUMPS);
    return false;
  }

  return true;
}
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
bool previousPumpState[4] = { false, false, false, false };

void checkAndSendPumpState() {
  for (int i = 0; i < 4; i++) {
    if (pumpControllers.pumpState[i] != previousPumpState[i]) {
      previousPumpState[i] = pumpControllers.pumpState[i];

      if (pumpControllers.pumpState[i]) {
        StaticJsonDocument<200> doc;
        doc["id_esp"] = id_esp;
        doc["index"] = i + 1;
        char buffer[256];
        serializeJson(doc, buffer);
        mqttConn.publish("pumpState", buffer);
      }
    }
  }
}
void checkAndSendSensorState() {
  for (int i = 0; i < 4; i++) {
    float temperature = 0.0;
    float humidity = 0.0;

    // Lấy giá trị nhiệt độ và độ ẩm từ từng cảm biến SHT31
    switch (i) {
      case 0:
        if (pumpControllers.sht31_1.begin(0x44)) {
          temperature = pumpControllers.sht31_1.readTemperature();
          humidity = pumpControllers.sht31_1.readHumidity();
        } else {
          Serial.println("Failed to initialize SHT31 sensor 1.");
        }
        break;
      case 1:
        if (pumpControllers.sht31_2.begin(0x44)) {
          temperature = pumpControllers.sht31_2.readTemperature();
          humidity = pumpControllers.sht31_2.readHumidity();
        } else {
          Serial.println("Failed to initialize SHT31 sensor 2.");
        }
        break;
      case 2:
        if (pumpControllers.sht31_3.begin(0x44)) {
          temperature = pumpControllers.sht31_3.readTemperature();
          humidity = pumpControllers.sht31_3.readHumidity();
        } else {
          Serial.println("Failed to initialize SHT31 sensor 3.");
        }
        break;
      case 3:
        if (pumpControllers.sht31_4.begin(0x44)) {
          temperature = pumpControllers.sht31_4.readTemperature();
          humidity = pumpControllers.sht31_4.readHumidity();
        } else {
          Serial.println("Failed to initialize SHT31 sensor 4.");
        }
        break;
      default:
        break;
    }

    // Kiểm tra giá trị hợp lệ của nhiệt độ và độ ẩm
    if (!isnan(temperature) && !isnan(humidity)) {
      // Tạo JSON để gửi lên MQTT
      StaticJsonDocument<200> doc;
      doc["id_esp"] = id_esp;
      doc["index"] = i + 1;
      doc["temperature"] = temperature;
      doc["humidity"] = humidity;

      char buffer[256];
      serializeJson(doc, buffer);

      // Gửi JSON lên topic "sensorData" trên MQTT
      mqttConn.publish("sensorData", buffer);
    }
  }
}
void setup() {
  Serial.begin(9600);
  EEPROM.begin(512);
  String initialPayload = loadPayloadSumFromEEPROM();
  bool validPayload = isJsonPayloadValid(initialPayload);
  WiFiConnection::WifiCredentials wifiCreds = wifiConn.activateAPMode();
  ssid = wifiCreds.ssid;
  password = wifiCreds.password;
  wifiConn.connectToWiFi(ssid, password);
  while (!wifiConn.isConnected()) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected");
  mqttConn.setupMQTT();
  while (!mqttConn.connected()) {
    mqttConn.reconnectMQTT();
    delay(500);
    Serial.print(".");
  }
  Serial.println("MQTT connected");
  for (int i = 0; i < NUM_PUMPS; ++i) {
    pinMode(pumpPins[i], OUTPUT);
    digitalWrite(pumpPins[i], LOW);
  }
  if (validPayload) {
    mqttConn.publish(char_x_send_to_client, initialPayload.c_str());
  } else {
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
    mqttConn.publish(char_x_send_to_client, initialPayload.c_str());
  }
}
void loop() {
  if (!wifiConn.isConnected()) {
    wifiConn.connectToWiFi(ssid, password);
  }
  if (!mqttConn.connected()) {
    mqttConn.reconnectMQTT();
  }
  String payload_sum = loadPayloadSumFromEEPROM();
  if (mqttConn.isMessagesArrive) {
    
    String updatedPayload = pumpControllers.handleNewMessages(mqttConn.currentAction, mqttConn.currentMessage, mqttConn.currentIndex, payload_sum.c_str());
    if (updatedPayload.length() > 0 && updatedPayload != payload_sum) {
      payload_sum = updatedPayload;
      savePayloadSumToEEPROM(payload_sum);
      mqttConn.publish(char_x_send_to_client, payload_sum.c_str());
    }
    Serial.print("char_x_send_to_client: ");
    Serial.println(char_x_send_to_client);
    Serial.print("char_x_client_to_server: ");
    Serial.println(char_x_client_to_server);
    Serial.print("char_x_last_will_message: ");
    Serial.println(char_x_last_will_message);
    mqttConn.isMessagesArrive = false;
  }
  pumpControllers.processPumpAction(payload_sum.c_str(), pumpPins, NUM_PUMPS);
  checkAndSendPumpState();
  unsigned long currentMillis = millis();


  // if (currentMillis - lastSendTime >= sendInterval) {
  //   lastSendTime = currentMillis;


  //   checkAndSendSensorState();
  // }
  // Cập nhật payload_sum từ handleNewMessages

  mqttConn.loop();
}
