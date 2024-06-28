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
  StaticJsonDocument<1024> doc;  // Dung lượng tối đa cho bộ nhớ tạm thời
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
  static char updated_payload_sum[1024];  // Dung lượng tối đa cho bộ nhớ tạm thời
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

  // Lặp qua từng phần tử trong payload_sum
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

        int threshold = message.toInt();  // Chuyển đổi ngưỡng từ chuỗi sang số nguyên

        float humidity = sht31.readHumidity();
        // float humidity = 30; // Giả lập độ ẩm, bạn cần thay thế bằng đọc từ cảm biến thực tế
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
      }

      // Xử lý hành động theo lịch trình
      else if (action == "schedule") {
        // Tách message thành từng thời điểm riêng biệt
        char msg[message.length() + 1];
        message.toCharArray(msg, sizeof(msg));
        char* token = strtok(msg, " ");
        int numTimes = atoi(token);  // Số lượng thời điểm tưới nước
        if (numTimes <= 0) {
          Serial.println("Invalid schedule message format: missing number of times");
          continue;
        }

        // Xử lý từng thời điểm trong message
        String times[numTimes];  
        int count = 0;
        while (token != NULL && count < numTimes + 1) {  // +1 để bỏ qua số lượng thời điểm đầu tiên
          token = strtok(NULL, " ");
          if (token != NULL) {
            times[count++] = String(token);
          }
        }

        // Xử lý từng thời điểm trong times[]
        handleScheduleTimes(pumpPin, index, times, numTimes, currentSeconds);
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


void PumpController::handleScheduleTimes(int pumpPin, int index, String times[], int numTimes, unsigned long currentSeconds ) {


  bool pumpOn = false;
  for (int i = 0; i < numTimes; ++i) {
    int hours, minutes;
    sscanf(times[i].c_str(), "%d:%d", &hours, &minutes);
    unsigned long scheduleSeconds = hours * 3600 + minutes * 60;
    unsigned long wateringTime = 3;
    // Tính toán thời điểm kết thúc bơm nước
    unsigned long endWateringTime = scheduleSeconds + wateringTime;

    // Kiểm tra xem thời gian hiện tại có nằm trong khoảng thời gian bơm không
    if (currentSeconds >= scheduleSeconds && currentSeconds <= endWateringTime) {
      pumpOn = true;
      break;
    }else{
      pumpOn = false;
    }
  }

  if (pumpOn) {
    digitalWrite(pumpPin, HIGH);  // Bật bơm
    pumpState[index - 1] = true;
    // Serial.print("Pump ");
    // Serial.print(index);
    Serial.println(" turned on (schedule)");
  } else {
    digitalWrite(pumpPin, LOW);  // Tắt bơm
    pumpState[index - 1] = false;
    // Serial.print("Pump ");
    // Serial.print(index);
    // Serial.println(" turned off (schedule)");
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