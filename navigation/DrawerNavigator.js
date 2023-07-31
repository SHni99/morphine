import React from "react";
import {
  createDrawerNavigator,
  DrawerItem,
  DrawerItemList,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import * as Screens from "../screens/index";
import BottomTab from "./BottomTab";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-root-toast";
import { Alert } from "react-native";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const navigation = useNavigation();
  const handleSignOut = () => {
    const logOut = () => {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          onAuthStateChanged(auth, (user) => {
            if (user) {
              console.log(`Logged out of ${user.email}`);
            }
          });
          let toast = Toast.show("You have logged out", {
            duration: Toast.durations.SHORT,
            backgroundColor: "red",
          });

          setTimeout(function hideToast() {
            Toast.hide(toast);
          }, 1500);
          navigation.navigate("login");
        })
        .catch((error) => {
          alert(error.message);
        });
    };
    Alert.alert("Confirm", "Are you sure you want to log out?", [
      { text: "No" },
      { text: "Yes", onPress: () => logOut() },
    ]);
  };

  function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Log out"
          onPress={handleSignOut}
          icon={({ focused }) => {
            return (
              <AntDesign
                name="logout"
                size={18}
                color={focused ? "white" : "grey"}
              />
            );
          }}
        />
      </DrawerContentScrollView>
    );
  }

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        drawerPosition: "right",
        drawerActiveBackgroundColor: "#43356B",
        drawerActiveTintColor: "white",
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={BottomTab}
        options={{
          drawerIcon: ({ focused }) => {
            return (
              <Entypo
                name="home"
                size={18}
                color={focused ? "white" : "grey"}
              />
            );
          },
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Screens.SettingsScreen}
        options={{
          drawerIcon: ({ focused }) => {
            return (
              <Ionicons
                name="ios-settings-sharp"
                size={18}
                color={focused ? "white" : "grey"}
              />
            );
          },
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
