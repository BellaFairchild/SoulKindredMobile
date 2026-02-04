// src/navigation/BottomTabs.jsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import ChatScreen from "../screens/ChatScreen";
import AvatarScreen from "../screens/AvatarScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#0B1224", borderTopWidth: 0 },
        tabBarActiveTintColor: "#73F4FF",
        tabBarInactiveTintColor: "#6F7A93"
      }}
    >
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 12 }}>chat</Text> }}
      />
      <Tab.Screen
        name="Avatar"
        component={AvatarScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 12 }}>avatar</Text> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 12 }}>you</Text> }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarIcon: () => <Text style={{ fontSize: 12 }}>settings</Text> }}
      />
    </Tab.Navigator>
  );
}
