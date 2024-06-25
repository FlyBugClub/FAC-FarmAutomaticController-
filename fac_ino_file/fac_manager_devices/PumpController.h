#ifndef PUMP_CONTROLLER_H
#define PUMP_CONTROLLER_H

#include <Arduino.h>

class PumpController {
public:
  PumpController(int pumpPin);
  void handleAction(const char* action, const char* message);

private:
  int _pumpPin;
};

#endif // PUMP_CONTROLLER_H
