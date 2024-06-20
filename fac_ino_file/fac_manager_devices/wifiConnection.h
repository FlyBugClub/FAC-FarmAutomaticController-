#ifndef WIFICONNECTION_H
#define WIFICONNECTION_H
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiManager.h>  
void connectToWiFi(const char* ssid, const char* password);

#endif  // WIFICONNECTION_H
