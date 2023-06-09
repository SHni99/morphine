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
} from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db, db2 } from "../firebase/firebase";
import { Feather } from "@expo/vector-icons";
import { ref, onValue } from "firebase/database";
import PieChart from "react-native-pie-chart";
import * as Location from "expo-location";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

const API_KEY = "f8274b0198410d536d41cc16ae3f05be";
let weatherUrl = `http://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&q=Singapore&units=metric`;

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [fallMsg, setFallMsg] = useState("");
  const [forecast, setForecast] = useState("");
  const [refreshing, setRefreshing] = useState(false);

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

  // get current user's info
  useEffect(() => {
    loadingForecast();

    const fallRef = ref(
      db2,
      "Users Data/Token UID:XvIeVwC7M0QN0qW15FNYO2e5BJ93/Split Circuit/MPU6050/MPU6050 Fall"
    );
    const usersDocRef = doc(db, "users", getAuth().currentUser.uid);
    onSnapshot(usersDocRef, (doc) => {
      setUser(doc.data());
    });

    onValue(fallRef, (snapshot) => {
      setFallMsg(snapshot.val());
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={styles.container}>
        <View>
          <View style={styles.welcomecontainer}>
            <Text style={styles.weclometext}>
              Welcome {user ? user.fName : ""}
            </Text>
            <TouchableOpacity
              style={styles.settingBtn}
              onPress={() => navigation.openDrawer()}
            >
              <Feather name="menu" size={24} color="grey" />
            </TouchableOpacity>
          </View>

          <View style={styles.weatherContainer}>
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => loadingForecast()}
                />
              }
            >
              <View style={styles.leftContainer}>
                <Image
                  style={styles.largeIcon}
                  source={{
                    uri: `http://openweathermap.org/img/wn/${current.icon}@4x.png`,
                  }}
                />
                
              </View>
              <View style={styles.rightContainer}>
              <Text style={{fontSize: "30", fontWeight: "bold", alignItems: "center"}}>{current.main}</Text>
                <Text style={{ fontSize: "60" }}>
                  {Math.round(forecast.main.temp)}˚C
                </Text>
              </View>
            </ScrollView>
          </View>

          <View style={{ alignItems: "center", top: 100 }}>
            <Text style={{ fontWeight: "bold", fontSize: "30" }}>FallSense &#128267;</Text>
            <View style={styles.mainContainer}>
              <PieChart
                widthAndHeight={250}
                series={[123, 321, 123, 789, 537]}
                sliceColor={[
                  "#5BC236",
                  "#5BC236",
                  "#5BC236",
                  "#5BC236",
                  "#5BC236",
                ]}
                coverRadius={0.65}
                coverFill={"#FFFFFF"}
              />
              <Text style={styles.battery}>100%</Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  leftContainer: {
    alignItems: "left",
    marginLeft: 35,
    marginBottom: 40
  },
  rightContainer: {
    alignItems: "right",
    alignContent: "right",
    position: "absolute",
    bottom: 40,
    right: 10,
  },
  weatherContainer: {
    top: 60,
    minHeight: 100,
    minWidth: 350,
    borderRadius: 25,
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "#f7b733",
    alignSelf: "flex-start",
  },
  welcomecontainer: {
    top: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 20,
    marginRight: 20,
  },
  largeIcon: {
    width: 150,
    height: 150,
  },
  weclometext: {
    fontSize: 25,
    letterSpacing: -1,
    fontWeight: "500",
  },
  drawertxt: {},
  mainContainer: {
    justifyContent: "center",
    alignItems: "center",
    top: 12,
  },
  battery: {
    fontSize: 20,
    position: "absolute",
    fontWeight: "bold",
  },
  loading: {},
});
export default HomeScreen;
