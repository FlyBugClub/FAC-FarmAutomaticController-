//region Includes

  #include <ESP8266WiFi.h>
  #include <ESP8266HTTPClient.h>
  #include <WiFiManager.h> // Thêm khai báo thư viện WiFiManager
  #include <ArduinoJson.h>
  #include "secret_pass.h"

  #include <Wire.h>
  #include "Adafruit_SHT31.h"

  #include <NTPClient.h>
  #include <WiFiUdp.h>
//region Struct
  #define MAX_EQUIPMENTS 10
  #define SCHEDULE_CAPACITY 6

  struct Equipment {
      char id_sensor[20];
      char id_bc[20];
      char** schedule;
      size_t schedule_size;
  };

  Equipment equipments[MAX_EQUIPMENTS];
  size_t num_equipments = 0;
//region Constants
// Định nghĩa kích thước mảng tùy thuộc vào số lượng phần tử trong JSON

  const char* ntpServer = "pool.ntp.org";
  const int ntpPort = 123;
  const char* server_address = "ngunemay123.bsite.net";
  const int server_port = 443;
  const int pumpPin = D6;
  const long timeZoneOffset = 7 * 3600;
  const unsigned long sprayInterval = 10000; // 10 seconds

  const char* mqtt_server = "broker.emqx.io";
  const uint16_t mqtt_port = 1883;
  const char* mqtt_topic_hello = "hello_topic";
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
    // Khởi tạo mảng các thiết bị

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
    for (int i = 0; i < num_equipments; i++) {
                Serial.print("ID Sensor: ");
                Serial.println(equipments[i].id_sensor);
                Serial.print("ID BC: ");
                Serial.println(equipments[i].id_bc);
                Serial.print("Mode: ");
              
                Serial.println("Schedule:");
                for (int j = 0; j < equipments[i].schedule_size; j++) {
                    Serial.println(equipments[i].schedule[j]);
                }
            }
    // manageAutoControl();

  delay(1000);
  Serial.print("xinchao");
  }
//region stuff
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
    WiFiClientSecure client;
    HTTPClient http;
    String api_url = "http://" + String(server_address) + url;

    http.begin(client, api_url);
    client.setInsecure();

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
//TODO error GET
  void getAndParseAPI(const char* url) {
    WiFiClientSecure client;
    HTTPClient http;

    String api_url = "https://" + String(server_address) + url;

    http.begin(client, api_url);
    client.setInsecure();
    int httpCode = http.GET();
    
    if (httpCode > 0) {
        String payload = http.getString();
        StaticJsonDocument<1024> doc;
        DeserializationError error = deserializeJson(doc, payload);
        
        if (!error) {
            for (JsonVariant v : doc.as<JsonArray>()) {
                JsonObject equipmentData = v.as<JsonObject>();
                
                // Extract information for each equipment
                for (int i = 0; i < MAX_EQUIPMENTS; i++) {
                    String equipmentKey = "equiment" + String(i);
                    if (equipmentData.containsKey(equipmentKey)) {
                        JsonObject equipment = equipmentData[equipmentKey];
                        
                        // Extract id_sensor and id_bc
                        const char* id_sensor = equipment["id_sensor"];
                        const char* id_bc = equipment["id_bc"];

                        // Extract schedule
                        JsonObject schedule = equipment["schedule"];
                        size_t scheduleSize = min(schedule.size(), static_cast<size_t>(SCHEDULE_CAPACITY));

                        // Check if equipments array needs resizing
                        if (num_equipments >= MAX_EQUIPMENTS) {
                            Serial.println("Maximum number of equipments reached!");
                            break;
                        }

                        // Store information in the equipments array
                        equipments[num_equipments].schedule_size = scheduleSize;
                        strncpy(equipments[num_equipments].id_sensor, id_sensor, sizeof(equipments[num_equipments].id_sensor));
                        strncpy(equipments[num_equipments].id_bc, id_bc, sizeof(equipments[num_equipments].id_bc));
                        equipments[num_equipments].schedule = new char*[scheduleSize];
                        
                        int j = 0;
                        for (JsonPair kvp : schedule) {
                            if (j >= scheduleSize) break;
                            equipments[num_equipments].schedule[j] = new char[9];
                            strncpy(equipments[num_equipments].schedule[j], kvp.value(), 9);
                            j++;
                        }
                        num_equipments++;
                    }
                }
            }
        } else {
            Serial.println("Failed to parse JSON");
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
  void connectToWiFi() {
  // Khởi tạo WiFiManager
  WiFiManager wifiManager;

  // Kiểm tra xem ESP8266 có kết nối WiFi hay không
  if (!WiFi.isConnected()) {
    // Thử kết nối WiFi hoặc chuyển sang chế độ điểm truy cập (AP) để cấu hình WiFi mới
    if (!wifiManager.autoConnect("ESP8266_AP")) {
      Serial.println("Failed to connect and hit timeout");
      // Nếu kết nối thất bại sau một khoảng thời gian, reset thiết bị
      ESP.reset();
      delay(1000);
    } else {
      // In ra thông báo khi kết nối WiFi thành công
      Serial.println("Connected to WiFi");
      Serial.print("SSID: ");
      Serial.println(WiFi.SSID()); // In ra tên của mạng WiFi đã kết nối
      timeClient.setTimeOffset(timeZoneOffset);
      autoControl = true;
      wifiConnected = true; // Cập nhật trạng thái kết nối WiFi
    }
  }
  }
//region MQTTX POST

//region MQTTX GET
//region callBack
  // void callback(char* topic, byte* payload, unsigned int length) {
  // StaticJsonDocument<1024> doc;
  // DeserializationError error = deserializeJson(doc, payload);
  // for (JsonVariant v : doc.as<JsonArray>()) {
  //     JsonObject obj = v.as<JsonObject>();
  //     // Iterate through each key-value pair of the object
  //     for (JsonPair kvp : obj) {
  //         JsonObject equipment = kvp.value();
  //         if (num_equipments >= array_capacity) {
  //             // Mảng không đủ lớn, thêm một kích thước mới cho nó
  //             array_capacity *= 2;
  //             Equipment* new_equipments = new Equipment[array_capacity];
  //             // Sao chép dữ liệu từ mảng cũ sang mảng mới
  //             memcpy(new_equipments, equipments, num_equipments * sizeof(Equipment));
  //             delete[] equipments;
  //             equipments = new_equipments;
  //         }

  //         // Sao chép thông tin từ JSON vào mảng thiết bị
  //         strncpy(equipments[num_equipments].id_sensor, equipment["id_sensor"], sizeof(equipments[num_equipments].id_sensor));
  //         equipments[num_equipments].Mode = equipment["Mode"];
  //         equipments[num_equipments].status = equipment["status"];

  //         JsonObject schedule = equipment["schedule"];
  //         equipments[num_equipments].schedule_size = std::min(schedule.size(), static_cast<size_t>(SCHEDULE_CAPACITY));
  //         equipments[num_equipments].schedule = new char*[equipments[num_equipments].schedule_size];
  //         int i = 0;
  //         // Iterate through each schedule item
  //         for (JsonPair kvp_schedule : schedule) {
  //             if (i >= equipments[num_equipments].schedule_size) break; // Đảm bảo không vượt quá kích thước tối đa
  //             equipments[num_equipments].schedule[i] = new char[9]; // Đảm bảo đủ kích thước cho chuỗi
  //             strncpy(equipments[num_equipments].schedule[i], kvp_schedule.value(), 9);
  //             i++;
  //         }
  //         num_equipments++; 
  //     }
  //   }
  // }