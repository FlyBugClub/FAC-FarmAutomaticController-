
#include <Arduino.h>
#include <Wire.h>
#include "Adafruit_SHT31.h"

#include <PubSubClient.h>
#include <ArduinoJson.h>
// Thông tin về MQTT Broker
#define mqtt_server "broker.emqx.io"
const uint16_t mqtt_port = 1883; //Port của MQTT broker
#define mqtt_topic_temp "temperature"
#define mqtt_topic_humi "humidity"
PubSubClient client(espClient);
StaticJsonDocument<256> doc;

Adafruit_SHT31 sht31 = Adafruit_SHT31();

#include "secret_pass.h"

#define BLYNK_PRINT Serial

#include <ESP8266WiFi.h>
#include <BlynkSimpleEsp8266.h>

const int pumpPin = D6; // Chân kết nối của máy bơm với ESP8266

bool autoControl = true;
float desiredTemperature = 25.0;
float desiredHumidity = 60.0;

unsigned long lastSprayTime = 0;
unsigned long lastCheckTime = 0;

void setup() {
  pinMode(pumpPin, OUTPUT);
  Serial.begin(9600);
  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass);
   while (!Serial)
    delay(10);     // will pause Zero, Leonardo, etc until serial console opens

  Serial.println("SHT31 test");
  if (! sht31.begin(0x44)) {   // Set to 0x45 for alternate i2c addr
    Serial.println("Couldn't find SHT31");
    while (1) delay(1);
  }

  Serial.print("Heater Enabled State: ");
  if (sht31.isHeaterEnabled())
    Serial.println("ENABLED");
  else
    Serial.println("DISABLED");
    // Đọc giá trị từ chân V6 khi chương trình chạy lần đầu
  Blynk.syncVirtual(V6);
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  reconnect();
}

void autoControlMode(float& temperature, float& humidity) {
  float t = sht31.readTemperature();
  float currentHumidity = sht31.readHumidity();

  unsigned long currentMillis = millis();
  
  if ( currentHumidity < humidity) {
    if (currentMillis - lastSprayTime >= 10000) {
      digitalWrite(pumpPin, HIGH);
      Blynk.setProperty(V3, "color", "#2EA5D8");
      Blynk.virtualWrite(V3, 1); 
      lastSprayTime = currentMillis; 
      delay(2000);
      digitalWrite(pumpPin, LOW);
      Blynk.setProperty(V3, "color", "#FF0000" );
      Blynk.virtualWrite(V3, 0); 
    }
  } else {
    digitalWrite(pumpPin, LOW);
    Blynk.setProperty(V3, "color", "#FF0000" );
    Blynk.virtualWrite(V3, 0); 
  }
}

void loop() {
  Blynk.run();
  Blynk.setProperty(V3, "label", "Máy bơm");
  Blynk.setProperty(V1, "color", autoControl ? "#2EA5D8" : "#FF0000");
  Blynk.setProperty(V2, "color", autoControl ? "#2EA5D8" : "#FF0000");
  Blynk.setProperty(V4, "color", autoControl ? "#2EA5D8" : "#FF0000");
  Blynk.setProperty(V5, "color", autoControl ? "#2EA5D8" : "#FF0000");
  Blynk.setProperty(V6, "color", autoControl ? "#2EA5D8" : "#FF0000");
  Serial.println("desiredhumidity");
  Serial.println(desiredHumidity);
  if (!client.connected()) {
    reconnect();
  }
  
  client.loop();
  if (!autoControl) {
    BLYNK_WRITE(V3);
  }

  if (autoControl) {
    autoControlMode(desiredTemperature, desiredHumidity);
  }

  float temperature = sht31.readTemperature();
  float humidity = sht31.readHumidity();


  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.print("% - Temperature: ");
  Serial.print(temperature);
  Serial.println("°C");

  Blynk.virtualWrite(V1, temperature); // Gửi dữ liệu nhiệt độ đến ứng dụng Blynk
  Blynk.virtualWrite(V2, humidity); // Gửi dữ liệu độ ẩm đến ứng dụng Blynk

  delay(2000); // Đợi 2 giây trước khi đọc lại dữ liệu từ cảm biến
}

BLYNK_WRITE(V4) {
  autoControl = param.asInt();
}

BLYNK_WRITE(V3) {
  if (!autoControl) {
    int pumpState = param.asInt();
    digitalWrite(pumpPin, pumpState);
    Blynk.setProperty(V3, "color", pumpState == 1 ? "#00FF00" : "#FF0000");
    float temperature = sht31.readTemperature();
    float humidity = sht31.readHumidity();
    Blynk.virtualWrite(V1, temperature);
    Blynk.virtualWrite(V2, humidity);
    
  }
}

BLYNK_WRITE(V5) {
  desiredTemperature = param.asFloat();
}

BLYNK_WRITE(V6) {
  desiredHumidity = param.asFloat();
}
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.println(topic);
  String checkLed;
if(String(topic) == mqtt_topic_humi){
  // Parse the JSON message
  StaticJsonDocument<200> jsonDocument;
  deserializeJson(jsonDocument, payload, length);
  const String ledStatus = jsonDocument["statusLed"];
  checkLed = ledStatus;
  Serial.println("Message received: ");
  Serial.print("StatusLed: ");
  Serial.println(ledStatus);
  
   if (ledStatus == "on") {
    digitalWrite(led, HIGH);
  } else if (ledStatus == "off")  {
    digitalWrite(led, LOW);
  }
}

if(String(topic) == mqtt_topic_temp){
  // Parse the JSON message
  StaticJsonDocument<200> jsonDocument;
  deserializeJson(jsonDocument, payload, length);
  int gasStatus = jsonDocument["statusGas"];
  Serial.println("Message received: ");
  Serial.print("statusGas: ");
  Serial.println(gasStatus);
  
   if (gasStatus > 320) {
    digitalWrite(led, LOW);
  } else if (gasStatus < 320 && checkLed == "on") {
    digitalWrite(led, HIGH);
  }
  else if(gasStatus < 320 && checkLed == "off"){
    digitalWrite(led, LOW);
  }
}
}
void publishLedData(String ledStatus ) {
  char buffer[256];
  size_t n = serializeJson(doc, buffer);
  
 
  doc["statusLed"] = ledStatus;
  
  n = serializeJson(doc, buffer);
  client.publish(mqtt_topic_led, buffer, n);
  
}
void publishGasData(int gasStatus) {
  char buffer[256];
  size_t n = serializeJson(doc, buffer);
  
  
  doc["statusGas"] = gasStatus;
  
  n = serializeJson(doc, buffer);
  client.publish(mqtt_topic_gas, buffer, n);
  
}
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("helloem")) {
      // Đăng kí nhận gói tin tại topic wemos/ledstatus
      client.subscribe(mqtt_topic_humi);
      client.subscribe(mqtt_topic_temp);
      
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}
