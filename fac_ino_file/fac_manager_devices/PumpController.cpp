#include "PumpController.h"
#include "MQTTConnection.h"

PumpController::PumpController(int pumpPin, MQTTConnection& mqttConnection)
  : _pumpPin(pumpPin), _mqttConnection(mqttConnection) {
  pinMode(_pumpPin, OUTPUT);
  digitalWrite(_pumpPin, LOW); // Ensure pump starts in the off state
}

void PumpController::handleAction(const char* action, const char* message, int index) {
  if (strcmp(action, "manual") == 0) {
    if (strcmp(message, "on") == 0) {
      digitalWrite(_pumpPin, HIGH);
      Serial.println("Pump turned on");
      publishStatus(action, message, index); // Truyền thêm action
    } else if (strcmp(message, "off") == 0) {
      digitalWrite(_pumpPin, LOW);
      Serial.println("Pump turned off");
      publishStatus(action, message, index); // Truyền thêm action
    }
  }
  
}

void PumpController::publishStatus(const char* action, const char* message, int index) {
  String indexStr = String(index);
  const char* indexChar = indexStr.c_str();
  char payload[100]; // Increase array size to accommodate larger payload
       snprintf(payload, sizeof(payload), "{\"index\": \"%s\", \"payload\": {\"action\": \"%s\", \"messages\": \"%s\"}}", indexChar, action, message);
    _mqttConnection.publish(_mqttConnection.mqtt_topic_send, payload, true);
  
}