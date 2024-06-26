#ifndef PUMP_CONTROLLER_H
#define PUMP_CONTROLLER_H

#include <Arduino.h>
#include "Adafruit_SHT31.h"
// Forward declaration của MQTTConnection
class MQTTConnection;

class PumpController {
public:
  PumpController(int pumpPin, MQTTConnection& mqttConnection);
  void handleAction(const char* action, const char* message, int index);
  void publishStatus(const char* action, const char* message, int index);

private:
  int _pumpPin;
  MQTTConnection& _mqttConnection; // Tham chiếu đến MQTTConnection
  Adafruit_SHT31 sht31;
};

#endif // PUMP_CONTROLLER_H
