import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import { getAuth } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState, useRef } from "react";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Button
} from "react-native";
import { db, db2 } from "../firebase/firebase";

const API_KEY = "f8274b0198410d536d41cc16ae3f05be";
let weatherUrl = `http://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&q=Singapore&units=metric`;
const image = { uri: "https://legacy.reactjs.org/logo-og.png" };

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [fallMsg, setFallMsg] = useState("");
  const [isFall, setIsFall] = useState(false);
  const [lastFallDate, setLastFallDate] = useState();
  const [forecast, setForecast] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isPanic, setIsPanic] = useState(false);
  const [lastPanicDate, setLastPanicDate] = useState();
  const [MPUMsg, setMPUMsg] = useState("off");
  const [MPUval, setMPUval] = useState("");
  const [MPUval2, setMPUval2] = useState("");
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const loadingForecast = async () => {
    setRefreshing(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
    }

    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });

    const response = await fetch(
      `${weatherUrl}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`
    );
    const data = await response.json();

    if (!response.ok) {
      Alert.alert("Error", "Something went wrong");
    } else {
      setForecast(data);
    }
    setRefreshing(false);
  };

  const sendNotification = () => {
    //users must log in to Expo to remove handling exceptions
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }

  async function schedulePushNotification() {

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🆘🚨🆘🚨🆘 FallGuard S.O.S 🆘🚨🆘🚨🆘",
        body: "Mama has fallen!!\nCheck her location in app now ",
        sound: 'alertsound.wav',
      },
      trigger: { seconds: 3 },
    });
  }    

  async function registerForPushNotificationsAsync() {
    let token;
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        })
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      //console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token;
  }

  useEffect(() => {
    loadingForecast();

    sendNotification(); //request for permission to send notification

    // get users data
    const usersDocRef = doc(db, "users", getAuth().currentUser.uid);
    onSnapshot(usersDocRef, (doc) => {
      setUser(doc.data());
    });

    // check for fall
    const fallRef = ref(
      db2,
      "Users Data/Token UID:XvIeVwC7M0QN0qW15FNYO2e5BJ93/Split Circuit/MPU6050/MPU6050 Fall"
    );
    onValue(fallRef, (snapshot) => {
      setFallMsg(snapshot.val()[0]);
      if (snapshot.val()[0] === "Fall detected") {
        schedulePushNotification();
        setIsFall(true);
        setLastFallDate(
          new Date().toLocaleString("en-GB", { timeZone: "SST" })
        );
      } else {
        setIsFall(false);
      }
    });

    // check if panic activated
    const isActivatedRef = ref(
      db2,
      "Users Data/" +
        "Token UID:XvIeVwC7M0QN0qW15FNYO2e5BJ93/Split Circuit/MPU6050/Panic Button"
    );
    onValue(isActivatedRef, (snapshot) => {
      const data = snapshot.val();
      setIsPanic(data[0] === "True");
      if (data[0] === "True") {
        setLastPanicDate(
          new Date().toLocaleString("en-GB", { timeZone: "SST" })
        );
      }
    });

    // check if mpu is turned on
    const MPUref = ref(
      db2,
      "Users Data/Token UID:XvIeVwC7M0QN0qW15FNYO2e5BJ93/Split Circuit/MPU6050/MPU6050 Accounter"
    );

    onValue(MPUref, (snapshot) => {
      //setMPUval2(snapshot.val());
      if (MPUval == null) {
        setMPUval(snapshot.val());
      } else if (MPUval != null && MPUval != snapshot.val()) {
        setMPUMsg("on");
        setMPUval(snapshot.val());
      } else {
        const timer = setTimeout(() => setMPUval2(snapshot.val()), 5000);
        if (MPUMsg != "off" && MPUval == MPUval2) {
          Alert.alert("Device is shutting down");
          setMPUMsg("off");
        }
        return () => {
          clearTimeout(timer);
        };
      }
    });
  }, [MPUval, MPUval2]);

  if (!forecast || !user) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }
  const current = forecast.weather[0];
  const getWelcomeText = () => {
    if (isFall && isPanic) {
      return "Panic button has been activated.\nA fall has been detected.";
    }
    if (isFall) {
      return "A fall has been detected.";
    }

    if (isPanic) {
      return "Panic button has been activated.";
    }
    return "Welcome back,\n" + user.fName;
  };

  return (
    <ImageBackground
      source={require("../assets/background.png")}
      resizeMode="cover"
      style={{ width: "100%", height: "100%" }}
    >
      <SafeAreaView
        style={
          isPanic || isFall
            ? { backgroundColor: "#ffa45c", flex: 1 }
            : { flex: 1 }
        }
      >
        <KeyboardAvoidingView style={styles.container}>
          <View style={styles.welcomecontainer}>
            <View style={styles.welcomecontainerContent}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 20,
                  justifyContent: "center",
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <Image
                  source={
                    !isPanic && !isFall
                      ? require("../assets/logo-white.png")
                      : require("../assets/logo.png")
                  }
                  style={!isPanic && !isFall ? styles.whiteLogo : styles.logo}
                />
                <Text style={[styles.welcometext]}>{getWelcomeText()}</Text>
                <View
                  style={[
                    styles.batteryPercentContainer,
                    MPUMsg === "on"
                      ? styles.batteryPercentContainerOn
                      : styles.batteryPercentContainerOff,
                  ]}
                >
                  <Text style={styles.batteryPercent}>
                    Device Status: {MPUMsg.toLocaleUpperCase()}{" "}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.settingBtn}
                onPress={() => navigation.openDrawer()}
              >
                <Feather name="menu" size={24} color="grey" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.mainContainer}>
            <View style={[styles.weatherContainer, styles.shadowProp]}>
              <View style={styles.weatherTextContainer}>
                <View style={styles.mainWeather}>
                  <Text
                    style={{
                      fontSize: "45",
                      fontWeight: "bold",
                      letterSpacing: -2,
                      color: "#43356B",
                    }}
                  >
                    {Math.round(forecast.main.temp)}˚C
                  </Text>
                </View>
                <View style={styles.miscWeatherText}>
                  <Text
                    style={{
                      fontSize: "20",
                      fontWeight: "bold",
                    }}
                  >
                    {current.main}
                  </Text>
                  <Text>
                    Feels like {Math.round(forecast.main.feels_like)}˚C
                  </Text>
                </View>
              </View>
              <View style={styles.weatherIcon}>
                <Image
                  style={styles.largeIcon}
                  source={{
                    uri: `http://openweathermap.org/img/wn/${current.icon}@4x.png`,
                  }}
                />
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                flex: 1,
                padding: 20,
              }}
            >
              <View style={[styles.emergencyContainer, { marginRight: 10 }]}>
                <Image
                  source={
                    isPanic
                      ? require("../assets/panic-red.png")
                      : require("../assets/panic-green.png")
                  }
                  style={styles.emergencyIcon}
                />
                <Text style={styles.btnHeader}>Panic</Text>
                <Text
                  style={[
                    styles.activityIndicator,
                    isPanic ? styles.activated : styles.notActivated,
                  ]}
                >
                  {isPanic ? "ACTIVATED" : "NOT ACTIVATED"}
                </Text>
                <Text style={{ textAlign: "center", fontStyle: "italic" }}>
                  Last activated:{"\n"}
                  {lastPanicDate ? lastPanicDate : "No last date recorded"}
                </Text>
              </View>
              <View style={[styles.emergencyContainer, { marginLeft: 10 }]}>
                <Image
                  source={
                    isFall
                      ? require("../assets/fall-red.png")
                      : require("../assets/fall-green.png")
                  }
                  style={styles.emergencyIcon}
                />
                <Text style={styles.btnHeader}>Fall</Text>
                <Text
                  style={[
                    styles.activityIndicator,
                    isFall ? styles.activated : styles.notActivated,
                  ]}
                >
                  {isFall ? "USER HAS FALLEN" : "NO FALL"}
                </Text>
                <Text style={{ textAlign: "center", fontStyle: "italic" }}>
                  Last fall:{"\n"}
                  {lastFallDate ? lastFallDate : "No last date recorded"}
                </Text>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    width: 60,
    height: 60,
    alignSelf: "center",
  },
  whiteLogo: {
    width: 60,
    height: 60,
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: "100%",
  },
  weatherTextContainer: {
    // backgroundColor: "black",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  weatherContainer: {
    borderRadius: 25,
    display: "flex",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#f2f2fc",
  },
  onOffBtn: {
    height: 50,
    width: 50,
    borderRadius: "100%",
    position: "absolute",
  },
  mainWeather: {
    marginRight: 10,
  },
  weatherScrollContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  welcomecontainer: {
    width: "100%",
  },
  welcomecontainerContent: {
    flexDirection: "column",
    padding: 20,
    display: "flex",
    alignItems: "center",
    marginBottom: 40,
    minHeight: "35%",
  },

  largeIcon: {
    width: 100,
    height: 100,
    left: 10,
    backgroundColor: "#A3A3BD",
    borderRadius: "100%",
  },
  appName: {
    fontSize: 20,
    color: "white",
    fontWeight: "500",
    textAlign: "center",
  },
  welcometext: {
    fontSize: 35,
    fontWeight: "700",
    textAlign: "center",
    color: "white",
  },
  batteryPercentContainer: {
    marginTop: 10,
    padding: 10,
    width: 200,
    borderRadius: 15,
  },
  batteryPercentContainerOn: {
    backgroundColor: "#6B835E",
  },
  batteryPercentContainerOff: {
    backgroundColor: "#E1867F",
  },
  batteryPercent: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  settingBtn: {
    position: "absolute",
    alignSelf: "flex-end",
    right: 20,
  },
  drawertxt: {},

  battery: {
    fontSize: 20,
    position: "absolute",
    fontWeight: "bold",
  },
  loading: {},
  batteryContainer: {
    marginTop: 20,
  },
  mainContainer: {
    backgroundColor: "white",
    flex: 1,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    // height: "70%",
  },
  panicBtnContainer: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  panicBtn: {
    backgroundColor: "#FFA45A",
    padding: 20,
    borderRadius: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  panicBtnText: { fontWeight: "500", fontSize: 16 },
  emergencyTitle: {
    fontSize: "20",
    fontWeight: "bold",
    marginBottom: 20,
  },
  emergencyDesc: { fontStyle: "italic" },
  activityIndicator: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  activated: { color: "#D58927", fontSize: 16 },
  notActivated: { fontSize: 18, color: "#6B835E" },
  emergencyContainer: {
    backgroundColor: "#f2f2fc",
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },

  btnHeader: {
    fontSize: 20,
    fontWeight: "500",
    marginTop: 5,
    marginBottom: 5,
    color: "#43356B",
  },
  emergencyIcon: {
    width: 120,
    height: 120,
  },
});
export default HomeScreen;
