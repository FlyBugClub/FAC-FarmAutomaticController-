#include "my_module.h"
#include <Arduino.h>

void myFunction() {
  Serial.println("Hello from myFunction!");
}

int add(int a, int b) {
  return a + b;
}