#include "secret_pass.h"

#include <Wire.h>
#include "Adafruit_SHT31.h"
bool enableHeater = false;
uint8_t loopCnt = 0;
Adafruit_SHT31 sht31 = Adafruit_SHT31();

#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
const char* serverUrl = "http://example.com/api/data";

const int pumpPin = D6;
bool autoControl = true;
float desiredTemperature = 25.0;
float desiredHumidity = 60.0;
unsigned long lastSprayTime = 0;
bool wifiConnected = false;
bool sensorConnected = false;


void setup() {
  pinMode(pumpPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("SHT31 test");

  connectToWiFi();
  
}

void reconnectSensor() {
  Serial.println("Attempting to reconnect sensor...");
  
  // Thử khởi tạo lại cảm biến
  if (!sht31.begin(0x44)) {   // Set to 0x45 for alternate i2c addr
    Serial.println("Couldn't find SHT31. Retrying...");
    delay(1000);
    return; // Thử lại sau một khoảng thời gian
  }

  Serial.println("Sensor reconnected successfully.");
  sensorConnected = true;
}

void loop() {
  if (!wifiConnected) {
    // Nếu mất kết nối WiFi, thực hiện kết nối lại
    connectToWiFi();
  }

  // Kiểm tra kết nối cảm biến, nếu mất kết nối, reconnect
  if (!sensorConnected) {
    reconnectSensor();
  } else {
    // Nếu cảm biến kết nối thành công, tiếp tục thực hiện các thao tác khác
    float temperature = sht31.readTemperature();
    float humidity = sht31.readHumidity();
    Serial.println("hehe");
    manageAutoControl();
  }
}

void connectToWiFi() {
  WiFi.begin(ssid, pass);
  unsigned long startTime = millis(); // Thời gian bắt đầu kết nối WiFi
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Đang kết nối WiFi...");
    // Nếu quá thời gian kết nối (ví dụ: 30 giây), thoát vòng lặp
    if (millis() - startTime > 30000) {
      break;
    }
  }

  if (WiFi.status() == WL_CONNECTED) {
    wifiConnected = true; // Cập nhật trạng thái kết nối WiFi
    Serial.println("Kết nối WiFi thành công");
    // Bật chế độ tự động khi kết nối lại WiFi
;
    autoControl = true;
  } else {
    wifiConnected = false; // Cập nhật trạng thái kết nối WiFi
    Serial.println("Kết nối WiFi không thành công");
    // Tắt tất cả các thiết bị khi mất kết nối WiFi
    digitalWrite(pumpPin, LOW);

    autoControl = false;
  }
}


void manageAutoControl() {
  if (autoControl) {
    autoControlMode(desiredTemperature, desiredHumidity);
  }
}

void autoControlMode(float& temperature, float& humidity) {
  
  float currentHumidity = sht31.readHumidity(); // Đọc độ ẩm từ cảm biến SHT
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

