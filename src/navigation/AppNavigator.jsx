// src/navigation/AppNavigator.jsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabs from "./BottomTabs";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import PlanPickerScreen from "../screens/PlanPickerScreen";
import ScenesScreen from "../screens/ScenesScreen";
import MemoryJournalScreen from "../screens/MemoryJournalScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={BottomTabs} />
      <Stack.Screen name="PlanPicker" component={PlanPickerScreen} />
      <Stack.Screen name="Scenes" component={ScenesScreen} />
      <Stack.Screen name="MemoryJournal" component={MemoryJournalScreen} />
    </Stack.Navigator>
  );
}
