#include <Arduino.h>
#include "my_module.h"
#include "wifiConnection.h"

String ssid = "DAT_MOBILE";
String password = "ktd01042013";
WifiCredentials activateAPMode();

void setup() {
  Serial.begin(9600);

  WifiCredentials wifiCreds = activateAPMode();
  ssid = wifiCreds.ssid;
  password = wifiCreds.password;
  connectToWiFi(ssid, password);
}

void loop() {
  if (!WiFi.isConnected()) {
    connectToWiFi(ssid, password);
  }
}