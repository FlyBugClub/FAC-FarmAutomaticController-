#include "wifiConnection.h"



void connectToWiFi(const String& ssid, const String& password) {
  Serial.println("Starting connection to WiFi");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
    Serial.print(".");
  }
  // getWhenStart("/api/laststatus/", id_sensor);
  Serial.println("\nWiFi connection successful!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

WifiCredentials activateAPMode() {
  WifiCredentials credentials;

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Disconnecting from WiFi");
    WiFi.disconnect();
  }

  WiFiManager wifiManager;

  if (!wifiManager.autoConnect("ESP8266_AP")) {
    Serial.println("Failed to connect and hit timeout");
    ESP.reset();
    delay(1);
    return credentials; 
  } else {
    credentials.ssid = WiFi.SSID();
    credentials.password = WiFi.psk();
    return credentials; 
  }
}
