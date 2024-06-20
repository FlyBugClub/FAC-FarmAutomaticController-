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
