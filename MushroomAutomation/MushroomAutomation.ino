//region Includes

  #include <ESP8266WiFi.h>
  #include <ESP8266HTTPClient.h>
  #include <WiFiManager.h> // Thêm khai báo thư viện WiFiManager
  #include <ArduinoJson.h>
  #include "secret_pass.h"
  #include <PubSubClient.h>
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

  const char* ntpServer = "pool.ntp.org";
  const int ntpPort = 123;
  const char* server_address = "ngunemay123.bsite.net";
  const int server_port = 443;
  const int pumpPin0 = D6;
  const int pumpPin1 = D7;
  const int pumpPin2 = D8;
  const long timeZoneOffset = 7 * 3600;
  const unsigned long sprayInterval = 10000; // 10 seconds

  const char* mqtt_server = "broker.emqx.io";
  const uint16_t mqtt_port = 1883;
  const char* mqtt_topic_hello = "hello_topic";
  WiFiClient espClient;
  PubSubClient client(espClient); 
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
    pinMode(pumpPin0, OUTPUT);
    pinMode(pumpPin1, OUTPUT);
    pinMode(pumpPin2, OUTPUT);
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
    client.setServer(mqtt_server, mqtt_port);
    
    client.setCallback(callback);
  }
  
//region loop
  void loop() {
    if (!wifiConnected) {
      connectToWiFi();
    }
    if (!client.connected()) {
    reconnect();
    }
    client.loop();
    
    String formattedDateTime;
    getCurrentDateTime(formattedDateTime);
    // getAndParseAPI("/api/getvalueesp/ESP0001");
    // Serial.println("num_equipments:");
    // Serial.println(num_equipments);
    // for (int i = 0; i < num_equipments; i++) {
    //             Serial.print("ID Sensor: ");
    //             Serial.println(equipments[i].id_sensor);
    //             Serial.print("ID BC: ");
    //             Serial.println(equipments[i].id_bc);
    //             Serial.print("Mode: ");
              
    //             Serial.println("Schedule:");
    //             for (int j = 0; j < equipments[i].schedule_size; j++) {
    //                 Serial.println(equipments[i].schedule[j]);
    //             }
    //         }
    // countPumpActivations(formattedDateTime);
    // postHumidityToAPI("/api/sensorvalues", formattedDateTime, id_sensor);
    
    
    // manageAutoControl();
    sendHelloMessage();
    delay(1000);
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

  // void countPumpActivations(String formattedTime) {
  //   if (isNewDay(formattedTime, previousDate)) {
  //     pumpActivationCount = 0;
  //   }
  //   if (digitalRead(pumpPin) == HIGH) {
  //     pumpActivationCount++;
  //     postCountPumpToAPI("/api/equidmentvalues", formattedTime, id_sensor);

  //   }
  // }
  void reconnect() {
    while (!client.connected()) {
      Serial.print("Attempting MQTT connection...");
      if (client.connect("helloem")) {
        Serial.println("connected");
        client.subscribe("hello_topic");
      } else {
        Serial.print("failed, rc=");
        Serial.print(client.state());
        Serial.println(" try again in 5 seconds");
        delay(5000);
      }
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
  void getAndParseAPI(const char* url) {
    num_equipments = 0;
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

  // void autoControlMode(float& temperature, float& humidity) {
  //   float currentHumidity = sht31.readHumidity();
  //   unsigned long currentMillis = millis();

  //   if (currentHumidity < humidity && currentMillis - lastSprayTime >= sprayInterval) {
  //     digitalWrite(pumpPin, HIGH);
  //     lastSprayTime = currentMillis;
  //     delay(2000);
  //     digitalWrite(pumpPin, LOW);
  //   } else {
  //     digitalWrite(pumpPin, LOW);
  //   }
  // }
//region mannualControl
  void controlPump(int pumpPin, bool status) {
    digitalWrite(pumpPin, status ? HIGH : LOW);
    Serial.print("Pump is ");
    Serial.println(status ? "ON" : "OFF");
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
  void sendHelloMessage() {
    if (client.connected()) {
      // Tạo một bộ nhớ đệm để lưu trữ dữ liệu JSON
      StaticJsonDocument<256> doc;

      // Thiết lập các giá trị trong JSON
      doc["id_esp"] = "ESP0001";

      doc["equiment"]["equiment0"];
      doc["equiment"]["equiment0"]["id_bc"] = "BC0001";
      doc["equiment"]["equiment0"]["automode"] = "1";
      doc["equiment"]["equiment0"]["expect_value"] = 65;
      doc["equiment"]["equiment0"]["status"] = 0;

      doc["equiment"]["equiment1"];
      doc["equiment"]["equiment1"]["id_bc"] = "BC0001";
      doc["equiment"]["equiment1"]["automode"] = "1";
      doc["equiment"]["equiment1"]["expect_value"] = 65;
      doc["equiment"]["equiment1"]["status"] = 0;

      // Chuyển đổi JSON thành chuỗi
      char jsonBuffer[256];
      serializeJson(doc, jsonBuffer);

      // Gửi chuỗi JSON lên MQTT
      client.publish(mqtt_topic_hello, jsonBuffer);
      Serial.println("send succeed");
    }
  }
//region MQTTX GET
//region callBack
  void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");

  // Parse JSON
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, payload, length);

  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.c_str());
    return;
  }

  // Kiểm tra id_esp
  const char* id_esp = doc["id_esp"];
  if (strcmp(id_esp, id_sensor) == 0) {
    // Lấy dữ liệu về thiết bị
    Serial.println("corret id");
    JsonObject equiments = doc["equiment"];
    
    // Duyệt qua từng thiết bị
    for (JsonPair equiment : equiments) {
      const char* equimentId = equiment.key().c_str();
      Serial.print("Equiment ID: ");
      Serial.println(equimentId);
      
      // Truy cập thông tin của từng thiết bị
      JsonObject equimentData = equiment.value();
      const char* id_bc = equimentData["id_bc"];
      const char* automode = equimentData["automode"];
      int expect_value = equimentData["expect_value"];
      int status = equimentData["status"];

      // Xử lý dữ liệu của thiết bị tại đây
      Serial.print("ID_BC: ");
      Serial.println(id_bc);
      Serial.print("Automode: ");
      Serial.println(automode);
      Serial.print("Expect Value: ");
      Serial.println(expect_value);
      Serial.print("Status: ");
      Serial.println(status);
      Serial.println("--------------------");
    }
  }
  }