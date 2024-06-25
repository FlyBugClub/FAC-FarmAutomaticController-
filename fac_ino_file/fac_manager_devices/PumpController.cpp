#include "PumpController.h"
#include <Arduino.h>

PumpController::PumpController(int pumpPin) : _pumpPin(pumpPin) {}

void PumpController::setup() {
  pinMode(_pumpPin, OUTPUT);
  digitalWrite(_pumpPin, LOW); // Đảm bảo máy bơm tắt ban đầu
}

void PumpController::handleAction(int action, const char* message) {
  switch (action) {
    case 1:
      manualPump(message);
      break;
    case 2:
      automaticPump(atoi(message));
      break;
    case 3:
      schedulePump(atoi(message));
      break;
    default:
      Serial.println("Unknown action");
      break;
  }
}

void PumpController::manualPump(const char* message) {
 
}

void PumpController::automaticPump(int message) {

}

void PumpController::schedulePump(int message) {

}
