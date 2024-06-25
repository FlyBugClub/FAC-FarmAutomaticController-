#include "PumpController.h"

PumpController::PumpController(int pumpPin) : _pumpPin(pumpPin) {
  pinMode(_pumpPin, OUTPUT);
  digitalWrite(_pumpPin, LOW); // Đảm bảo máy bơm tắt ban đầu
}

void PumpController::handleAction(const char* action, const char* message, int index) {
  Serial.print("Handling action ");
  Serial.print(action);
  Serial.print(" with message ");
  Serial.println(message);
  
  String indexStr = String(index);
  const char* indexChar = indexStr.c_str();

  // Xử lý các trường hợp action ở đây
  if (strcmp(action, "auto") == 0) {
    // Xử lý chế độ tự động
  } else if (strcmp(action, "manual") == 0) {
    // Xử lý chế độ thủ công
    if (strcmp(message, "on") == 0) {
      digitalWrite(_pumpPin, HIGH);
      Serial.println(_pumpPin);
       Serial.println("on");
    } else if (strcmp(message, "off") == 0) {
      digitalWrite(_pumpPin, LOW);
      Serial.println(_pumpPin);
      Serial.println("off");
    } else {
      Serial.println("Unknown manual command");
    }
  } else if (strcmp(action, "schedule") == 0) {
    // Xử lý chế độ lịch trình
    // Ví dụ: parsing message để lấy thông tin lịch trình
  } else {
    Serial.println("Unknown action");
  }
}
