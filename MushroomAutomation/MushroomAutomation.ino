#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "Thu Tamm";
const char* password = "thutam1975";
const char* server_address = "ngunemay123.bsite.net";
const int server_port = 443; // Port 443 cho HTTPS

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
}

void loop() {
  // POST to one API
  // postToAPI("/post_endpoint"); // Thay đổi URL tại đây

  // GET from another API
  const char* payload = getFromAPI("/api/login/admin@gmail.com/123456"); // Thay đổi URL tại đây
  parseJsonPayload(payload);
  // Delay for 1 second
  delay(1000);
}

void postToAPI(const char* url) {
  WiFiClientSecure client;
  HTTPClient http;

  String api_url = "https://" + String(server_address) + url;

  http.begin(client, api_url);
  client.setInsecure();

  http.addHeader("Content-Type", "application/json");

  int httpCode = http.POST("{}"); // Dữ liệu JSON bạn muốn POST
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

  static char payload[256]; // Khai báo một mảng ký tự tĩnh để lưu trữ payload

  if (httpCode > 0) {
    // Lấy payload và sao chép nó vào mảng ký tự
    http.getString().toCharArray(payload, sizeof(payload));
    Serial.print("GET response: ");
    Serial.println(payload);
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
