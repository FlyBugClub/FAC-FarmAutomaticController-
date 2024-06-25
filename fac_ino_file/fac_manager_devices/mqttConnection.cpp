#include "MQTTConnection.h"
#include <ArduinoJson.h>

MQTTConnection::MQTTConnection(const char* server, const char* client_id, const char* topic_send, const char* topic_recive, const char* mqtt_topic_lwm)
  : mqtt_server(server), mqtt_client_id(client_id), mqtt_topic_send(topic_send), mqtt_topic_recive(topic_recive), mqttClient(espClient), mqtt_topic_lwm(mqtt_topic_lwm), pumpController(-1) { // Khởi tạo PumpController với chân -1 ban đầu
}

void MQTTConnection::setupMQTT() {
  mqttClient.setServer(mqtt_server, 1883);
  mqttClient.setCallback([this](char* topic, byte* payload, unsigned int length) {
    this->mqttCallback(topic, payload, length);
  });
}

void MQTTConnection::reconnectMQTT() {
  while (!mqttClient.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (mqttClient.connect(mqtt_client_id, mqtt_topic_lwm, 0, true, "{\"status\": false}")) {
      Serial.println("connected");
      mqttClient.publish(mqtt_topic_lwm, "{\"status\": true}", true);
      mqttClient.subscribe(mqtt_topic_recive);
      mqttClient.subscribe(mqtt_topic_send);
      Serial.println("mqtt_topic_lwm");
      Serial.println(mqtt_topic_lwm); 
      mqttClient.subscribe(mqtt_topic_lwm);

    } else {
      Serial.print("failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}


void MQTTConnection::mqttCallback(char* topic, byte* payload, unsigned int length) {
  if (strcmp(topic, mqtt_topic_recive) == 0) {
    Serial.print("Nhận dữ liệu trên topic receive: ");

    // Bổ sung ký tự kết thúc null cho payload
    payload[length] = '\0';

    // Giải mã JSON từ payload
    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, payload);

    if (error) {
      Serial.print("Lỗi phân tích JSON: ");
      Serial.println(error.c_str());
      return;
    }

    // Lấy giá trị index từ JSON (chuyển sang kiểu int)
    int index = atoi(doc["index"]);

    // Kiểm tra xem index có hợp lệ không
    if (index < 1 || index > 4) {
      Serial.println("Index không hợp lệ");
      return;
    }

    // Lấy giá trị action và message từ JSON
    const char* action = doc["payload"]["action"];
    const char* message = doc["payload"]["messages"];

    int pumpPin = -1;  // Chân mặc định là -1 nếu không tìm thấy index phù hợp

    // Ánh xạ index sang chân cụ thể trên board Arduino
    switch (index) {
      case 1:
        pumpPin = 14;  // GPIO14 (tương ứng với D5 trên ESP8266)
        break;
      case 2:
        pumpPin = 12;  // GPIO12 (tương ứng với D6 trên ESP8266)
        break;
      case 3:
        pumpPin = 13;  // GPIO13 (tương ứng với D7 trên ESP8266)
        break;
      case 4:
        pumpPin = 15;  // GPIO15 (tương ứng với D8 trên ESP8266)
        break;
      default:
        Serial.println("Index không xác định");
        break;
    }

    if (pumpPin != -1) {
      // Tạo một thể hiện của PumpController với pumpPin tương ứng
      PumpController pumpController(pumpPin);
      // Xử lý action và message bằng cách gọi handleAction từ PumpController
      pumpController.handleAction(action, message, index);
    }
  } else if (strcmp(topic, mqtt_topic_send) == 0) {
    Serial.print("Nhận dữ liệu trên topic send: ");
  } else {
    Serial.print("Nhận dữ liệu trên topic khác: ");
  }
}

void MQTTConnection::loop() {
  mqttClient.loop();
}

void MQTTConnection::publishData(const char* topic, const char* payload) {
  mqttClient.publish(topic, payload);
}
bool MQTTConnection::connected() {
  return mqttClient.connected();
}
