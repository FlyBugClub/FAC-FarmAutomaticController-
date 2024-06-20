#ifndef WIFICONNECTION_H
#define WIFICONNECTION_H
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiManager.h>  

void connectToWiFi(const String& ssid, const String& password);

#endif  // WIFICONNECTION_H
