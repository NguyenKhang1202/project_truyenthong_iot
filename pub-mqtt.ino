#include <WiFi.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <Servo.h>
#include "RTClib.h"
#include "esp32_secrets.h"
#include <String.h>
#include "HX711.h"
#include <iostream>
#include <vector>

WiFiClient wifiClient;
PubSubClient client(wifiClient);

RTC_DS3231 rtc;
Servo myservo1; 

const char* ssid = SECRET_SSID;
const char* password =  SECRET_PASS;

#define MQTT_SERVER "broker.hivemq.com"
#define MQTT_PORT 1883
#define MQTT_USER "mqttbroker"
#define MQTT_PASSWORD "12345678"
#define MQTT_SCHEDULE_TOPIC "/command/2"
#define MQTT_COMPLETE_TOPIC "/history"

const int Led = 2;
#define BUZZER_PIN 25

// servo_1 : đóng mở nắp, servo_2 : trộn thức ăn
const char* devide_ID = DEVIDE_ID;

int servo1_pin = 27;

// setup schedule
unsigned long int time_hour;
unsigned long int time_min;
std::vector<int> TimeHour;
std::vector<int> TimeMin;
std::vector<int> WeightSchedule;

HX711 scale;

//task_1 : "cho an thu cong";
//task_2 : "cho an tu dong";
//task_3 : "hen gio cho an";

boolean isFeed = false;
boolean isDone = false;
boolean isTask1 = false;
boolean isTask2 = false;
boolean isTask3 = false;

const int LOADCELL_DOUT_PIN = 23;
const int LOADCELL_SCK_PIN = 18;

const int PIN_TO_SENSOR = 35; // GIOP19 pin connected to OUTPUT pin of sensor
int pinStateCurrent = LOW;    // current state of pin
int pinStatePrevious = LOW;   // previous state of pin
boolean motionCheck = false;

int weight_static = 0;
int weight_tmp = 0;

DynamicJsonDocument mess_publish(200);
StaticJsonDocument<200> mess_subcribe;

void setup_hx711()
{
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  Serial.println("Before setting up the scale:");
  Serial.print("read: \t\t");
  Serial.println(scale.read()); // print a raw reading from the ADC
  scale.set_scale(1901.f);
  scale.tare();
}

void setup_wifi() {
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  randomSeed(micros());
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}
void connect_to_broker() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "nodeWiFi32";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str(), MQTT_USER, MQTT_PASSWORD)) {
      Serial.println("connected");
      client.subscribe(MQTT_SCHEDULE_TOPIC);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 2 seconds");
      delay(2000);
    }
  }
}


void callback(char* topic, byte *payload, unsigned int length) {
  Serial.println("-------new message from broker-----");
  Serial.print("topic: ");
  Serial.println(topic);
  Serial.print("message: ");
  Serial.println();
  char *messageTemp;
  messageTemp = (char*)malloc((length+1)*sizeof(char));
  memset(messageTemp,0,length+1);
   for (int i = 0; i < length; i++) {
    messageTemp[i] = (char)payload[i];
  }
  Serial.println(messageTemp);
    // chuyển mess từ char[] sang đối tượng json 
  
  deserializeJson(mess_subcribe, messageTemp);
  
    // ----- so sánh 2 id, nếu đúng thì tiếp tục -----
  if(strcmp(devide_ID, mess_subcribe["DevideID"]) == 0){
  //Xử lí task2
    if (strcmp(mess_subcribe["Task"], "2") == 0)
    {
      double tmp = scale.get_units(10);
      weight_tmp = mess_subcribe["Weight"];
      weight_tmp += tmp;
      weight_static = mess_subcribe["Weight"];
      isTask2 = true;
      isTask3 = false;
      isTask1 = false;
    }
    else if (strcmp(mess_subcribe["Task"], "3") == 0)//Xử lí task 3
    {
      TimeHour.clear();
      TimeMin.clear();
      WeightSchedule.clear();
      isTask3 = true;
      isTask2 = false;
      // isTask1 = false;
      //    date_time_seconds += 25170;
      int lengthSchedule = mess_subcribe["TimeSchedule"].size();
      Serial.printf("size map: %d \n", lengthSchedule);
      for (int i = 0; i < lengthSchedule; i++)
      {
        time_hour = mess_subcribe["TimeSchedule"][i][0];
        time_min = mess_subcribe["TimeSchedule"][i][1];
        int weightjson = mess_subcribe["Weight"][i];
        TimeHour.push_back(time_hour);
        TimeMin.push_back(time_min);
        WeightSchedule.push_back(weightjson);
      }
      for (int i = 0; i < lengthSchedule; i++)
      {
        Serial.printf("%d", TimeHour[i]);
        Serial.print(": ");
        Serial.print(TimeMin[i]);
        Serial.println();
      }
      Serial.print("test: ");
      Serial.println(time_min);
      Serial.println("w1: ");
      Serial.println(weight_tmp);
    }
    else if (strcmp(mess_subcribe["Task"], "1") == 0)//Xử lí task1
    {
      double tmp = scale.get_units(10);
      weight_tmp = mess_subcribe["Weight"];
      weight_tmp += tmp;
      weight_static = mess_subcribe["Weight"];
      isTask1 = true;
      Serial.println("w1: ");
      Serial.println(weight_tmp);
    }
    else
    {
      Serial.println("Invalid task.");
    }
  }
}

boolean findSchedule(double hour, double min)
{
  int size = TimeHour.size();
  for (int i = 0; i < size; i++)
  {
    if (TimeHour[i] == hour && TimeMin[i] == min)
    {
      double tmp = scale.get_units(10);
      weight_tmp = WeightSchedule[i];
      weight_tmp += tmp;
      weight_static = WeightSchedule[i];
      Serial.println("hi schedule");
      return true;
    }
  }
  return false;
}

void setup() {
  myservo1.attach(servo1_pin);
  Serial.begin(115200);
  setup_wifi();
  client.setServer(MQTT_SERVER, MQTT_PORT);
  client.setCallback(callback);
  connect_to_broker();

  // setup sr501
  pinMode(PIN_TO_SENSOR, INPUT);
  pinMode(Led, OUTPUT);
  digitalWrite(Led, LOW);
  // end setup sr501
  // buzzer
  pinMode(BUZZER_PIN, OUTPUT);
  // endbuzzer
  setup_hx711();
  
  while (!Serial) continue;
  if (!rtc.begin()) {
    Serial.println("Couldn't find RTC");
    Serial.flush();
    while (1) delay(10);
  }
  if (rtc.lostPower()) {
    Serial.println("RTC lost power, lets set the time!");
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
    // rtc.adjust(DateTime(2014, 1, 21, 3, 0, 0));
  }
  mess_publish["DevideID"] = devide_ID;
}
int current_weight=0;

void Feeding()
{
  // lượng thức ăn hiện tại có trong bát
  // current_weight=scale.get_units(10);
  if (current_weight < weight_tmp)
  {
    myservo1.write(90);
     double weight = scale.get_units(10);
   // double weight = 10;
    Serial.print("weight: ");
    Serial.println(weight);
    current_weight = weight;
    Serial.print("curr weight: ");
    Serial.println(current_weight);
    delay(100);
  }
  else
  {
    delay(100);
    myservo1.write(0);
    isFeed = false;
    isDone = true;
    Serial.println("Done");
  }
}

void notify()
{
  for (int i = 0; i < 3; i++)
  {
    digitalWrite(BUZZER_PIN, HIGH); // turn on
    delay(1000);
    digitalWrite(BUZZER_PIN, LOW); // turn off
    delay(1000);
  }
}

void Publish()
{
  DateTime now = rtc.now();
  delay(1000);
  JsonArray Datetime = mess_publish.createNestedArray("Datetime");
  Datetime.add(now.month());
  Datetime.add(now.day());
  Datetime.add(now.hour());
  Datetime.add(now.minute());
  char buffer[256];
  mess_publish["Weight"] = weight_static;
  serializeJson(mess_publish, buffer);
  client.publish(MQTT_COMPLETE_TOPIC, buffer);

  // weight_tmp = 0;
  // test
 // current_weight = 0;
  // end test
  isDone = false;
  Serial.println("published");

  delay(500);
}

void loop() {
  //nhận message
  client.loop();
  //kết nối broker
  if (!client.connected())
  {
    connect_to_broker();
  }
  //trạng thái của cảm biến chuyển động
  pinStatePrevious = pinStateCurrent;           // store old state
  pinStateCurrent = digitalRead(PIN_TO_SENSOR); // read new state
  //Lấy thời gian của cảm biến thời gian thực
  DateTime now = rtc.now();

  Serial.print("check: ");
  Serial.print(now.hour());
  Serial.print("/");
  Serial.println(now.minute());
  double nowHour = now.hour();
  double nowMin = now.minute();
  delay(1000);
  // hàm xử lý cho ăn thủ công
  if (isTask1 == true && isFeed == false)
  {
    isFeed = true;

  }
  else if (isTask2 == true)//Xử lí cho ăn tự động
  {
    //Phát hiện chuyển động
    if (pinStatePrevious == LOW && pinStateCurrent == HIGH)
    { // pin state change: LOW -> HIGH
      Serial.println("Motion detected!");
      digitalWrite(Led, HIGH);
      motionCheck = true;
      delay(1000);
      // TODO: turn on alarm, light or activate a device ... here
    }
    else if (pinStatePrevious == HIGH && pinStateCurrent == LOW)
    { // pin state change: HIGH -> LOW
      Serial.println("Motion stopped!");
      digitalWrite(Led, LOW);
      delay(1000);
      // TODO: turn off alarm, light or deactivate a device ... here
    }
      double weight = scale.get_units(10);
    //Cho ăn khi phát hiện vật nuôi tới và lượng thức ăn gần hết
    if (motionCheck == true && weight < 10)
    {
      double tmp = scale.get_units(10);
      weight_tmp = mess_subcribe["Weight"];
      weight_tmp += tmp;
      weight_static = mess_subcribe["Weight"];
      isFeed = true;
    }
  }
  //Xử lí cho ăn theo lịch
  else if (findSchedule(nowHour, nowMin) && isTask3 == true && isTask2 == false && isFeed == false)
  {
    isFeed = true;
  }

  if (isFeed == true)
  {
    Feeding();
  }
  
  if (isDone == true)
  {
    if (isTask1 == true)
    {
      Publish();
      isTask1 = false;
      Serial.println("Hi task 1");
    }
    else if (isTask2 == true)
    {
      Publish();
      isTask2 = true;
      motionCheck = false;
      Serial.println("Hi task 2");
    }
    else if (isTask3 == true)
    {
      Publish();
      isTask3 = true;
      Serial.println("Hi task 3");
      delay(50000);
    }
  }
}
