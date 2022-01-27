#include <WiFi.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <Servo.h>
#include "RTClib.h"
#include "esp32_secrets.h"
#include <String.h>

WiFiClient wifiClient;
PubSubClient client(wifiClient);

RTC_DS3231 rtc;
Servo myservo1; 
//Servo myservo2; 

const char* ssid = SECRET_SSID;
const char* password =  SECRET_PASS;

#define MQTT_SERVER "broker.hivemq.com"
#define MQTT_PORT 1883
#define MQTT_USER "mqttbroker"
#define MQTT_PASSWORD "12345678"
#define MQTT_LED_TOPIC "nodeWiFi32/led"
#define MQTT_SCHEDULE_TOPIC "nodeWiFi32/schedule"
#define MQTT_COMPLETE_TOPIC "nodeWiFi32/complete"

// servo_1 : đóng mở nắp, servo_2 : trộn thức ăn
const char* devide_ID = DEVIDE_ID;
//const char* sensor_servo_1 = SERVO_1_ID;
//const char* sensor_servo_2 = SERVO_2_ID;
//const char* ds3231 = DS3231_ID;
int servo1_pin = 27;
//int servo2_pin = SERVO_2_PIN;

//task_1 : "cho an thu cong";
//task_2 : "cho an tu dong";
//task_3 : "hen gio cho an";

boolean isAuto = false;
boolean isFeed = false;
boolean isDone = false;
boolean isTask1 = false;
boolean isTask2 = false;
boolean isTask3 = false;

// weight_static : là lượng khi cho ăn tự động 
// weight_tmp : lượng cho ăn thủ công 
// weight_schedule : lượng hẹn giờ

int weight_static = 0;
int weight_tmp = 0;
int weight_schedule = 0;
int time_hour = 0;
int time_min = 0;
int time_day = 0;
int time_month = 0;

int time_schedule_hour = 0;
int time_schedule_min = 0;
int time_schedule_day = 0;
int time_schedule_month = 0;

DynamicJsonDocument mess_publish(200);
StaticJsonDocument<200> mess_subcribe;

  // trộn thức ăn
//void rotate(){
//  int current_time = millis();
//  if(millis()< current_time + 10000){
//    for(int pos = 0; pos <= 180; pos += 1) { 
//      myservo1.write(pos);              
//      delay(10);                       
//    }
//    for(int pos = 180; pos >= 0; pos -= 1) { 
//      myservo1.write(pos);              
//      delay(10);                       
//    }
//  }
//}
//
// mở nắp 
void onServo() {
  delay(15);
  for(int pos = 0; pos <= 90; pos += 1) { 
    myservo1.write(pos);              
    delay(10);                       
  }
}
// đóng nắp
void offServo() {
  delay(15);
  for(int pos = 90; pos >= 0; pos -= 1) { 
    myservo1.write(pos);              
    delay(10);                       
  }
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
  time_month = mess_subcribe["DateTime"][0];
  time_day = mess_subcribe["DateTime"][1];
  time_hour = mess_subcribe["DateTime"][2];
  time_min = mess_subcribe["DateTime"][3];
  
    // ----- so sánh 2 id, nếu đúng thì tiếp tục -----
  if(strcmp(devide_ID, mess_subcribe["DevideID"]) == 0){

    // nếu vào task1 : cho ăn thủ công 
    if(strcmp(mess_subcribe["Task"],"1") == 0){
      isTask1 = true;
      weight_tmp = mess_subcribe["Weight"];
      Serial.print("weight_tmp : ");
      Serial.println(weight_tmp);
      Serial.println("Vao Task 1 : cho an thu cong");
    } 
    // nếu vào task2 : cho ăn tự động 
    else if(strcmp(mess_subcribe["Task"],"2") == 0){
      if(strcmp(mess_subcribe["isAuto"],"1") == 0){
        isTask2 = true;
        weight_static = mess_subcribe["Weight"];
      }else {
        isTask2 = false;
      }
      Serial.println("Vao Task 2 : cho an tu dong");
    } 
    // nếu vào task3 : đặt lịch  
    else if(strcmp(mess_subcribe["Task"],"3") == 0){
      isTask3 = true;
      weight_schedule = mess_subcribe["Weight"];
      Serial.print("weight_schedule : ");
      Serial.println(weight_schedule);
      time_schedule_month = mess_subcribe["TimeSchedule"][0];
      time_schedule_day = mess_subcribe["TimeSchedule"][1];
      time_schedule_hour = mess_subcribe["TimeSchedule"][2];
      time_schedule_min = mess_subcribe["TimeSchedule"][3];
      Serial.println("Vao Task 3 : dat lich cho an");
    } else {
      Serial.println("Invalid task.");
    }
  }
}

void setup() {
  myservo1.attach(27);
//  myservo2.attach(servo2_pin);
  myservo1.write(0);  
  Serial.begin(115200);
  setup_wifi();
  client.setServer(MQTT_SERVER, MQTT_PORT);
  client.setCallback(callback);
  connect_to_broker();
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

//void Feeding(){
//    if(current_weight < weight_tmp){
//     myservo1.write(180);  
//      //double weight = scale.get_units(10);
//     double weight = 10;
//     Serial.print("weight: ");
//     Serial.println(weight);
//     current_weight+= weight;
//     Serial.print("curr weight: ");
//     Serial.println(current_weight);
//    delay(100);
//    }else{
//     //current_weight = 0;
//     myservo1.write(0);
//     isFeed=false;
//     isDone=true;
//     Serial.println("Done");
//     delay(1000);
//    } 
//}


void loop() {
  client.loop();
  if (!client.connected()) {
    connect_to_broker();
  }
  DateTime now = rtc.now();

  // in giờ phút giây để dễ theo dõi
    Serial.print(now.hour(), DEC);
    Serial.print(':');
    Serial.print(now.minute(), DEC);
    Serial.print(':');
    Serial.print(now.second(), DEC);
    Serial.print("  Curr_weight : ");
    Serial.println(current_weight);
    delay(1000);
    
  // hàm xử lý cho ăn thủ công 
  if (isTask1 == true &&(time_hour == now.hour()) && (time_min == now.minute()) && (time_month == now.month())&&(time_day == now.day())) {
    delay(1000);   
    char buffer[256];
    Serial.println();
    Serial.println("chay task 1 : cho an thu cong va publish mess");
    mess_publish["Weight"] = weight_tmp;
    JsonArray Datetime = mess_publish.createNestedArray("Datetime");
    Datetime.add(time_month);
    Datetime.add(time_day);
    Datetime.add(time_hour);
    Datetime.add(time_min);
    serializeJson(mess_publish, buffer);
    client.publish(MQTT_COMPLETE_TOPIC, buffer);

    // đặt lại weight_tmp : là lượng sẽ có trên cân sau khi nhả xong
    weight_tmp += current_weight;
      //  rotate(); // dùng cho trộn => test sau
    if(weight_tmp > 0){
      if(current_weight < weight_tmp){
       onServo();  
        //double weight = scale.get_units(10);
       double weight = 1;
       while(current_weight < weight_tmp){
         current_weight += weight;
         Serial.print("current weight: ");
         Serial.println(current_weight);
         delay(1000);
       }
       offServo();
      }
    }
    isTask1 = false;
    weight_tmp = 0;
    Serial.print("isTask1 = ");
    Serial.println(isTask1);
    Serial.println("Done");
    delay(1000); 
  }

  // isTask2 == isAuto : có tự động hay không
  if(isTask2 == true){
    Serial.print("isAuto = true ; ");
    Serial.print(" weight static = ");
    Serial.println(weight_static);
    Serial.println();
    if(current_weight < weight_static){
      if(current_weight < weight_static){
        onServo();  
        double weight = 1;
        while(current_weight < weight_static){
         current_weight += weight;
         Serial.print("current weight: ");
         Serial.println(current_weight);
         delay(1000);
         }
        offServo();
        }
       mess_publish["Weight"] = current_weight;
       char buffer[256];
        JsonArray Datetime = mess_publish.createNestedArray("Datetime");
        Datetime.add(now.month());
        Datetime.add(now.day());
        Datetime.add(now.hour());
        Datetime.add(now.minute());
        serializeJson(mess_publish, buffer);
        client.publish(MQTT_COMPLETE_TOPIC, buffer);
        Serial.println("Done");
        delay(1000);
      }  
    }
  // nếu có hẹn giờ và không tự động cho ăn
  if((isTask3 == true && isTask2 == false) && (time_schedule_hour == now.hour()) && (time_schedule_min == now.minute()) 
      && (time_schedule_month == now.month())&&(time_schedule_day == now.day())){
    delay(1000);   
    char buffer[256];
    Serial.println("chay task 3 : dat lich cho an va publish mess");
    mess_publish["Weight"] = weight_schedule;
    JsonArray Datetime = mess_publish.createNestedArray("Datetime");
    Datetime.add(time_schedule_month);
    Datetime.add(time_schedule_day);
    Datetime.add(time_schedule_hour);
    Datetime.add(time_schedule_min);
    serializeJson(mess_publish, buffer);
    client.publish(MQTT_COMPLETE_TOPIC, buffer);
    isTask3 = false;
    // đặt lại weight_schedule = lượng sẽ có sau khi nhả
    weight_schedule += current_weight;
    
    if(current_weight < weight_schedule){
       onServo();  
       //double weight = scale.get_units(10);
       double weight = 1;
       while(current_weight < weight_schedule){
         current_weight += weight;
         Serial.print("current weight: ");
         Serial.println(current_weight);
         delay(1000);
       }
      offServo();
    }
   Serial.println("Done");
   delay(1000);
  }
}
