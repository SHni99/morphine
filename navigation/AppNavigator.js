import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import * as Screens from "../screens/index";
import DrawerNavigator from "./DrawerNavigator";
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="login"
        component={Screens.LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="signup"
        component={Screens.SignupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="hometab"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="changename"
        component={Screens.ChangeNameScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="changenum"
        component={Screens.ChangeNumberScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="changepw"
        component={Screens.ChangePasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="change"
        component={Screens.ChangeDetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
