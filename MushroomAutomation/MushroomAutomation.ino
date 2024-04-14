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
  #define MAX_EQUIPMENTS 2
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
  const char* mqtt_topic_send = "hihihihihehe";
  WiFiClient espClient;
  PubSubClient client(espClient); 
//region Variables
  bool enableHeater = false;
  uint8_t loopCnt = 0;
  Adafruit_SHT31 sht31;
  WiFiUDP ntpUDP;
  NTPClient timeClient(ntpUDP, ntpServer, ntpPort);
  const char* autoMode0 = "0";
  const char* autoMode1 = "0";
  const char* autoMode2 = "0";
  float desiredTemperature = 25.0;
  float desiredHumidity0 = 60.0;
  float desiredHumidity1 = 60.0;
  float desiredHumidity2 = 60.0;
  unsigned long lastSprayTime[MAX_EQUIPMENTS] = {0};
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
    
    
    String formattedDateTime;
    getCurrentDateTime(formattedDateTime);
    getAndParseAPI("/api/getvalueesp/ESP0001");

    Serial.println("num_equipments:");Serial.flush();
    Serial.println(num_equipments);Serial.flush();
    for (int i = 0; i < num_equipments; i++) {
                Serial.print("ID Sensor: ");Serial.flush();
                Serial.println(equipments[i].id_sensor);Serial.flush();
                Serial.print("ID BC: ");Serial.flush();
                Serial.println(equipments[i].id_bc);Serial.flush();
                Serial.print("Mode: ");Serial.flush();
              
                Serial.println("Schedule:");Serial.flush();
                for (int j = 0; j < equipments[i].schedule_size; j++) {
                    Serial.println(equipments[i].schedule[j]);Serial.flush();
                }
            }            
    // countPumpActivations(formattedDateTime);
    postHumidityToAPI("/api/sensorvalues", formattedDateTime, id_sensor);
    postCountPumpToAPI("/api/equidmentvalues", formattedDateTime, id_sensor);
    
    // manageAutoControl();
    
    sendHelloMessage();
    
    
    client.loop();
    sendMQTTMessage();

  }
//region stuff
  bool isNewDay(String formattedTime, String& previousDate) {
    // Lấy ngày từ chuỗi định dạng "%Y-%m-%d"
    String currentDate = formattedTime.substring(0, 10);
    Serial.println("currentDate");Serial.flush();
    Serial.println(currentDate);Serial.flush();
    Serial.println("previousDate");Serial.flush();
    Serial.println(previousDate);Serial.flush();
    // Kiểm tra xem ngày hiện tại có khác ngày trước đó không
    if (currentDate != previousDate) {
        Serial.println("New day has begun");Serial.flush();
        previousDate = currentDate; // Cập nhật ngày trước đó thành ngày hiện tại
        return true;
    }
    else {
        Serial.println("Hope u have a happy day");Serial.flush();
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
      Serial.print("Attempting MQTT connection...");Serial.flush();
      if (client.connect("helloem")) {
        Serial.println("connected");Serial.flush();
        client.subscribe("hello_topic");
      } else {
        Serial.print("failed, rc=");Serial.flush();
        Serial.print(client.state());Serial.flush();
        Serial.println(" try again in 5 seconds");Serial.flush();
        delay(5000);
      }
    }
  }
//region POST
  void postHumidityToAPI(const char* url, String formattedDateTime, const char* id_sensor ) {
    WiFiClientSecure client;
    HTTPClient http;
    String api_url = "https://" + String(server_address) + url;

    http.begin(client, api_url);
    client.setInsecure();

    http.addHeader("Content-Type", "application/json");
    Serial.println(formattedDateTime);
    StaticJsonDocument<256> doc;
    doc["id_sensor"] = "SenSor0001";
    doc["value"] = 88.0;
    doc["datetime"] = formattedDateTime;
    String payload;
    serializeJson(doc, payload);

    int httpCode = http.POST(payload);
    Serial.print("POST httpCode: ");Serial.flush();
    Serial.println(httpCode);Serial.flush();

    if (httpCode > 0) {
      String payload = http.getString();
      Serial.print("POST Humidity response: ");Serial.flush();
      Serial.println(payload);Serial.flush();
    } else {
      Serial.print("POST request failed with error code: ");Serial.flush();
      Serial.println(httpCode);Serial.flush();
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
    doc["status"] = "1";
    doc["datetime"] = formattedDateTime;
    String payload;
    serializeJson(doc, payload);

    int httpCode = http.POST(payload);
    Serial.print("POST httpCode: ");Serial.flush();
    Serial.println(httpCode);Serial.flush();

    if (httpCode > 0) {
      String payload = http.getString();
      Serial.print("POST CountPump response: ");Serial.flush();
      Serial.println(payload);Serial.flush();
    } else {
      Serial.print("POST request failed with error code: ");Serial.flush();
      Serial.println(httpCode);Serial.flush();
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
        Serial.println(payload);Serial.flush();
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
                            Serial.println("Maximum number of equipments reached!");Serial.flush();
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
            Serial.println("Failed to parse JSON");Serial.flush();
        }
    } else {
        Serial.print("GET request failed with error code: ");Serial.flush();
        Serial.println(httpCode);Serial.flush();
    }

    http.end(); 
  }

//region AUTO CONTROL
  void autoControlMode(int pumpIndex, float humidity) {
    float currentHumidity = sht31.readHumidity();
    unsigned long currentMillis = millis();

    if (currentHumidity < humidity && currentMillis - lastSprayTime[pumpIndex] >= sprayInterval) {
        digitalWrite(pumpIndex == 0 ? pumpPin0 : (pumpIndex == 1 ? pumpPin1 : pumpPin2), HIGH);
        lastSprayTime[pumpIndex] = currentMillis;
        delay(5000);
        digitalWrite(pumpIndex == 0 ? pumpPin0 : (pumpIndex == 1 ? pumpPin1 : pumpPin2), LOW);
    } else {
        digitalWrite(pumpIndex == 0 ? pumpPin0 : (pumpIndex == 1 ? pumpPin1 : pumpPin2), LOW);
    }
  }
//region Mannual
  void controlPump(int pumpIndex, int status) {
    if (status == 0) {
        digitalWrite(pumpIndex == 0 ? pumpPin0 : (pumpIndex == 1 ? pumpPin1 : pumpPin2), LOW);
        // Serial.println("Pump is OFF");
    } else if (status == 1) {
        digitalWrite(pumpIndex == 0 ? pumpPin0 : (pumpIndex == 1 ? pumpPin1 : pumpPin2), HIGH);
        // Serial.println("Pump is ON");
    } else {
        Serial.println("Invalid status");Serial.flush();
    }
  }

//region Schedule
  bool isPumpActive = false; // Biến kiểm tra xem bơm đã được kích hoạt để tưới cây hay chưa

  void waterPlants(int count) {
    static unsigned long lastWateringTime = 0; // Biến lưu thời điểm tưới cây cuối cùng
    unsigned long currentEpochTime = timeClient.getEpochTime(); // Lấy thời gian Epoch
    time_t epochTime = (time_t)currentEpochTime; // Chuyển đổi sang dạng time_t
    struct tm *currentTimeStruct = localtime(&epochTime); // Chuyển đổi sang cấu trúc tm

    // Lấy giờ, phút và giây từ cấu trúc tm
    int hour = currentTimeStruct->tm_hour;
    int minute = currentTimeStruct->tm_min;
    int second = currentTimeStruct->tm_sec;
    int totalSeconds = hour * 3600 + minute * 60 + second;
    
    // In ra giờ, phút và giây
    Serial.print("Giờ: ");Serial.flush();
    Serial.println(hour);Serial.flush();
    Serial.print("Phút: ");Serial.flush();
    Serial.println(minute);Serial.flush();
    Serial.print("Giây: ");Serial.flush();
    Serial.println(second);Serial.flush();

    // Kiểm tra xem đã đến lúc tưới cây chưa và bơm chưa được kích hoạt
    if (!isPumpActive && (totalSeconds - lastWateringTime >= 5000)) { // Chờ 5 giây giữa mỗi lần tưới
        // Lấy lịch trình tưới cây cho thiết bị có chỉ số count
        Equipment equipment = equipments[count];
        char** schedule = equipment.schedule;
        size_t schedule_size = equipment.schedule_size;

        // Lặp qua lịch trình để kiểm tra thời điểm tưới cây
        for (int j = 0; j < schedule_size; j++) {
            char* wateringTime = schedule[j]; // Lấy thời điểm tưới cây tại chỉ số j trong mảng

            // Tính toán thời gian còn lại đến thời điểm tưới cây
            int hour, minute, second;
            sscanf(wateringTime, "%d:%d:%d", &hour, &minute, &second);
            int wateringTotalSeconds = hour * 3600 + minute * 60 + second;
            
            // Nếu đã đến thời điểm tưới cây
            if (totalSeconds >= wateringTotalSeconds && totalSeconds <= wateringTotalSeconds + 60) { // Chấp nhận một khoảng thời gian 60 giây cho phép trễ
                controlPump(count, HIGH); // Kích hoạt bơm tưới cây cho thiết bị tại chỉ số count
                lastWateringTime = totalSeconds; // Lưu thời điểm tưới cây cuối cùng
                isPumpActive = true; // Đánh dấu rằng bơm đã được kích hoạt
                break; // Thoát khỏi vòng lặp khi đã tìm thấy thời điểm tưới cây
            }

            // Tính toán thời gian còn lại đến thời điểm tưới cây
            int remainingTimeInSeconds = wateringTotalSeconds - totalSeconds; // Chuyển đổi thời gian còn lại sang giây
            int remainingHours = remainingTimeInSeconds / 3600; // Tính số giờ còn lại
            int remainingMinutes = (remainingTimeInSeconds % 3600) / 60; // Tính số phút còn lại

            Serial.print("Còn ");Serial.flush();
            Serial.print(remainingHours);Serial.flush();
            Serial.print(" giờ ");Serial.flush();
            Serial.print(remainingMinutes);Serial.flush();
            Serial.println(" phút nữa sẽ tưới cây");Serial.flush();
        }
    }

    // Kiểm tra xem đã đủ thời gian để tắt bơm chưa
    if (isPumpActive && (totalSeconds - lastWateringTime >= 5000)) {
        controlPump(count, LOW); // Tắt bơm
        isPumpActive = false; // Đánh dấu rằng bơm đã được tắt
    }
  }


//region process
  void processAutoMode(const char* automode, int expect_value, int status, int count) {
    if (strcmp(automode, "0") == 0) { // Chế độ tự động
        // Serial.println("Chế độ tự động");
        switch (count) {
            case 0:
                autoMode0 = "0";
                desiredHumidity0 = expect_value;
                autoControlMode(0, desiredHumidity0);
                break;
            case 1:
                autoMode1 = "0";
                desiredHumidity1 = expect_value;
                autoControlMode(1, desiredHumidity1);
                break;
            case 2:
                autoMode2 = "0";
                desiredHumidity2 = expect_value;
                autoControlMode(2, desiredHumidity2);
                break;
            default:
                // Serial.println("Số lượng không hợp lệ");
                break;
        }
    } else if (strcmp(automode, "1") == 0) { // Chế độ thủ công
        // Serial.println("Chế độ thủ công");
        switch (count) {
            case 0:
                controlPump(0, status);
                desiredHumidity0 = expect_value;
                autoMode0 = "1";
                break;
            case 1:
                controlPump(1, status);
                desiredHumidity0 = expect_value;
                autoMode1 = "1";
                break;
            case 2:
                controlPump(2, status);
                desiredHumidity0 = expect_value;
                autoMode2 = "1";
                break;
            default:
                // Serial.println("Số lượng không hợp lệ");
                break;
        }
    } else if (strcmp(automode, "2") == 0) { // Chế độ hẹn giờ
        switch (count) {
            case 0:
                autoMode0 = "2";
                desiredHumidity0 = expect_value;
                waterPlants(0);
                break;
            case 1:
                autoMode1 = "2";
                desiredHumidity1 = expect_value;
                waterPlants(1);
                break;
            case 2:
                autoMode2 = "2";
                desiredHumidity2 = expect_value;
                waterPlants(2);
                break;
            default:
                // Serial.println("Số lượng không hợp lệ");
                break;
        }
    } else {
        // Serial.println("Chế độ không hợp lệ");
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
      Serial.println("Failed to connect and hit timeout");Serial.flush();
      // Nếu kết nối thất bại sau một khoảng thời gian, reset thiết bị
      ESP.reset();
      delay(1000);
    } else {
      // In ra thông báo khi kết nối WiFi thành công
      Serial.println("Connected to WiFi");Serial.flush();
      Serial.print("SSID: ");Serial.flush();
      Serial.println(WiFi.SSID()); // In ra tên của mạng WiFi đã kết nốiSerial.flush();
      timeClient.setTimeOffset(timeZoneOffset);
      wifiConnected = true; // Cập nhật trạng thái kết nối WiFi
    }
  }
  }
//region MQTTX POST
  void sendHelloMessage() {
    if (client.connected()) {
      // Tạo một bộ nhớ đệm để lưu trữ dữ liệu JSON
      StaticJsonDocument<1000> doc;


      // Thiết lập các giá trị trong JSON
      doc["id_esp"] = "ESP0001";

      doc["equiment"]["equiment0"];
      doc["equiment"]["equiment0"]["id_bc"] = "BC0001";
      doc["equiment"]["equiment0"]["automode"] = "2";
      doc["equiment"]["equiment0"]["expect_value"] = 85;
      doc["equiment"]["equiment0"]["status"] = 0;

      doc["equiment"]["equiment1"];
      doc["equiment"]["equiment1"]["id_bc"] = "BC0002";
      doc["equiment"]["equiment1"]["automode"] = "2";
      doc["equiment"]["equiment1"]["expect_value"] = 85;
      doc["equiment"]["equiment1"]["status"] = 1;
      

      // Chuyển đổi JSON thành chuỗi
      char jsonBuffer[1000];
      serializeJson(doc, jsonBuffer);

      // Gửi chuỗi JSON lên MQTT
      client.publish(mqtt_topic_hello, jsonBuffer);
      client.flush();
      // Gửi thông báo đã được ký tự hóa JSON đến chủ đề MQTT
        bool messageSent = client.publish(mqtt_topic_hello, jsonBuffer);
        client.flush();
        if (messageSent) {
          Serial.println("Thành công khi gửi tin nhắn MQTT!");Serial.flush();
        } else {
          Serial.println("Không thể gửi tin nhắn MQTT!");Serial.flush();
        }
    }
  }

  void sendMQTTMessage() {
  if (client.connected()) {
    // Tạo một tài liệu JSON với phân bổ bộ nhớ đủ
    StaticJsonDocument<512> doc;

    // Thiết lập giá trị "id_esp" chung
    doc["id_esp"] = "ESP0001";

    // Tạo một đối tượng lồng nhau cho "equipment"
    JsonObject equipmentObject = doc.createNestedObject("equipment");

    // Lặp qua mảng equipments và thêm từng thiết bị vào như một đối tượng lồng nhau
    for (size_t i = 0; i < num_equipments; ++i) {
      // Tạo một đối tượng lồng nhau mới cho thiết bị hiện tại
      String equipmentName = "equipment" + String(i);
      JsonObject currentEquipment = equipmentObject.createNestedObject(equipmentName);

      // Thêm dữ liệu từ equipments[i] vào đối tượng thiết bị hiện tại
      currentEquipment["id_bc"] = equipments[i].id_bc;
      const char* autoMode;
      // Sử dụng mảng autoMode để thiết lập automode
      autoMode = (i == 0) ? autoMode0 : ((i == 1) ? autoMode1 : autoMode2);
      Serial.print("autoMode ");Serial.flush();
      Serial.print(i);Serial.flush();
      Serial.print(": ");Serial.flush();
      Serial.println(autoMode);Serial.flush();
      currentEquipment["automode"] = autoMode;  

      // Sử dụng một câu lệnh switch-case để xác định thiết bị và thiết lập giá trị mong muốn và trạng thái
      switch (i) {
        case 0:
          currentEquipment["expect_value"] = desiredHumidity0;
          currentEquipment["status"] = digitalRead(pumpPin0);
          break;
        case 1:
          currentEquipment["expect_value"] = desiredHumidity1;
          currentEquipment["status"] = digitalRead(pumpPin1);
          break;
        case 2:
          currentEquipment["expect_value"] = desiredHumidity2;
          currentEquipment["status"] = digitalRead(pumpPin2);
          break;
        default:
          // Xử lý trường hợp index có thể vượt quá giới hạn (tùy chọn)
          break;
      }
    }

    // Chuyển đổi tài liệu JSON thành một bộ đệm ký tự
    char jsonBuffer[512];
    serializeJson(doc, jsonBuffer);
    Serial.println(jsonBuffer);Serial.flush();
    // Gửi thông báo đã được ký tự hóa JSON đến chủ đề MQTT
    bool messageSent = client.publish(mqtt_topic_send, jsonBuffer);
    client.flush();
    if (messageSent) {
      Serial.println("Thành công khi gửi tin nhắn MQTT!");
    } else {
      Serial.println("Không thể gửi tin nhắn MQTT!");Serial.flush();
    }
  } else {
    Serial.println("Không kết nối được với máy chủ MQTT!");Serial.flush();
  }
  }

//region MQTTX GET
  void callback(char* topic, byte* payload, unsigned int length) {
  // Serial.print("Message arrived [");
  // Serial.print(topic);
  // Serial.print("] ");

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
    Serial.println("correct id");Serial.flush();
    // Lấy dữ liệu về thiết bị
    JsonObject equiments = doc["equiment"];
    int count = 0;
    // Duyệt qua từng thiết bị
    for (JsonPair equiment : equiments) {
     
      const char* equimentId = equiment.key().c_str();
      // Serial.print("Equiment ID: ");
      // Serial.println(equimentId);
      
      // Truy cập thông tin của từng thiết bị
      JsonObject equimentData = equiment.value();
      const char* id_bc = equimentData["id_bc"];
      const char* automode = equimentData["automode"];
      int expect_value = equimentData["expect_value"];
      int status = equimentData["status"];

      // Xử lý dữ liệu của thiết bị
      Serial.print("automode ");Serial.flush();
      Serial.println(count);Serial.flush();
      Serial.println("get ve la: ");
      Serial.flush();
      Serial.println(automode);
      Serial.flush();
      processAutoMode(automode, expect_value, status, count);
      count++;
    }
  }
  }