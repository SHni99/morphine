import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as Screens from "../screens/index";
import BottomTab from "./BottomTab";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        drawerPosition: "right",
        drawerActiveBackgroundColor: "#43356B",
        drawerActiveTintColor: "white",
      }}
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
}

export default DrawerNavigator;
