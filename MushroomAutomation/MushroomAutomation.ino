#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

// Kết nối WiFi
const char* ssid = "Song sinh";
const char* password = "hoilamchi";

void setup() {
  Serial.begin(9600);
  delay(1000);
  
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) { // Kiểm tra kết nối WiFi
    HTTPClient http;
    WiFiClient client;
    String url = "http://103.130.211.141:8080/fac_api/api/getvalueesp/esp0004"; // URL của trang bạn muốn lấy dữ liệu

    http.begin(client, url); // Khởi động kết nối HTTP
    int httpCode = http.GET(); // Gửi yêu cầu GET

    if (httpCode > 0) { // Kiểm tra phản hồi từ máy chủ
      if (httpCode == HTTP_CODE_OK) {
        String payload = http.getString(); // Lấy nội dung trả về từ máy chủ
        Serial.println(payload); // In nội dung trả về lên Serial Monitor
      }
    } else {
      Serial.printf("GET request failed, error: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end(); // Kết thúc kết nối
  } else {
    Serial.println("WiFi not connected");
  }

  delay(10000); // Đợi 10 giây trước khi gửi yêu cầu tiếp theo
}
