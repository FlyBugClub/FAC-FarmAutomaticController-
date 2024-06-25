#ifndef PUMP_CONTROLLER_H
#define PUMP_CONTROLLER_H

#include <Arduino.h>

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
};

#endif // PUMP_CONTROLLER_H
