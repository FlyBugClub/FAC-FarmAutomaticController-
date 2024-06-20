#include <Arduino.h>
#include "my_module.h"
#include "wifiConnection.h"

const String ssid = "DAT_MOBILE";
const String password = "ktd01042013";

void setup() {
  Serial.begin(9600);
  connectToWiFi(ssid, password);
}

void loop() {
}