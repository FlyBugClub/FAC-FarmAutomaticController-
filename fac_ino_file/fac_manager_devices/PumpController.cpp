#include "PumpController.h"

PumpController::PumpController(int pumpPin)
  : _pumpPin(pumpPin) {
  pinMode(_pumpPin, OUTPUT);
  digitalWrite(_pumpPin, LOW);  
  if (!sht31.begin(0x44)) {    
    Serial.println("Couldn't find SHT31 sensor!");
  } else {
    Serial.println("SHT31 sensor initialized successfully!");
  }
}

char* PumpController::handleAction(const char* action, const char* message, int index) {
  char payload[100];  // Tăng kích thước mảng để chứa payload lớn hơn nếu cần thiết
  if (strcmp(action, "manual") == 0) {
    if (strcmp(message, "on") == 0) {
      digitalWrite(_pumpPin, HIGH);
      Serial.println("Pump turned on");
      snprintf(payload, sizeof(payload), "{\"index\": \"%d\", \"payload\": {\"action\": \"%s\", \"messages\": \"%s\"}}", index, action, message);
    } else if (strcmp(message, "off") == 0) {
      digitalWrite(_pumpPin, LOW);
      Serial.println("Pump turned off");
      snprintf(payload, sizeof(payload), "{\"index\": \"%d\", \"payload\": {\"action\": \"%s\", \"messages\": \"%s\"}}", index, action, message);
    }
  } else if (strcmp(action, "auto") == 0) {
    // Xử lý hành động auto ở đây
    // Ví dụ: Tự động điều khiển theo một số điều kiện nào đó
    int threshold = atoi(message);  // Chuyển đổi message (ngưỡng) từ chuỗi sang số nguyên

    float humidity = sht31.readHumidity();
    if (humidity < threshold) {
      digitalWrite(_pumpPin, HIGH);
      Serial.println("Pump turned on (auto)");
      snprintf(payload, sizeof(payload), "{\"index\": \"%d\", \"payload\": {\"action\": \"%s\", \"messages\": \"on\"}}", index, action);
    } else {
      digitalWrite(_pumpPin, LOW);  // Tắt bơm nếu giá trị cảm biến không lớn hơn ngưỡng
      Serial.println("Pump turned off (auto)");
      snprintf(payload, sizeof(payload), "{\"index\": \"%d\", \"payload\": {\"action\": \"%s\", \"messages\": \"off\"}}", index, action);
    }

  } else if (strcmp(action, "schedule") == 0) {
    // Xử lý hành động schedule ở đây
    // Ví dụ: Đọc lịch trình từ message và thực hiện hành động dựa trên lịch trình
    // Đây chỉ là ví dụ đơn giản, bạn cần thay đổi theo logic của hệ thống thực tế
    if (strcmp(message, "morning") == 0) {
      digitalWrite(_pumpPin, HIGH);  // Bật bơm vào buổi sáng
      Serial.println("Pump turned on (morning schedule)");
      snprintf(payload, sizeof(payload), "{\"index\": \"%d\", \"payload\": {\"action\": \"%s\", \"messages\": \"morning\"}}", index, action);
    } else if (strcmp(message, "evening") == 0) {
      digitalWrite(_pumpPin, LOW);  // Tắt bơm vào b
      Serial.println("Pump turned off (evening schedule)");
      snprintf(payload, sizeof(payload), "{\"index\": \"%d\", \"payload\": {\"action\": \"%s\", \"messages\": \"evening\"}}", index, action);
    }
  }

  return payload;
}