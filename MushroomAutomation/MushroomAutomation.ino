#include "secret_pass.h"
#include <Wire.h>
#include "Adafruit_SHT31.h"
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>

const char* serverUrl = "https://ngunemay123.bsite.net/api/login/admin@gmail.com/123456";
const int pumpPin = D6;
bool autoControl = true;
float desiredTemperature = 25.0;
float desiredHumidity = 60.0;
unsigned long lastSprayTime = 0;
bool wifiConnected = false;
bool sensorConnected = false;

Adafruit_SHT31 sht31 = Adafruit_SHT31();

void setup() {
  pinMode(pumpPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("SHT31 test");

  connectToWiFi();
}

void reconnectSensor() {
  Serial.println("Attempting to reconnect sensor...");
  
  if (!sht31.begin(0x44)) {
    Serial.println("Couldn't find SHT31. Retrying...");
    delay(1000);
    return;
  }

  Serial.println("Sensor reconnected successfully.");
  sensorConnected = true;
}

void loop() {
  if (!wifiConnected) {
    connectToWiFi();
  }

  // if (!sensorConnected) {
  //   reconnectSensor();
  // } else {
  //   float temperature = sht31.readTemperature();
  //   float humidity = sht31.readHumidity();
  //   manageAutoControl();
  // }

   String jsonString;
    if (getDataFromAPI(serverUrl, jsonString)) {
      Serial.println("Received JSON data:");
      Serial.println(jsonString);
    } else {
      Serial.println("Failed to get data from API");
    }
  
  
}

void connectToWiFi() {
  WiFi.begin(ssid, pass);
  unsigned long startTime = millis();
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
    if (millis() - startTime > 30000) {
      Serial.println("WiFi connection timeout!");
      break;
    }
  }

  if (WiFi.status() == WL_CONNECTED) {
    wifiConnected = true;
    Serial.println("WiFi connected");
    autoControl = true;

    // Gọi hàm sendDataToAPI() ở đây nếu bạn muốn gửi dữ liệu ngay sau khi kết nối WiFi thành công
  } else {
    wifiConnected = false;
    Serial.println("WiFi connection failed");
    autoControl = false;
    digitalWrite(pumpPin, LOW);
  }
}

void manageAutoControl() {
  if (autoControl) {
    autoControlMode(desiredTemperature, desiredHumidity);
  }
}

void autoControlMode(float& temperature, float& humidity) {
  float currentHumidity = sht31.readHumidity();
  unsigned long currentMillis = millis();

  if (currentHumidity < humidity && currentMillis - lastSprayTime >= 10000) {
    digitalWrite(pumpPin, HIGH);
    lastSprayTime = currentMillis;
    delay(2000);
    digitalWrite(pumpPin, LOW);
  } else {
    digitalWrite(pumpPin, LOW);
  }
}

void sendDataToAPI(float temperature, float humidity) {
  HTTPClient http;
  WiFiClient client; // Tạo một đối tượng WiFiClient
  
  StaticJsonDocument<200> jsonBuffer;
  JsonObject jsonData = jsonBuffer.to<JsonObject>();

  jsonData["temperature"] = temperature;
  jsonData["humidity"] = humidity;

  String jsonString;
  serializeJson(jsonData, jsonString);

  http.begin(client, serverUrl);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST(jsonString);

  if (httpResponseCode == 200) {
    Serial.println("Data sent successfully");
  } else {
    Serial.print("Error sending data. HTTP response code: ");
    Serial.println(httpResponseCode);
  }

  http.end();
}

bool getDataFromAPI(const char* url, String& jsonString) {
  HTTPClient http;
  WiFiClient client; // Tạo một đối tượng WiFiClient

  // Send HTTP GET request
  http.begin(client, serverUrl, 443, "/path", true);
  int httpResponseCode = http.GET();

  if (httpResponseCode == HTTP_CODE_OK) {
    jsonString = http.getString();
    return true;
  } else {
    Serial.print("HTTP request failed with error code: ");
    Serial.println(httpResponseCode);
    return false;
  }

  http.end();
}