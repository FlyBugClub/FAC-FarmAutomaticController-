#include "PumpController.h"
#include <ArduinoJson.h>
PumpController::PumpController() {
  if (!sht31_1.begin(0x44)) {
    Serial.println("Couldn't find SHT31 sensor 1!");
  } else {
    Serial.println("SHT31 sensor 1 initialized successfully!");
  }

  if (!sht31_2.begin(0x45)) {
    Serial.println("Couldn't find SHT31 sensor 2!");
  } else {
    Serial.println("SHT31 sensor 2 initialized successfully!");
  }

  if (!sht31_3.begin(0x46)) {
    Serial.println("Couldn't find SHT31 sensor 3!");
  } else {
    Serial.println("SHT31 sensor 3 initialized successfully!");
  }

  if (!sht31_4.begin(0x47)) {
    Serial.println("Couldn't find SHT31 sensor 4!");
  } else {
    Serial.println("SHT31 sensor 4 initialized successfully!");
  }
}
char* PumpController::handleNewMessages(String currentAction, String currentMessage, int currentIndex, const char* payload_sum) {
  StaticJsonDocument<2048> doc;  // Dung lượng tối đa cho bộ nhớ tạm thời
  DeserializationError error = deserializeJson(doc, payload_sum);

  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.c_str());
    return nullptr;
  }

  // Lặp qua từng phần tử trong payload_sum
  bool updated = false;
  for (JsonObject pump : doc.as<JsonArray>()) {
    int index = pump["index"];
    if (index == currentIndex) {
      // Cập nhật action
      pump["payload"]["action"] = currentAction;
      pump["payload"]["messages"] = currentMessage;
      pump["payload"]["status"] = pumpState[index - 1];
      Serial.println(currentMessage);
      updated = true;
      break;
    }
  }

  if (!updated) {
    Serial.println(F("No matching index found in payload_sum."));
    return nullptr;
  }

  // Chuyển đổi doc trở lại thành chuỗi JSON
  static char updated_payload_sum[2048];  // Dung lượng tối đa cho bộ nhớ tạm thời
  serializeJson(doc, updated_payload_sum, sizeof(updated_payload_sum));


  return updated_payload_sum;
}

void PumpController::processPumpAction(const char* payload_sum, const int pumpPins[], int numPumps, unsigned long currentSeconds) {
  StaticJsonDocument<512> doc;
  DeserializationError error = deserializeJson(doc, payload_sum);

  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }

  for (JsonObject pump : doc.as<JsonArray>()) {
    int index = pump["index"];
    String action = pump["payload"]["action"].as<String>();
    String message = pump["payload"]["messages"].as<String>();

    if (index > 0 && index <= numPumps) {
      int pumpPin = pumpPins[index - 1];

      if (action == "manual") {
        if (message == "on") {
          digitalWrite(pumpPin, HIGH);
          pumpState[index - 1] = true;
          // Serial.println("index");
          // Serial.println(index);
          // Serial.println("on");
        } else if (message == "off") {
          digitalWrite(pumpPin, LOW);
          pumpState[index - 1] = false;
        } else {
        }
      }

      else if (action == "auto") {
        // Chọn cảm biến SHT31 tương ứng với máy bơm index
        Adafruit_SHT31& sht31 = getSHT31Sensor(index);
        char msg[message.length() + 1];
        message.toCharArray(msg, sizeof(msg));
        // Serial.println(msg);

        char* token = strtok(msg, " ");
        int threshold = atoi(token);
        char* status = strtok(NULL, " ");
        String statusStr = String(status);
        // float humidity = sht31.readHumidity();
        float humidity = 0;
        // float humidity = 30; // Giả lập độ ẩm, bạn cần thay thế bằng đọc từ cảm biến thực tế
        if (statusStr == "on") {
          if (humidity < threshold) {
            digitalWrite(pumpPin, HIGH);
            pumpState[index - 1] = true;
            // Serial.print("Pump ");
            // Serial.print(index);
            // Serial.println(" turned on (auto)");
          } else {
            digitalWrite(pumpPin, LOW);
            pumpState[index - 1] = false;
            // Serial.print("Pump ");
            // Serial.print(index);
            // Serial.println(" turned off (auto)");
          }
        } else {
          digitalWrite(pumpPin, LOW);
          pumpState[index - 1] = false;
          // Serial.print("Pump ");
          // Serial.print(index);
          // Serial.println(" turned off (auto)");
        }
      }

      // Xử lý hành động theo lịch trình
      else if (action == "schedule") {
        // Tách message thành từng thời điểm riêng biệt
        char msg[message.length() + 1];
        message.toCharArray(msg, sizeof(msg));

        char* token = strtok(msg, " ");
        int numTimes = atoi(token);

        if (numTimes == 0) {
          // Tắt bơm nếu không có thời gian nào được cung cấp
          digitalWrite(pumpPin, LOW);  // Giả sử LOW là trạng thái tắt bơm
          pumpState[index - 1] = false;
          // Serial.println("Pump turned off due to no schedule times.");
        } else {
          // Nếu có thời gian, tiếp tục xử lý như bình thường
          String times[numTimes];
          int count = 0;
          int wateringTimeSeconds = atoi(strtok(NULL, " "));
          token = strtok(NULL, " ");
          while (token != NULL && count < numTimes) {
            times[count++] = String(token);
            token = strtok(NULL, " ");
          }
          handleScheduleTimes(pumpPin, index, times, numTimes, currentSeconds, wateringTimeSeconds);
        }
      } else {
        Serial.print("Invalid action '");
        Serial.print(action);
        Serial.println("' for pump action");
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


void PumpController::handleScheduleTimes(int pumpPin, int index, String times[], int numTimes, unsigned long currentSeconds, int wateringTimeSeconds) {
  // Calculate current millis

  unsigned long currentMillis = currentSeconds * 1000;
  // Calculate millis watering time
  unsigned long wateringTimeMillis = wateringTimeSeconds * 1000;  // Convert seconds to millis
  for (int i = 0; i < numTimes; ++i) {
    int hours, minutes;
    sscanf(times[i].c_str(), "%d:%d", &hours, &minutes);

    unsigned long scheduleSeconds = hours * 3600 + minutes * 60;
    unsigned long scheduleMillis = scheduleSeconds * 1000;

    // Calculate end watering time in millis
    unsigned long endWateringTime = scheduleMillis + wateringTimeMillis;
    unsigned long endWateringTimeSeconds = endWateringTime / 1000;

    // Serial.print("currentMillis Time Seconds: ");
    // Serial.println(currentMillis);
    // Serial.print("scheduleMillis Seconds    : ");
    // Serial.println(scheduleMillis);
    // Serial.print("End Watering Time         : ");
    // Serial.println(endWateringTime);

    // Check if current time is within the watering window
    if (currentMillis == scheduleMillis) {
      digitalWrite(pumpPin, HIGH);
      lastWateringTime[index - 1] = currentMillis;
      pumpState[index - 1] = true;
    }
    if (currentMillis - lastWateringTime[index - 1] == wateringTimeMillis) {
      digitalWrite(pumpPin, LOW);
      pumpState[index - 1] = false;
    }
    if (pumpState[index - 1] != prevPumpState[index - 1]) {
      Serial.println(pumpState[index - 1]);
      isPumpStateChange[index - 1] = true;
    } else {
      isPumpStateChange[index - 1] = false;
      Serial.println(pumpState[index - 1]);
    }
  }
}


Adafruit_SHT31& PumpController::getSHT31Sensor(int index) {
  // Trả về cảm biến SHT31 tương ứng với index máy bơm
  switch (index) {
    case 1:
      return sht31_1;
    case 2:
      return sht31_2;
    case 3:
      return sht31_3;
    case 4:
      return sht31_4;
    default:
      // Nếu index không hợp lệ, bạn có thể trả về một trong các đối tượng sht31_1, sht31_2, sht31_3 hoặc sht31_4 mặc định
      return sht31_1;  // Ví dụ trả về sht31_1 cho các trường hợp khác
  }
}