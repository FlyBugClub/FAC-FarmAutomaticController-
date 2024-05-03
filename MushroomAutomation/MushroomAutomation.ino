//region Includes

  #include <ESP8266WiFi.h>
  #include <ESP8266HTTPClient.h>
  #include <WiFiManager.h> // Thêm khai báo thư viện WiFiManager
  #include <ArduinoJson.h>
  // #include "secret_pass.h"
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
  const char* equipmentIds[MAX_EQUIPMENTS];
  const char* id_bcs[MAX_EQUIPMENTS];
  int automodes[MAX_EQUIPMENTS];
  int expect_values[MAX_EQUIPMENTS];
  int statuses[MAX_EQUIPMENTS];
  int count = 0;
  char id_sensor[20];
  size_t num_equipments = 0;
//region Constants
  const char* ntpServer = "pool.ntp.org";
  const int ntpPort = 123;
  const char* server_address = "ngunemay123.bsite.net";
  const int server_port = 443;
  const int pumpPin0 = D6;
  const int pumpPin1 = D7;
  const int pumpPin2 = D8;
  const int buttonAP = D0; // Nút để kích hoạt AP Mode
  const int buttonReset = D3; // Nút để reset ESP
  const long timeZoneOffset = 7 * 3600;
  const unsigned long sprayInterval = 10000; // 10 seconds
  
  static unsigned long lastWateringTime = 0; // Biến lưu thời điểm tưới cây cuối cùng
  unsigned long currentEpochTime; // Lấy thời gian Epoch
  // Chuyển đổi sang dạng time_t

  // Lấy giờ, phút và giây từ cấu trúc tm
  int hour;
  int minute;
  int second;
  int totalSeconds = hour * 3600 + minute * 60 + second;
//region interupt
  int buttonCount = 0; // Biến lưu trữ số lần nhấn nút
  volatile bool buttonFlag = true; // Biến cờ kiểm tra có ngắt xảy ra hay không



    ICACHE_RAM_ATTR void buttonPressed() {
  // Tăng biến đếm số lần nhấn nút
  if (buttonCount == 0)
  { 
    digitalWrite(2,LOW);
    digitalWrite(16,HIGH);
    Serial.println("config wifi btton click");
    buttonCount = 1;
    buttonFlag = false;
    delay(10);
  }
  else 
  {
    Serial.println("reset btton click");
    buttonCount = 0;
    resetESP();
    buttonFlag = true;
    delay(10);

  }
  // Đặt biến cờ thành true
  
  }
//endregion interupt

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
  bool sensorConnected = false;
  WiFiUDP ntpUDP;
  NTPClient timeClient(ntpUDP, ntpServer, ntpPort);
  int autoMode0 = 0;
  int autoMode1 = 0;
  int autoMode2 = 0;
  float desiredTemperature = 25.0;
  float desiredHumidity0 = 60.0;
  float desiredHumidity1 = 60.0;
  float desiredHumidity2 = 60.0;

  float temperature = 0;
  float humidity = 0;

  unsigned long lastSprayTime[MAX_EQUIPMENTS] = {0};
  bool wifiConnected = false;
  int pumpActivationCount1 = 0;
  int pumpActivationCount2 = 0;
  int pumpActivationCount3 = 0;
  int statusPump0 = LOW;
  int statusPump1 = LOW;
  int statusPump2 = LOW;
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

  unsigned long previousMillisForStatusUpdate = 0;  // Lưu trữ lần ghi nhận thời gian trước đó cho cập nhật trạng thái
  const long statusUpdateInterval = 10000;
//region setup
  void setup() {
    pinMode(pumpPin0, OUTPUT);
    pinMode(pumpPin1, OUTPUT);
    pinMode(pumpPin2, OUTPUT);
    pinMode(buttonAP, INPUT_PULLUP);
    pinMode(buttonReset, INPUT_PULLUP);
    Serial.begin(9600);
    delay(100);
    pinMode (2,OUTPUT);
    pinMode (16,OUTPUT);
  // Đăng ký ngắt cho chân GPIO 0, gọi hàm buttonPressed khi có tín hiệu từ mức cao xuống thấp
    attachInterrupt(0, buttonPressed, RISING);
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
    // digitalWrite(2,HIGH);
    // digitalWrite(16,LOW);
    // Configure the pin as an input with internal pull-up resistor
  }
  int soLan = 0;
//region loop
  void loop() {
    if (buttonFlag) {
    
    // Serial.println("heheeh");
    //region config
      if (!WiFi.isConnected()) {
          connectToWiFi();
        }
      if (!client.connected()) {
        reconnect();
        }
        digitalWrite(2,LOW);
    digitalWrite(16,HIGH);
      String formattedDateTime;
      getCurrentDateTime(formattedDateTime);
      // if (digitalRead(buttonAP) == LOW) { // Nếu nút được nhấn
       
      //   }
      if (digitalRead(buttonReset) == LOW) { // Nếu nút được nhấn
          resetESP();
        }
      if (sht31.begin(0x44)) {   // Set to 0x45 for alternate i2c addr
        Serial.println("SHT31 connected successfully.");
        sensorConnected = true; // Đặt cờ kết nối cảm biến thành công
        } else {
          Serial.println("Couldn't find SHT31. Check wiring!");
          sensorConnected = false;
        }
      client.loop();
    //endregion config
    
    //region getWhenStart
      unsigned long currentMillisForStatusUpdate = millis();  // Lấy thời gian hiện tại

      if (currentMillisForStatusUpdate - previousMillisForStatusUpdate >= statusUpdateInterval) {  // Kiểm tra nếu đã qua 10 giây
          previousMillisForStatusUpdate = currentMillisForStatusUpdate;  // Cập nhật thời gian trước đó
          getWhenStart("/api/laststatus/esp0004");  // Gọi hàm
      }
    //endregion getWhenStart

    //region handleSensorData
      getAndParseAPI("/api/getvalueesp/ESP0004");

      for (int i = 0; i < num_equipments; i++) {
        Serial.print("ID Sensor: ");
        Serial.println(equipments[i].id_sensor);
        temperature = sht31.readTemperature();
        humidity = sht31.readHumidity();
        handleSensorData(equipments[i].id_sensor, formattedDateTime);
         
      }
    //endregion handleSensorData

    //region sendHelloMessage
      // while(soLan == 0)
      // {
      //   sendHelloMessage();
      //   soLan++;
      // }
    //endregion sendHelloMessage

    //region processAutoMode
      for(int i = 0; i < count; i++)
      {
        processAutoMode(automodes[i], expect_values[i], statuses[i], i);
      }
    //endregion processAutoMode

    //region stuff
      printValues();
      Serial.println("Hehehihi");
      sendMQTTMessage();
      Serial.println("=======================================");
      delay(10000);
    //endregion stuff
    }
  }
//region stuff
  void printValues() {
    Serial.print("số thiết bị nhận được: ");
    Serial.println(count);
    for (int i = 0; i < count; ++i) {
      Serial.print("automodes[");
      Serial.print(i);
      Serial.print("]: ");
      Serial.println(automodes[i]);
      
      Serial.print("expect_values[");
      Serial.print(i);
      Serial.print("]: ");
      Serial.println(expect_values[i]);
      
      Serial.print("statuses[");
      Serial.print(i);
      Serial.print("]: ");
      Serial.println(statuses[i]);
      Serial.println("-----------------------------------------");
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
            Serial.println("-----------------------------------------") ;
    }
  }
  void handleSensorData(const String& idSensor, const String& formattedDateTime) {
    int startIndex = 0;
    int endIndex = 0;

    while (endIndex != -1) {
      endIndex = idSensor.indexOf('-', startIndex);
      String part = idSensor.substring(startIndex, endIndex != -1 ? endIndex : idSensor.length());
      startIndex = endIndex + 1;

      Serial.print("Processing ID Part: ");
      Serial.println(part);

      if (!part.isEmpty()) {
        if (part.startsWith("P")) {
          postHumidityToAPI("/api/sensorvalues", formattedDateTime, part.c_str());
        } else if (part.startsWith("D")) {
          postHumidityAndTempToAPI("/api/sensorvalues", formattedDateTime, part.c_str());
        }
      }

    }


  }
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
  int statusPump;
  void countPumpActivations(String formattedTime) {
    if (isNewDay(formattedTime, previousDate)) {
      pumpActivationCount1 = 0;
      pumpActivationCount2 = 0;
      pumpActivationCount3 = 0;
    }
    for (int i = 0; i < num_equipments; i++) { 
        Serial.print("ID BC: ");Serial.flush();
        Serial.println(equipments[i].id_bc);Serial.flush();          
    }    
    checkPump(pumpPin0, pumpActivationCount1, statusPump0, formattedTime, equipments[0].id_bc);
    checkPump(pumpPin1, pumpActivationCount2, statusPump1, formattedTime, equipments[1].id_bc);
    checkPump(pumpPin2, pumpActivationCount3, statusPump2, formattedTime, equipments[2].id_bc);
  }

  void checkPump(int pumpPin, int &activationCount, int &statusPump, String formattedTime, const char* id_bc) {
    if (digitalRead(pumpPin) == HIGH) {
      statusPump = HIGH;
      activationCount++;
      postCountPumpToAPI("/api/equipmentvalues", formattedTime, id_bc, activationCount, statusPump);
    }
    }
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

  String getIdPart(const String& id_sensor, int partIndex) {
    int dashIndex = id_sensor.indexOf('-');
    if (dashIndex != -1) {
      if (partIndex == 0)
        return id_sensor.substring(0, dashIndex);  // Trả về phần trước dấu gạch ngang
      else
        return id_sensor.substring(dashIndex + 1); // Trả về phần sau dấu gạch ngang
    }
    return ""; // Trả về chuỗi rỗng nếu không tìm thấy dấu gạch ngang
    }
//region POST
  void postHumidityAndTempToAPI(const char* url, String formattedDateTime, const char* id_sensor) {
    WiFiClientSecure client;
    HTTPClient http;
    String api_url = "https://" + String(server_address) + url;

    http.begin(client, api_url);
    client.setInsecure();

    http.addHeader("Content-Type", "application/json");
    Serial.println(formattedDateTime);
    StaticJsonDocument<256> doc;
    doc["id_sensor"] = id_sensor;
    doc["value_humid"] = humidity;
    doc["datetime"] = formattedDateTime;
    doc["value_temp"] = temperature;
    String payload;
    serializeJson(doc, payload);
    Serial.print("temperature: ");
    Serial.println(temperature);
    Serial.print("humidity: ");
    Serial.println(humidity);

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
  void postHumidityToAPI(const char* url, String formattedDateTime, const char* id_sensor) {
    WiFiClientSecure client;
    HTTPClient http;
    String api_url = "https://" + String(server_address) + url;

    http.begin(client, api_url);
    client.setInsecure();

    http.addHeader("Content-Type", "application/json");
    Serial.println(formattedDateTime);
    StaticJsonDocument<256> doc;
    doc["id_sensor"] = id_sensor;
    doc["value_humid"] = 0;
    doc["datetime"] = formattedDateTime;
    doc["value_temp"] = 0;
    Serial.print("humidity: ");
    Serial.println(humidity);
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

  void postCountPumpToAPI(const char* url, String formattedDateTime, const char* id_equipment, int count, int status) {
    WiFiClientSecure client;
    HTTPClient http;
    String api_url = "https://" + String(server_address) + url;

    http.begin(client, api_url);
    client.setInsecure();

    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<256> doc;
    doc["id_equipment"] = id_equipment;
    doc["values"] = count;
    doc["status"] = status;
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
  void getWhenStart(const char* url) {
    WiFiClientSecure client;
    HTTPClient http;

    String api_url = "https://" + String(server_address) + url;
    http.begin(client, api_url);
    client.setInsecure();
    int httpCode = http.GET();
    
    if (httpCode > 0) {
        String payload = http.getString();
        Serial.println(payload);
        StaticJsonDocument<1024> doc;
        DeserializationError error = deserializeJson(doc, payload);
        
        if (!error) {
            const char* id_esp = doc["id_esp"];
            if (strcmp(id_esp, id_sensor) == 0) {
                Serial.println("Correct ID");
                
                JsonObject equipmentsJson = doc["equipment"].as<JsonObject>();
                count = 0; // Reset count each time we fetch new data
                
                for (JsonPair kv : equipmentsJson) {
                    const char* key = kv.key().c_str(); // Get equipment ID key
                    JsonObject equipmentData = kv.value().as<JsonObject>();

                    equipmentIds[count] = strdup(key); // Store the equipment ID key
                    id_bcs[count] = strdup(equipmentData["id_bc"]); // Duplicate the string for safe storage
                    automodes[count] = equipmentData["automode"]; // Store integer values directly
                    expect_values[count] = equipmentData["expect_value"];
                    statuses[count] = equipmentData["status"];

                    Serial.print("Equipment ID: ");
                    Serial.println(equipmentIds[count]);
                    Serial.print("BC ID: ");
                    Serial.println(id_bcs[count]);
                    Serial.print("Automode: ");
                    Serial.println(automodes[count]);

                    count++;
                    if (count >= MAX_EQUIPMENTS) break; // Prevent overflow
                }
            } else {
                Serial.println("ID mismatch");
            }
        } else {
            Serial.println("JSON deserialization failed");
        }
    } else {
        Serial.print("GET request failed with error code: ");
        Serial.println(httpCode);
    }

    http.end();
  }
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
     // Biến lưu thời điểm tưới cây cuối cùng
    currentEpochTime = timeClient.getEpochTime(); // Lấy thời gian Epoch
    time_t epochTime = (time_t)currentEpochTime; // Chuyển đổi sang dạng time_t
    struct tm *currentTimeStruct = localtime(&epochTime); // Chuyển đổi sang cấu trúc tm

    // Lấy giờ, phút và giây từ cấu trúc tm
    hour = currentTimeStruct->tm_hour;
    minute = currentTimeStruct->tm_min;
    second = currentTimeStruct->tm_sec;
    totalSeconds = hour * 3600 + minute * 60 + second;
    
    // In ra giờ, phút và giây
    Serial.println("waterPlants RUN: ");Serial.flush();
    Serial.print("BÂY GIỜ LÀ : ");Serial.flush();
    Serial.print(hour);Serial.flush();
    Serial.print("Giờ: ");Serial.flush();
    Serial.print(minute);Serial.flush();
    Serial.print(" Phút: ");Serial.flush();
    Serial.print(second);Serial.flush();
    Serial.println(" Giây: ");Serial.flush();
    
    Serial.println("-----------------------------------------");
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
            Serial.println("-----------------------------------------");
        }
    }

    // Kiểm tra xem đã đủ thời gian để tắt bơm chưa
    if (isPumpActive && (totalSeconds - lastWateringTime >= 5000)) {
        controlPump(count, LOW); // Tắt bơm
        isPumpActive = false; // Đánh dấu rằng bơm đã được tắt
    }
  }


//region process
  void processAutoMode(int automode, int expect_value, int status, int count) {
    if (automode == 1) { // Chế độ tự động
        Serial.print("Chế độ tự động ");
        Serial.print("của thiết bị ");
        Serial.println(count);
        Serial.print("Đang bật");
        switch (count) {
            case 0:
                autoMode0 = 1;
                desiredHumidity0 = expect_value;
                autoControlMode(0, desiredHumidity0);
                break;
            case 1:
                autoMode1 = 1;
                desiredHumidity1 = expect_value;
                autoControlMode(1, desiredHumidity1);
                break;
            case 2:
                autoMode2 = 1;
                desiredHumidity2 = expect_value;
                autoControlMode(2, desiredHumidity2);
                break;
            default:
                // Serial.println("Số lượng không hợp lệ");
                break;
        }
    } else if (automode == 0) { // Chế độ thủ công
        Serial.print("Chế độ thủ công ");
        Serial.print("của thiết bị ");
        Serial.println(count);
        Serial.print("Đang bật");
        
        switch (count) {
            case 0:
                controlPump(0, status);
                desiredHumidity0 = expect_value;
                autoMode0 = 0;
                break;
            case 1:
                controlPump(1, status);
                desiredHumidity0 = expect_value;
                autoMode1 = 0;
                break;
            case 2:
                controlPump(2, status);
                desiredHumidity0 = expect_value;
                autoMode2 = 0;
                break;
            default:
                // Serial.println("Số lượng không hợp lệ");
                break;
        }
    } else if (automode == 2) { // Chế độ hẹn giờ
        Serial.print("Chế độ hẹn giờ ");
        Serial.print("của thiết bị ");
        Serial.println(count);
        switch (count) {
            case 0:
                autoMode0 = 2;
                desiredHumidity0 = expect_value;
                waterPlants(0);
                break;
            case 1:
                autoMode1 = 2;
                desiredHumidity1 = expect_value;
                waterPlants(1);
                break;
            case 2:
                autoMode2 = 2;
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
    Serial.println("Starting connection to WiFi");
    WiFi.begin("Basic Coffee", "");

    while (WiFi.status() != WL_CONNECTED) {
        delay(100);
        Serial.print(".");

        if (digitalRead(buttonAP) == LOW) {
            Serial.println("\nButton AP is pressed. Activating AP Mode...");
            activateAPMode(); // Gọi hàm kích hoạt AP Mode
            return;
        }

        if (digitalRead(buttonReset) == LOW) {
            Serial.println("\nButton Reset is pressed. Resetting ESP...");
            resetESP(); // Gọi hàm reset
            return;
        }
      }
    getWhenStart("/api/laststatus/esp0004");
    Serial.println("\nWiFi connection successful!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    }


  void activateAPMode() {
    Serial.println("Chuyển sang AP Mode.");
    WiFiManager wifiManager;

    // Xóa cài đặt cũ
    wifiManager.resetSettings();

    // Bắt đầu cổng cấu hình, "ESP8266_MODE_Access Point" là tên mạng WiFi cho AP Mode
    // Hàm startConfigPortal() sẽ tự động ngắt khi kết nối WiFi được cấu hình xong và kết nối
    if (wifiManager.startConfigPortal("ESP8266_MODE_Access Point")) {
      Serial.println("Kết nối được cấu hình xong và đã kết nối!");
    } else {
      Serial.println("Không kết nối được sau cấu hình.");
    }

    // Nếu bạn muốn tiếp tục chạy chương trình sau khi kết nối hoặc sau khi cấu hình thất bại, bạn có thể thực hiện các bước tiếp theo tại đây.
    Serial.println("Tiếp tục chạy chương trình...");
    }


  void resetESP() {
    Serial.println("Resetting ESP...");
    ESP.restart(); // Lệnh reset ESP8266
    }
  void reconnectSensor() {
    Serial.println("Attempting to reconnect sensor...");
    if (sht31.begin(0x44)) {
      Serial.println("Sensor reconnected successfully.");
      sensorConnected = true;
    } else {
      Serial.println("Reconnection failed. Retrying...");
      sensorConnected = false;
      delay(1000);
    }
    }
//region MQTTX POST
  void sendHelloMessage() {
    if (client.connected()) {
      // Tạo một bộ nhớ đệm để lưu trữ dữ liệu JSON
      StaticJsonDocument<1000> doc;


      // Thiết lập các giá trị trong JSON
      doc["id_esp"] = "ESP0001";

      doc["equipment"]["equipment0"];
      doc["equipment"]["equipment0"]["id_bc"] = "BC0001";
      doc["equipment"]["equipment0"]["automode"] = "2";
      doc["equipment"]["equipment0"]["expect_value"] = 85;
      doc["equipment"]["equipment0"]["status"] = 0;

      doc["equipment"]["equipment1"];
      doc["equipment"]["equipment1"]["id_bc"] = "BC0002";
      doc["equipment"]["equipment1"]["automode"] = "2";
      doc["equipment"]["equipment1"]["expect_value"] = 85;
      doc["equipment"]["equipment1"]["status"] = 1;
      

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
          Serial.println("Thành công khi gửi tin nhắn MQTT topic hello");Serial.flush();
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
      doc["id_esp"] = id_sensor;

      // Tạo một đối tượng lồng nhau cho "equipment"
      JsonObject equipmentObject = doc.createNestedObject("equipment");

      // Lặp qua mảng equipments và thêm từng thiết bị vào như một đối tượng lồng nhau
      for (size_t i = 0; i < num_equipments; i++) {
        // Tạo một đối tượng lồng nhau mới cho thiết bị hiện tại
        String equipmentName = "equipment" + String(i);
        JsonObject currentEquipment = equipmentObject.createNestedObject(equipmentName);

        // Thêm dữ liệu từ equipments[i] vào đối tượng thiết bị hiện tại
        currentEquipment["id_bc"] = equipments[i].id_bc;
        int autoMode;
        // Sử dụng mảng autoMode để thiết lập automode
        autoMode = (i == 0) ? autoMode0 : ((i == 1) ? autoMode1 : autoMode2);
        Serial.print("autoMode của thiết bị thứ ");Serial.flush();
        Serial.print(i);Serial.flush();
        Serial.print(" là: ");Serial.flush();
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
      Serial.println("Thành công khi gửi tin nhắn MQTT! ! ! !");
    } else {
      Serial.println("Không thể gửi tin nhắn MQTT!");Serial.flush();
    }
  } else {
    Serial.println("Không kết nối được với máy chủ MQTT!");Serial.flush();
  }
  }

//region MQTTX GET
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
    Serial.println("correct id");Serial.flush();
    // Lấy dữ liệu về thiết bị
    JsonObject equipments = doc["equipment"];
    count = 0;
    // Duyệt qua từng thiết bị
    for (JsonPair equipment : equipments) {
     
      equipmentIds[count] = equipment.key().c_str();
      // Serial.print("Equiment ID: ");
      // Serial.println(equimentId);
      
      // Truy cập thông tin của từng thiết bị
      JsonObject equipmentData = equipment.value();
      id_bcs[count] = equipmentData["id_bc"];
      automodes[count] = equipmentData["automode"];
      expect_values[count] = equipmentData["expect_value"];
      statuses[count] = equipmentData["status"];

      // Xử lý dữ liệu của thiết bị
      Serial.print("automode ");Serial.flush();
      Serial.println(count);Serial.flush();
      Serial.println("get ve la: ");
      Serial.flush();
      Serial.println(automodes[count]);
      Serial.flush();
      count++;
    }
  }
  }