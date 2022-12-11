import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import * as Screens from "../screens/index";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
const Tab = createBottomTabNavigator();

const BottomTab = ({ navigation }) => {
  return (
    <Tab.Navigator
      initialRouteName="homes"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "white",
          height: 100,
        },
      }}
    >
      <Tab.Screen
        name="contacts"
        component={Screens.ContactsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <AntDesign
                name="contacts"
                size={20}
                color={focused ? "#171E4A" : "#A3A3BD"}
              />
              <Text
                style={{
                  width: 100,
                  textAlign: "center",
                  top: 5,
                  color: focused ? "#171E4A" : "#A3A3BD",
                }}
              >
                Contacts
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="homes"
        component={Screens.HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <AntDesign
                name="home"
                size={20}
                color={focused ? "#171E4A" : "#A3A3BD"}
              />
              <Text
                style={{
                  width: 100,
                  textAlign: "center",
                  top: 5,
                  color: focused ? "#171E4A" : "#A3A3BD",
                }}
              >
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="gps"
        component={Screens.GpsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Feather
                name="map-pin"
                size={20}
                color={focused ? "#171E4A" : "#A3A3BD"}
              />
              <Text
                style={{
                  width: 100,
                  textAlign: "center",
                  top: 5,
                  color: focused ? "#171E4A" : "#A3A3BD",
                }}
              >
                Locate
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;
