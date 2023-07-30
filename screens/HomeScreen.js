import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db, db2 } from "../firebase/firebase";
import { Feather } from "@expo/vector-icons";
import { ref, onValue, getDatabase } from "firebase/database";
import PieChart from "react-native-pie-chart";
import * as Location from "expo-location";

const API_KEY = "f8274b0198410d536d41cc16ae3f05be";
let weatherUrl = `http://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&q=Singapore&units=metric`;
const image = { uri: "https://legacy.reactjs.org/logo-og.png" };

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

  useEffect(() => {
    loadingForecast();

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
      if (snapshot.val()[0] === "Fall Detected") {
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
      setMPUval(snapshot.val());
      if (MPUval == snapshot.val()) {
        const timer = setTimeout(() => setMPUMsg("off"), 5000);
        return () => {
          if (MPUval == snapshot.val) {
            Alert.alert("Device has shut down");
            clearTimeout(timer);
          }
        };
      } else {
        if (MPUMsg != "on") {
          setMPUMsg("on");
        }
      }
    });
  }, []);

  if (!forecast) {
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
                <Text style={styles.batteryPercent}>
                  Device Status: {MPUMsg.toLocaleUpperCase()}{" "}
                  {MPUMsg === "on" ? "\u{1F7E2}" : "\u{1F534}"}
                </Text>
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
  batteryPercent: {
    marginTop: 10,
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
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  activated: { color: "#D58927" },
  notActivated: { fontSize: 18, color: "#6B835E" },
  emergencyContainer: {
    backgroundColor: "#f2f2fc",
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    padding: 20,
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
