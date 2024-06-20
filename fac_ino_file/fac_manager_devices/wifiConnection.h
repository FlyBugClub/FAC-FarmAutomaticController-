#ifndef WIFICONNECTION_H
#define WIFICONNECTION_H

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiManager.h>

class WiFiConnection {
public:
  struct WifiCredentials {
    String ssid;
    String password;
  };

  WiFiConnection();
  void connectToWiFi(const String& ssid, const String& password);
  WifiCredentials activateAPMode();

private:
  WiFiManager wifiManager;
};

#endif  // WIFICONNECTION_H
