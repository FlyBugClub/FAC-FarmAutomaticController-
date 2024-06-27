#ifndef PumpController_h
#define PumpController_h

#include <Arduino.h>
#include <Wire.h>
#include "Adafruit_SHT31.h"

class PumpController {
  public:
    PumpController();
    char* handleNewMessages(String currentAction, String currentMessage, int currentIndex, const char* payload_sum);
    void processPumpAction(const char* payload_sum,const int pumpPins[], int numPumps);
    Adafruit_SHT31 sht31;
};

#endif
