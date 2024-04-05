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
  Serial.println("hehe");
  Serial.println(payload);
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
  int membership = user["membership"].as<int>(); // Chuyển đổi thành kiểu int

  JsonObject sensor = doc[0]["0"];
  const char* espId = sensor["id_esp"];
  const char* espName = sensor["name"];
  int bcValue = sensor["bc"].as<int>(); // Chuyển đổi thành kiểu int
  int dhtValue = sensor["dht"].as<int>(); // Chuyển đổi thành kiểu int
  int phValue = sensor["ph"].as<int>(); // Chuyển đổi thành kiểu int

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