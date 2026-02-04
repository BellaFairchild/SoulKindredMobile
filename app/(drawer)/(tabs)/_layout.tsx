import React from "react";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NotchedTabBar from "@/components/tools/NotchedTabBar";
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM_MARGIN } from "@/constants/layout";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  // Reserve space for the custom overlay tab bar + safe area
  const bottomPad = TAB_BAR_HEIGHT + TAB_BAR_BOTTOM_MARGIN + insets.bottom + 12;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // sceneContainerStyle: { paddingBottom: bottomPad }, // Invalid prop for Tabs
        tabBarStyle: { display: "none" }, // ✅ hides default tabs
      }}
      tabBar={(props) => <NotchedTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="journal" options={{ title: "Journal" }} />
      <Tabs.Screen name="chat" options={{ title: "Chat" }} />
      <Tabs.Screen name="insights" options={{ title: "Insights" }} />
    </Tabs>
  );
}
