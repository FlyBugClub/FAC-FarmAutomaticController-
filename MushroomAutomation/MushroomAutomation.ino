// Includes
  #include <ESP8266WiFi.h>
  #include <ESP8266HTTPClient.h>
  #include <ArduinoJson.h>
  #include "secret_pass.h"

  #include <Wire.h>
  #include "Adafruit_SHT31.h"

  #include <NTPClient.h>
  #include <WiFiUdp.h>

// Constants

  const char* ntpServer = "pool.ntp.org";
  const int ntpPort = 123;
  const char* server_address = "ngunemay123.bsite.net";
  const int server_port = 443;
  const int pumpPin = D6;
  const long timeZoneOffset = 7 * 3600;
  const unsigned long sprayInterval = 10000; // 10 seconds

// Variables
  bool enableHeater = false;
  uint8_t loopCnt = 0;
  Adafruit_SHT31 sht31;
  WiFiUDP ntpUDP;
  NTPClient timeClient(ntpUDP, ntpServer, ntpPort);
  bool autoControl = true;
  float desiredTemperature = 25.0;
  float desiredHumidity = 60.0;
  unsigned long lastSprayTime = 0;
  bool wifiConnected = false;
  int pumpActivationCount = 0;
  int previousDay = -1;

// Function prototypes
  void setup();
  void loop();
  void connectToWiFi();
  void getCurrentDateTime(String& formattedDateTime);
  void postHumidityToAPI(const char* url, String formattedDateTime);
  void postCountPumpToAPI(const char* url, String formattedDateTime);
  void autoControlMode(float& temperature, float& humidity);
  bool isNewDay(String formattedTime);

void setup() {
  pinMode(pumpPin, OUTPUT);
  Serial.begin(9600);
  delay(100);

  // Connect to WiFi
  connectToWiFi();

  // Initialize SHT31 sensor
  sht31.begin(0x44);

  // Initialize NTPClient
  timeClient.begin();
  timeClient.setTimeOffset(timeZoneOffset);
}

void loop() {
  if (!wifiConnected) {
    connectToWiFi();
  }
  
  String formattedDateTime;
  getCurrentDateTime(formattedDateTime);
  // countPumpActivations(formattedDateTime);
  // postHumidityToAPI("/api/sensorvalues", formattedDateTime);
  getAndParseAPI("/api/login/admin@gmail.com/123456");
  delay(1000);
}

void connectToWiFi() {
  WiFi.begin(ssid, pass);
  unsigned long startTime = millis();
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
    if (millis() - startTime > 30000) {
      break;
    }
  }

  if (WiFi.status() == WL_CONNECTED) {
    wifiConnected = true;
    Serial.println("Connected to WiFi");
    timeClient.setTimeOffset(timeZoneOffset);
    autoControl = true;
  } else {
    wifiConnected = false;
    Serial.println("Failed to connect to WiFi");
    digitalWrite(pumpPin, LOW);
    autoControl = false;
  }
}

void getCurrentDateTime(String& formattedDateTime) {
  timeClient.update();
  unsigned long currentEpochTime = timeClient.getEpochTime();
  time_t epochTime = (time_t)currentEpochTime;
  struct tm *currentTimeStruct = localtime(&epochTime);
  char currentTime[30];
  strftime(currentTime, sizeof(currentTime), "%Y-%m-%d %H:%M:%S", currentTimeStruct);
  unsigned long milliseconds = millis() % 1000;
  char currentTimeWithMilliseconds[35];
  snprintf(currentTimeWithMilliseconds, sizeof(currentTimeWithMilliseconds), "%s.%03ld", currentTime, milliseconds);
  formattedDateTime = String(currentTimeWithMilliseconds);
}

void postHumidityToAPI(const char* url, String formattedDateTime) {
  WiFiClientSecure client;
  HTTPClient http;
  String api_url = "https://" + String(server_address) + url;

  http.begin(client, api_url);
  client.setInsecure();

  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<256> doc;
  doc["id_sensor"] = "SenSor0001";
  doc["value"] = "20";
  doc["expectedvalue"] = "20";
  doc["min_max_value"] = "40/90";
  doc["datetime"] = formattedDateTime;
  String payload;
  serializeJson(doc, payload);

  int httpCode = http.POST(payload);
  Serial.print("POST httpCode: ");
  Serial.println(httpCode);

  if (httpCode > 0) {
    String payload = http.getString();
    Serial.print("POST Humidity response: ");
    Serial.println(payload);
  } else {
    Serial.print("POST request failed with error code: ");
    Serial.println(httpCode);
  }

  http.end();
}

void postCountPumpToAPI(const char* url, String formattedDateTime) {
  WiFiClientSecure client;
  HTTPClient http;
  String api_url = "https://" + String(server_address) + url;

  http.begin(client, api_url);
  client.setInsecure();

  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<256> doc;
  doc["id_equipment"] = "BC0001";
  doc["values"] = "20";
  doc["status"] = "22222";
  doc["datetime"] = formattedDateTime;
  doc["autoMode"] = "1";
  doc["id_sensor"] = "DHT0001-PH0001";
  String payload;
  serializeJson(doc, payload);

  int httpCode = http.POST(payload);
  Serial.print("POST httpCode: ");
  Serial.println(httpCode);

  if (httpCode > 0) {
    String payload = http.getString();
    Serial.print("POST CountPump response: ");
    Serial.println(payload);
  } else {
    Serial.print("POST request failed with error code: ");
    Serial.println(httpCode);
  }

  http.end();
}

void autoControlMode(float& temperature, float& humidity) {
  float currentHumidity = sht31.readHumidity();
  unsigned long currentMillis = millis();

  if (currentHumidity < humidity && currentMillis - lastSprayTime >= sprayInterval) {
    digitalWrite(pumpPin, HIGH);
    lastSprayTime = currentMillis;
    delay(2000);
    digitalWrite(pumpPin, LOW);
  } else {
    digitalWrite(pumpPin, LOW);
  }
}

bool isNewDay(String formattedTime) {
  int currentHour = formattedTime.substring(0, 2).toInt();
  int currentMinute = formattedTime.substring(3, 5).toInt();
  int currentSecond = formattedTime.substring(6, 8).toInt();

  Serial.print("Current Time: ");
  Serial.print(currentHour);
  Serial.print(":");
  Serial.print(currentMinute);
  Serial.print(":");
  Serial.println(currentSecond);

  if (currentHour == 0 && currentMinute == 0 && currentSecond == 0) {
    Serial.println("New day has begun");
    return true;
  }
  return false;
}


void getAndParseAPI(const char* url) {
  WiFiClientSecure client;
  HTTPClient http;

  String api_url = "https://" + String(server_address) + url;

  http.begin(client, api_url);
  client.setInsecure();

  int httpCode = http.GET();
  
  static char payload[256];

  if (httpCode > 0) {
    http.getString().toCharArray(payload, sizeof(payload));
    http.end();
    
    StaticJsonDocument<256> doc;
    DeserializationError error = deserializeJson(doc, payload);

    if (!error) {
      JsonObject user = doc[0]["user"];
      const char* userId = user["id"];
      const char* userEmail = user["gmail"];
      const char* userName = user["name"];
      const char* userPhone = user["phone"];
      int membership = user["membership"].as<int>();  

      JsonObject sensor = doc[0]["0"];
      const char* espId = sensor["id_esp"];
      const char* espName = sensor["name"];
      int bcValue = sensor["bc"].as<int>();    
      int dhtValue = sensor["dht"].as<int>();  
      int phValue = sensor["ph"].as<int>();    
    }
  } else {
    // Trả về NULL nếu yêu cầu không thành công
    Serial.print("GET request failed with error code: ");
    Serial.println(httpCode);
    http.end();
  }
}



void reconnectSensor() {
  Serial.println("Attempting to reconnect sensor...");

  // Thử khởi tạo lại cảm biến
  if (!sht31.begin(0x44)) {  // Set to 0x45 for alternate i2c addr
    Serial.println("Couldn't find SHT31. Retrying...");
    delay(1000);
    return;  // Thử lại sau một khoảng thời gian
  }
}


void manageAutoControl() {
  if (autoControl) {
    autoControlMode(desiredTemperature, desiredHumidity);
  }
}


void countPumpActivations(String formattedTime) {
  // Kiểm tra xem đã qua ngày mới chưa
  if (isNewDay(formattedTime)) {
    pumpActivationCount = 0;
  }
  if (digitalRead(pumpPin) == HIGH) {
    pumpActivationCount++;
    postCountPumpToAPI("/api/equidmentvalues", formattedTime);

  }
}
