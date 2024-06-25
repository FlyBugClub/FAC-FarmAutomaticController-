#include "PumpController.h"
#include "MQTTConnection.h"

PumpController::PumpController(int pumpPin, MQTTConnection& mqttConnection)
  : _pumpPin(pumpPin), _mqttConnection(mqttConnection) {
  pinMode(_pumpPin, OUTPUT);
  digitalWrite(_pumpPin, LOW);  // Ensure pump starts in the off state
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
    int sensorValue = analogRead(A0);  // Ví dụ đọc giá trị từ cảm biến
    if (sensorValue > 500) {
      digitalWrite(_pumpPin, HIGH);  // Bật bơm nếu giá trị cảm biến lớn hơn 500
      Serial.println("Pump turned on (auto)");
      publishStatus(action, message, index);  // Truyền action "on" cho publishStatus
    } else {
      digitalWrite(_pumpPin, LOW);  // Tắt bơm nếu giá trị cảm biến không lớn hơn 500
      Serial.println("Pump turned off (auto)");
      publishStatus(action, message, index);  // Truyền action "off" cho publishStatus
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