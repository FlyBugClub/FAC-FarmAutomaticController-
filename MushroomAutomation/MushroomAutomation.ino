#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include "secret_pass.h"

#include <Wire.h>
#include "Adafruit_SHT31.h"
bool enableHeater = false;
uint8_t loopCnt = 0;
Adafruit_SHT31 sht31 = Adafruit_SHT31();


#include <NTPClient.h>
#include <WiFiUdp.h>
const char *ntpServer = "pool.ntp.org";
const int ntpPort = 123;
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, ntpServer, ntpPort);
const long timeZoneOffset = 7 * 3600; 

const int pumpPin = D6;
bool autoControl = true;
float desiredTemperature = 25.0;
float desiredHumidity = 60.0;
unsigned long lastSprayTime = 0;
bool wifiConnected = false;
bool sensorConnected = false;

int pumpActivationCount = 0;
int previousDay = -1;

const char* server_address = "ngunemay123.bsite.net";
const int server_port = 443;  // Port 443 cho HTTPS

void setup() {
  pinMode(pumpPin, OUTPUT);
  Serial.begin(9600);
  delay(100);

  // Connect to WiFi
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  timeClient.begin();
  timeClient.setTimeOffset(timeZoneOffset);
}


void loop() {

  if (!wifiConnected) {
    connectToWiFi();
  }
  timeClient.update();
  String formattedTime = timeClient.getFormattedTime();
  countPumpActivations(formattedTime);
 
   // Get current epoch time
  unsigned long currentEpochTime = timeClient.getEpochTime();

  // Convert unsigned long to time_t
  time_t epochTime = (time_t)currentEpochTime;
  
  // Get current date and time
  struct tm *currentTimeStruct = localtime(&epochTime);
  char currentTime[30];
  strftime(currentTime, sizeof(currentTime), "%Y-%m-%d %H:%M:%S", currentTimeStruct);
  unsigned long milliseconds = millis() % 1000;
  char currentTimeWithMilliseconds[35];
  snprintf(currentTimeWithMilliseconds, sizeof(currentTimeWithMilliseconds), "%s.%03ld", currentTime, milliseconds);
  
  // Print current date and time
  Serial.println("Current Date and Time: " + String(currentTimeWithMilliseconds));


  //POST to one API
  // postToAPI("/api/user");  // Thay đổi URL tại đây

  // GET from another API
  // const char* payload = getFromAPI("/api/login/admin@gmail.com/123456");  // Thay đổi URL tại đây
  // Serial.println("hehe");
  // Serial.println(payload);
  // parseJsonPayload(payload);
  // Delay for 1 second
  delay(1000);
}
void reconnectSensor() {
  Serial.println("Attempting to reconnect sensor...");

  // Thử khởi tạo lại cảm biến
  if (!sht31.begin(0x44)) {  // Set to 0x45 for alternate i2c addr
    Serial.println("Couldn't find SHT31. Retrying...");
    delay(1000);
    return;  // Thử lại sau một khoảng thời gian
  }

  Serial.println("Sensor reconnected successfully.");
}


void postToAPI(const char* url) {
  WiFiClientSecure client;
  HTTPClient http;

  String api_url = "https://" + String(server_address) + url;

  http.begin(client, api_url);
  client.setInsecure();

  http.addHeader("Content-Type", "application/json");
  // Tạo một đối tượng JSON Document với kích thước đủ cho payload
  StaticJsonDocument<256> doc;

  // Thêm các thành phần vào payload JSON
  doc["id_user"] = "CT0003";
  doc["gmail"] = "taduc1130@gmail.com";
  doc["password"] = "conchongu";
  doc["name"] = "Duc";
  doc["phone_no"] = "123456789";
  doc["date_created"] = "2024-03-25T10:00:00";
  // doc["id_membership"] = 2;
  String payload;
  serializeJson(doc, payload);

  int httpCode = http.POST(payload);  // Dữ liệu JSON bạn muốn POST
  Serial.print("POST httpCode: ");
  Serial.println(httpCode);

  if (httpCode > 0) {
    String payload = http.getString();
    Serial.print("POST response: ");
    Serial.println(payload);
  } else {
    Serial.print("POST request failed with error code: ");
    Serial.println(httpCode);
  }

  http.end();
}


const char* getFromAPI(const char* url) {
  WiFiClientSecure client;
  HTTPClient http;

  String api_url = "https://" + String(server_address) + url;

  http.begin(client, api_url);
  client.setInsecure();

  int httpCode = http.GET();
  Serial.print("GET httpCode: ");
  Serial.println(httpCode);

  static char payload[256];  // Khai báo một mảng ký tự tĩnh để lưu trữ payload

  if (httpCode > 0) {
    // Lấy payload và sao chép nó vào mảng ký tự
    http.getString().toCharArray(payload, sizeof(payload));
    // Serial.print("GET response: ");
    // Serial.println(payload);
    http.end();
    // Trả về con trỏ đến mảng ký tự chứa payload
    return payload;
  } else {
    Serial.print("GET request failed with error code: ");
    Serial.println(httpCode);
    http.end();
    // Trả về NULL nếu yêu cầu không thành công
    return NULL;
  }
}


void parseJsonPayload(const char* payload) {
  // Phân tích payload JSON
  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, payload);

  // Kiểm tra nếu có lỗi trong quá trình phân tích
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.c_str());
    return;
  }

  // Lấy thông tin từ JSON và gán vào các biến
  JsonObject user = doc[0]["user"];
  const char* userId = user["id"];
  const char* userEmail = user["gmail"];
  const char* userName = user["name"];
  const char* userPhone = user["phone"];
  int membership = user["membership"].as<int>();  // Chuyển đổi thành kiểu int

  JsonObject sensor = doc[0]["0"];
  const char* espId = sensor["id_esp"];
  const char* espName = sensor["name"];
  int bcValue = sensor["bc"].as<int>();    // Chuyển đổi thành kiểu int
  int dhtValue = sensor["dht"].as<int>();  // Chuyển đổi thành kiểu int
  int phValue = sensor["ph"].as<int>();    // Chuyển đổi thành kiểu int

  // In thông tin đã lấy từ payload JSON
  Serial.println("User Information:");
  Serial.print("User ID: ");
  Serial.println(userId);
  Serial.print("User Email: ");
  Serial.println(userEmail);
  Serial.print("User Name: ");
  Serial.println(userName);
  Serial.print("User Phone: ");
  Serial.println(userPhone);
  Serial.print("Membership: ");
  Serial.println(membership);

  Serial.println("Sensor Information:");
  Serial.print("ESP ID: ");
  Serial.println(espId);
  Serial.print("ESP Name: ");
  Serial.println(espName);
  Serial.print("BC Value: ");
  Serial.println(bcValue);
  Serial.print("DHT Value: ");
  Serial.println(dhtValue);
  Serial.print("PH Value: ");
  Serial.println(phValue);
}


void connectToWiFi() {
  WiFi.begin(ssid, pass);
  unsigned long startTime = millis();  // Thời gian bắt đầu kết nối WiFi
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Đang kết nối WiFi...");
    // Nếu quá thời gian kết nối (ví dụ: 30 giây), thoát vòng lặp
    if (millis() - startTime > 30000) {
      break;
    }
  }

  if (WiFi.status() == WL_CONNECTED) {
    wifiConnected = true;  // Cập nhật trạng thái kết nối WiFi
    Serial.println("Kết nối WiFi thành công");
    timeClient.setTimeOffset(timeZoneOffset);
    //TODO when connect to wifi, autocontrol on
    autoControl = true;
  } else {
    wifiConnected = false;  // Cập nhật trạng thái kết nối WiFi
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

  float currentHumidity = sht31.readHumidity();  // Đọc độ ẩm từ cảm biến SHT
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


bool isNewDay(String formattedTime) {
  // Tách lấy giờ, phút và giây từ formattedTime
  int currentHour = formattedTime.substring(0, 2).toInt();
  int currentMinute = formattedTime.substring(3, 5).toInt();
  int currentSecond = formattedTime.substring(6, 8).toInt();

  // In ra giờ, phút và giây hiện tại trên Serial
  Serial.print("Current Time: ");
  Serial.print(currentHour);
  Serial.print(":");
  Serial.print(currentMinute);
  Serial.print(":");
  Serial.println(currentSecond);

  // So sánh với giờ, phút và giây của một ngày mới (00:00:00)
  if (currentHour == 0 && currentMinute == 0 && currentSecond == 0) {
    Serial.println("da qua ngay moi");
    return true;
  }
  return false;
}


void countPumpActivations(String formattedTime) {
  // Kiểm tra xem đã qua ngày mới chưa
  if (isNewDay(formattedTime)) {
    // Nếu đã qua ngày mới, đặt lại số lần kích hoạt máy bơm về 0
    pumpActivationCount = 0;
  }
  // Kiểm tra điều kiện kích hoạt máy bơm và tăng biến đếm nếu thỏa mãn
  if (digitalRead(pumpPin) == HIGH) {
    pumpActivationCount++;
  }
}

