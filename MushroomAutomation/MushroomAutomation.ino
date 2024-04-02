#include <ArduinoHttpClient.h>
#include <ESP8266WiFi.h>

const char* ssid = "Thu Tamm";
const char* password = "thutam1975";
const char* serverAddress = "ngunemay123.bsite.net";
const int serverPort = 80;

WiFiClient wifiClient;
HttpClient http = HttpClient(wifiClient, serverAddress, serverPort);

const char* apiUrl = "/api/login/admin@gmail.com/123456";

void setup() {
  Serial.begin(115200);
  connectToWiFi();
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("[HTTP] Begin GET request");
    http.get(apiUrl);
    int statusCode = http.responseStatusCode();
    Serial.print("Status code: ");
    Serial.println(statusCode);

    String response = http.responseBody();
    Serial.print("Response: ");
    Serial.println(response);
  }
  delay(5000);
}

void connectToWiFi() {
  Serial.printf("Connecting to %s ", ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println(" connected");
}
  