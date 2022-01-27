#include <WiFi.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>
//#include <Servo.h>
#include "RTClib.h"
#include "esp32_secrets.h"
#include <String.h>

WiFiClient wifiClient;
PubSubClient client(wifiClient);

RTC_DS3231 rtc;
//Servo myservo1; 
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
//int servo1_pin = SERVO_1_PIN;
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
// weight_tmp : lượng hẹn giờ or cho ăn thủ công 
int weight_static = 0;
int weight_tmp = 0;
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
//// mở nắp 
//void onServo() {
//  delay(15);
//  for(int pos = 0; pos <= 30; pos += 1) { 
//    myservo2.write(pos);              
//    delay(10);                       
//  }
//}
//// đóng nắp
//void offServo() {
//  delay(15);
//  for(int pos = 30; pos >= 0; pos -= 1) { 
//    myservo2.write(pos);              
//    delay(10);                       
//  }
//}

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
    // --so sánh 2 id, nếu đúng thì cân bằng time giữa ds3231 và web--
  if(strcmp(devide_ID, mess_subcribe["DevideID"]) == 0){
    if(strcmp(mess_subcribe["Task"],"1") == 0){
      isTask1 = true;
      weight_tmp = mess_subcribe["Weight"];
      Serial.println("Vao Task 1 : cho an thu cong");
    } else if(strcmp(mess_subcribe["Task"],"2") == 0){
      //isTask2 = true;
      if(strcmp(mess_subcribe["isAuto"],"1")){
        isAuto = true;
        weight_static = mess_subcribe["Weight"];
      }else {
        isAuto = false;
      }
      Serial.println("Vao Task 2 : cho an tu dong");
    } else if(strcmp(mess_subcribe["Task"],"3") == 0){
      isTask3 = true;
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
//  myservo1.attach(servo1_pin);
//  myservo2.attach(servo2_pin);
  
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

void Feeding(){
    if(current_weight < weight_tmp){
     //myservo1.write(40);  
      //double weight = scale.get_units(10);
     double weight = 10;
     Serial.print("weight: ");
     Serial.println(weight);
     current_weight+= weight;
     Serial.print("curr weight: ");
     Serial.println(current_weight);
    delay(100);
    }else{
     //current_weight = 0;
     //myservo1.write(0);
     isFeed=false;
     isDone=true;
     Serial.println("Done");
     delay(1000);
    } 
}


void loop() {
  client.loop();
  if (!client.connected()) {
    connect_to_broker();
  }
  DateTime now = rtc.now();
  Serial.print(now.hour(), DEC);
    Serial.print(':');
    Serial.print(now.minute(), DEC);
    Serial.print(':');
    Serial.print(now.second(), DEC);
    Serial.println();
    delay(1000);
    
  // hàm xử lý cho ăn thủ công 
  if (isTask1 == true &&(time_hour == now.hour()) && (time_min == now.minute()) && (time_month == now.month())&&(time_day == now.day())) {
    delay(1000);   
    char buffer[256];
    int arr[] = {now.hour(),now.minute(),now.day(),now.month()};
    Serial.println("chay task 1 : cho an thu cong va publish mess");
    mess_publish["Weight"] = weight_tmp;
    JsonArray Datetime = mess_publish.createNestedArray("Datetime");
    Datetime.add(time_month);
    Datetime.add(time_day);
    Datetime.add(time_hour);
    Datetime.add(time_min);
    serializeJson(mess_publish, buffer);
    client.publish(MQTT_COMPLETE_TOPIC, buffer);
//  rotate();
    if(weight_tmp > 0){
      Feeding();
    }
    isTask1 = false;
    weight_tmp = 0;
  }
  if(isAuto == true){
    if(current_weight < weight_static){
      double weight = 10;
      current_weight += weight;
      delay(100);
    }else{
     //current_weight = 0;
     //myservo1.write(0);
     isFeed=false;
     isDone=true;
     Serial.println("Done");
     delay(1000);
    } 
    //isTask2 = false;
    mess_publish["Weight"] = current_weight;
    JsonArray Datetime = mess_publish.createNestedArray("Datetime");
    Datetime.add(time_month);
    Datetime.add(time_day);
    Datetime.add(time_hour);
    Datetime.add(time_min);
    serializeJson(mess_publish, buffer);
    client.publish(MQTT_COMPLETE_TOPIC, buffer);
  }
  if(isTask3 == true){
    // xử lý đặt lịch
    // thêm or xóa timeSchedule trong array
    // .....
    isTask3 = false;
  }

  // còn 2 hàm nữa , 1 là khi đến h trong timeSchedule thì nhả, 2 là nếu isAuto = 1 và lượng thức ăn nhỏ hơn weight thì nhả 
  
  
}
