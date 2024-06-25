#ifndef PUMPCONTROLLER_H
#define PUMPCONTROLLER_H

class PumpController {
public:
  PumpController(int pumpPin);
  void setup();
  void handleAction(int action, const char* message);

private:
  int _pumpPin;
  void manualPump(const char* message);
  void automaticPump(int message);
  void schedulePump(int message);
};

#endif
