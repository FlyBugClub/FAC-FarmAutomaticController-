#ifndef WIFICONNECTION_H
#define WIFICONNECTION_H
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiManager.h>  

struct WifiCredentials {
  String ssid;
  String password;
};
void connectToWiFi(const String& ssid, const String& password);
WifiCredentials activateAPMode();

#endif  // WIFICONNECTION_H
