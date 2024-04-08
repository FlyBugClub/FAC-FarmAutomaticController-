//region Includes

  #include <ESP8266WiFi.h>
  #include <ESP8266HTTPClient.h>
  #include <ArduinoJson.h>
  #include "secret_pass.h"

  #include <Wire.h>
  #include "Adafruit_SHT31.h"

  #include <NTPClient.h>
  #include <WiFiUdp.h>
//region Struct
  struct Equipment {
    String id_sensor;
    int mode;
    float status;
    // Định nghĩa struct cho lịch trình hoạt động
    struct Schedule {
        String *time; // Sử dụng con trỏ để tạo mảng động
        size_t numTimes; // Số lượng thời gian trong lịch trình
    } schedule;
  };
//region Constants
  const char* ntpServer = "pool.ntp.org";
  const int ntpPort = 123;
  const char* server_address = "172.16.17.38/Today";
  const int server_port = 443;
  const int pumpPin = D6;
  const long timeZoneOffset = 7 * 3600;
  const unsigned long sprayInterval = 10000; // 10 seconds

//region Variables
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
  String previousDate = "";

//region Function prototypes
  void setup();
  void loop();
  void connectToWiFi();
  void getCurrentDateTime(String& formattedDateTime);
  void postHumidityToAPI(const char* url, String formattedDateTime, const char* id_sensor);
  void postCountPumpToAPI(const char* url, String formattedDateTime, const char* id_sensor);
  void autoControlMode(float& temperature, float& humidity);
  bool isNewDay(String formattedTime);

//region setup
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
//region loop
  void loop() {
    if (!wifiConnected) {
      connectToWiFi();
    }
    
    String formattedDateTime;
    // getCurrentDateTime(formattedDateTime);
    // countPumpActivations(formattedDateTime);
    // postHumidityToAPI("/api/sensorvalues", formattedDateTime, id_sensor);
    // getAndParseAPI("/api/login/admin@gmail.com/123456");
    getAndParseAPI("/api/getvalueesp/ESP0001");

    // manageAutoControl();


  }
//region stuffgetAndParseAPI1
  bool isNewDay(String formattedTime, String& previousDate) {
    // Lấy ngày từ chuỗi định dạng "%Y-%m-%d"
    String currentDate = formattedTime.substring(0, 10);
    Serial.println("currentDate");
    Serial.println(currentDate);
    Serial.println("previousDate");
    Serial.println(previousDate);
    // Kiểm tra xem ngày hiện tại có khác ngày trước đó không
    if (currentDate != previousDate) {
        Serial.println("New day has begun");
        previousDate = currentDate; // Cập nhật ngày trước đó thành ngày hiện tại
        return true;
    }
    else {
        Serial.println("Hope u have a happy day");
        return false;
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

  void countPumpActivations(String formattedTime) {
    if (isNewDay(formattedTime, previousDate)) {
      pumpActivationCount = 0;
    }
    if (digitalRead(pumpPin) == HIGH) {
      pumpActivationCount++;
      postCountPumpToAPI("/api/equidmentvalues", formattedTime, id_sensor);

    }
  }
//region POST
  void postHumidityToAPI(const char* url, String formattedDateTime, const char* id_sensor ) {
    WiFiClient client;
    HTTPClient http;
    String api_url = "http://" + String(server_address) + url;

    http.begin(client, api_url);
    // client.setInsecure();

    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<256> doc;
    doc["id_sensor"] = id_sensor;
    doc["value"] = "22222";
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

  void postCountPumpToAPI(const char* url, String formattedDateTime, const char* id_sensor) {
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
//region GET
#TODO error GET
  void getAndParseAPI(const char* url) {
    WiFiClient client;
    HTTPClient http;

    String api_url = "http://" + String(server_address) + url;

    http.begin(client, api_url);

    int httpCode = http.GET();
    
    if (httpCode > 0) {
        String payload = http.getString();
        Serial.println("Received JSON:");
        Serial.println(payload);
        StaticJsonDocument<1024> doc;
        DeserializationError error = deserializeJson(doc, payload);

        if (!error) {
            // Lấy đối tượng JSON cho equipment0
            JsonObject equipment0 = doc[0]["equipment0"];

            // Lấy các trường dữ liệu từ equipment0
            String id_sensor = equipment0["id_sensor"].as<String>();
            int mode = equipment0["Mode"];
            float status = equipment0["status"];

            // In ra các giá trị lấy được
            Serial.println("Equipment 0:");
            Serial.println("ID Sensor: " + id_sensor);
            Serial.println("Mode: " + String(mode));
            Serial.println("Status: " + String(status));

            // Kiểm tra xem schedule có tồn tại không
            if (equipment0.containsKey("schedule")) {
                JsonObject schedule = equipment0["schedule"];

                // Lặp qua các thời điểm trong schedule và in ra
                
            } else {
                Serial.println("No schedule available for equipment 0.");
            }
        } else {
            Serial.println("Failed to parse JSON.");
        }
    } else {
        Serial.print("GET request failed with error code: ");
        Serial.println(httpCode);
    }

    http.end();
}





//region AUTO CONTROL
  void manageAutoControl() {
    if (autoControl) {
      autoControlMode(desiredTemperature, desiredHumidity);
    }
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



//region connect wifi and sensor
  void reconnectSensor() {
    Serial.println("Attempting to reconnect sensor...");

    // Thử khởi tạo lại cảm biến
    if (!sht31.begin(0x44)) {  // Set to 0x45 for alternate i2c addr
      Serial.println("Couldn't find SHT31. Retrying...");
      delay(1000);
      return;  // Thử lại sau một khoảng thời gian
    }
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