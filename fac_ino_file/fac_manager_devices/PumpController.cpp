#include "PumpController.h"
#include "MQTTConnection.h"

PumpController::PumpController(int pumpPin, MQTTConnection& mqttConnection)
  : _pumpPin(pumpPin), _mqttConnection(mqttConnection) {
  pinMode(_pumpPin, OUTPUT);
  digitalWrite(_pumpPin, LOW);  // Ensure pump starts in the off state
  if (!sht31.begin(0x44)) { // Địa chỉ I2C mặc định của SHT31
    Serial.println("Couldn't find SHT31 sensor!");
} else {
    Serial.println("SHT31 sensor initialized successfully!");
}
}

void PumpController::handleAction(const char* action, const char* message, int index) {
  if (strcmp(action, "manual") == 0) {
    if (strcmp(message, "on") == 0) {
      digitalWrite(_pumpPin, HIGH);
      Serial.println("Pump turned on");
      publishStatus(action, message, index);  // Truyền thêm action
    } else if (strcmp(message, "off") == 0) {
      digitalWrite(_pumpPin, LOW);
      Serial.println("Pump turned off");
      publishStatus(action, message, index);  // Truyền thêm action
    }
  } else if (strcmp(action, "auto") == 0) {
    // Xử lý hành động auto ở đây
    // Ví dụ: Tự động điều khiển theo một số điều kiện nào đó
    int threshold = atoi(message); // Chuyển đổi message (ngưỡng) từ chuỗi sang số nguyên

      float humidity = sht31.readHumidity();
    if (humidity < threshold) {
      digitalWrite(_pumpPin, HIGH); 
      Serial.println("Pump turned on (auto)");
      publishStatus(action, "on", index); // Truyền action "on" cho publishStatus
    } else {
      digitalWrite(_pumpPin, LOW); // Tắt bơm nếu giá trị cảm biến không lớn hơn ngưỡng
      Serial.println("Pump turned off (auto)");
      publishStatus(action, "off", index); // Truyền action "off" cho publishStatus
    }

    
  } else if (strcmp(action, "schedule") == 0) {
    // Xử lý hành động schedule ở đây
    // Ví dụ: Đọc lịch trình từ message và thực hiện hành động dựa trên lịch trình
    // Đây chỉ là ví dụ đơn giản, bạn cần thay đổi theo logic của hệ thống thực tế
    if (strcmp(message, "morning") == 0) {
      digitalWrite(_pumpPin, HIGH); // Bật bơm vào buổi sáng
      Serial.println("Pump turned on (morning schedule)");
      publishStatus(action, message, index); // Truyền action "on" cho publishStatus
    } else if (strcmp(message, "evening") == 0) {
      digitalWrite(_pumpPin, LOW); // Tắt bơm vào b
      Serial.println("Pump turned off (evening schedule)");
      publishStatus(action, message, index); // Truyền action "off" cho publishStatus
    }
  }
}

void PumpController::publishStatus(const char* action, const char* message, int index) {
  String indexStr = String(index);
  const char* indexChar = indexStr.c_str();
  char payload[100];  // Increase array size to accommodate larger payload
  snprintf(payload, sizeof(payload), "{\"index\": \"%s\", \"payload\": {\"action\": \"%s\", \"messages\": \"%s\"}}", indexChar, action, message);
  _mqttConnection.publish(_mqttConnection.mqtt_topic_send, payload, true);
}