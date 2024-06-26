#ifndef PUMP_CONTROLLER_H
#define PUMP_CONTROLLER_H

#include <Arduino.h>
#include "Adafruit_SHT31.h"

class PumpController {
public:
  PumpController();
  char* handleAction(const char* action, const char* message, int index, int pumpPin);

private:
  int _pumpPin;
  Adafruit_SHT31 sht31;
};

#endif // PUMP_CONTROLLER_H
