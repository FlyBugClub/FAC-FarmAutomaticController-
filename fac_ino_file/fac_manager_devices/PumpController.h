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
    Adafruit_SHT31& getSHT31Sensor(int index);
    bool pumpState[4] = {false, false, false, false};

  
    Adafruit_SHT31 sht31_1  = Adafruit_SHT31();  // Example: One instance of Adafruit_SHT31
    Adafruit_SHT31 sht31_2  = Adafruit_SHT31();  // Example: Another instance of Adafruit_SHT31
    Adafruit_SHT31 sht31_3  = Adafruit_SHT31();  // Example: Another instance of Adafruit_SHT31
    Adafruit_SHT31 sht31_4  = Adafruit_SHT31();  // Example: Another instance of Adafruit_SHT31
};

#endif
