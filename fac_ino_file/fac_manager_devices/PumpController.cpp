#include "PumpController.h"
#include <ArduinoJson.h>

PumpController::PumpController() {
  if (!sht31.begin(0x44)) {    
    Serial.println("Couldn't find SHT31 sensor!");
  } else {
    Serial.println("SHT31 sensor initialized successfully!");
  }
}

char* PumpController::handleNewMessages(String currentAction, String currentMessage, int currentIndex, const char* payload_sum) {
  StaticJsonDocument<512> doc;
  DeserializationError error = deserializeJson(doc, payload_sum);

  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return nullptr;
  }

  // Lặp qua từng phần tử trong payload_sum
  for (JsonObject pump : doc.as<JsonArray>()) {
    int index = pump["index"];
    if (index == currentIndex) {
      // Cập nhật action và message tương ứng
      pump["payload"]["action"] = currentAction;
      pump["payload"]["messages"] = currentMessage;
    }
  }
  // Chuyển đổi doc trở lại thành chuỗi JSON
  static char updated_payload_sum[512];
  serializeJson(doc, updated_payload_sum, sizeof(updated_payload_sum));

  return updated_payload_sum;
}


void PumpController::processPumpAction(const char* payload_sum,const int pumpPins[], int numPumps) {
  StaticJsonDocument<512> doc;
  DeserializationError error = deserializeJson(doc, payload_sum);

  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }

  // Lặp qua từng phần tử trong payload_sum
  for (JsonObject pump : doc.as<JsonArray>()) {
    int index = pump["index"];
    String action = pump["payload"]["action"].as<String>();
    String message = pump["payload"]["messages"].as<String>();

    // Tìm chân điều khiển tương ứng với máy bơm index
    if (index > 0 && index <= numPumps) {
      int pumpPin = pumpPins[index - 1];  // Chọn chân điều khiển máy bơm

      // Xử lý hành động manual
      if (action == "manual") {
        if (message == "on") {
          digitalWrite(pumpPin, HIGH);
          // Serial.print("Pump ");
          // Serial.print(index);
          // Serial.println(" turned on (manual)");
        } else if (message == "off") {
          digitalWrite(pumpPin, LOW);
          // Serial.print("Pump ");
          // Serial.print(index);
          // Serial.println(" turned off (manual)");
        } else {
          // Serial.print("Invalid message '");
          // Serial.print(message);
          // Serial.println("' for manual action");
        }
      }

      // Xử lý hành động auto
      else if (action == "auto") {
        int threshold = message.toInt();  // Chuyển đổi ngưỡng từ chuỗi sang số nguyên

        // float humidity = sensor.readHumidity();
        float humidity = 30; // Giả lập độ ẩm, bạn cần thay thế bằng đọc từ cảm biến thực tế
        if (humidity < threshold) {
          digitalWrite(pumpPin, HIGH);
          Serial.print("Pump ");
          Serial.print(index);
          Serial.println(" turned on (auto)");
        } else {
          digitalWrite(pumpPin, LOW);
          Serial.print("Pump ");
          Serial.print(index);
          Serial.println(" turned off (auto)");
        }
      }

      // Xử lý hành động theo lịch trình
      else if (action == "schedule") {
        if (message == "morning") {
          digitalWrite(pumpPin, HIGH);  // Bật bơm vào buổi sáng
          Serial.print("Pump ");
          Serial.print(index);
          Serial.println(" turned on (morning schedule)");
        } else if (message == "evening") {
          digitalWrite(pumpPin, LOW);  // Tắt bơm vào buổi tối
          Serial.print("Pump ");
          Serial.print(index);
          Serial.println(" turned off (evening schedule)");
        } else {
          Serial.print("Invalid message '");
          Serial.print(message);
          Serial.println("' for schedule action");
        }
      }

      // Xử lý các hành động khác
      else {
        Serial.print("Invalid action '");
        Serial.print(action);
        Serial.println("'");
      }
    }
  }
}
