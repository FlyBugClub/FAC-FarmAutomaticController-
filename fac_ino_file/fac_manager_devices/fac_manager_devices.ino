#include <Arduino.h>
#include "my_module.h"

void setup() {
  Serial.begin(9600);

  myFunction();

  int result = add(5, 3);
  Serial.println(result);
}

void loop() {
}