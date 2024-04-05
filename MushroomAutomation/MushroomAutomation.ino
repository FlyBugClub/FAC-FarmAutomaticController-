#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const char* ssid = "Thu Tamm";
const char* password = "thutam1975";
const char* api_url = "https://ngunemay123.bsite.net"; // Thêm giao thức HTTPS vào URL

void setup() {
  Serial.begin(115200);
  delay(100);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Make HTTP request
  WiFiClientSecure client;
  HTTPClient http;
  http.begin(client, api_url); // Bắt đầu yêu cầu HTTP với URL HTTPS

  // Vô hiệu hóa kiểm tra chứng chỉ SSL
  client.setInsecure();

  http.setReuse(true); // Sử dụng lại kết nối TCP
  http.addHeader("Content-Type", "application/json");

  int httpCode = http.GET();
  Serial.println("httpCode");
  Serial.println(httpCode);

  if (httpCode > 0) {
    String payload = http.getString();
    Serial.println("Received JSON:");
    Serial.println(payload);
  } else {
    Serial.print("HTTP request failed with error code: ");
    Serial.println(httpCode);
  }

  http.end();
}

void loop() {
  // Your code here
}
