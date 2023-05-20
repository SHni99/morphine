import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
//import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db, db2, fallRef} from "../firebase/firebase";
import { SafeAreaView } from "react-native-safe-area-context";
const { height, width } = Dimensions.get("screen");
import { Feather } from "@expo/vector-icons";
import { ref, onValue } from "firebase/database";
import PieChart from 'react-native-pie-chart'

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [fallMsg, setFallMsg] = useState("");

  // get current user's info
  useEffect(() => {
    const fallRef = ref(db2, 'Users Data/Token UID:XvIeVwC7M0QN0qW15FNYO2e5BJ93/Split Circuit/MPU6050/MPU6050 Fall');
    const usersDocRef = doc(db, "users", getAuth().currentUser.uid);
    onSnapshot(usersDocRef, (doc) => {
      setUser(doc.data());
    });

    onValue(fallRef, (snapshot) => {
      setFallMsg(snapshot.val());
    });

  }, []);


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

          <View style={{ alignItems: "center", top: 200 }}>
            
            <Text style={{fontWeight: 'bold'}}>Fall status: {fallMsg}</Text>
            
            {/* <TouchableOpacity
          onPress={() => {
            getAuth().currentUser.delete();
          }}
        >
          <Text>Delete acc</Text>
        </TouchableOpacity> */}
          <View style={styles.mainContainer}>
            <PieChart
            widthAndHeight={250}
            series={[123, 321, 123, 789, 537]}
            sliceColor={['#5BC236', '#5BC236', '#5BC236', '#5BC236', '#5BC236']}
            coverRadius={0.65}
            coverFill={'#FFFFFF'}
          />
            <Text style={styles.battery}>FallSense &#128267;</Text>
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
    // justifyContent: "center",
  },
  welcomecontainer: {
    // left: 40,
    top: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 20,
    marginRight: 20,
  },
  weclometext: {
    fontSize: 25,
    letterSpacing: -1,
    fontWeight: "500",
  },
  drawertxt: {
    // left: 130,
  },
  mainContainer: {
    //flex: 3,
    justifyContent: "center",
    alignItems: "center",
    top: 12,
  },
  battery: {
    fontSize: 20,
    position: "absolute",
    fontWeight: "bold"
  }
});
export default HomeScreen;
