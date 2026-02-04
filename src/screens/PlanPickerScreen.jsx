// src/screens/PlanPickerScreen.jsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { fetchPlans, startSubscription } from "../utils/paymentService";

export default function PlanPickerScreen() {
  const { theme } = useTheme();
  const [plans, setPlans] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    fetchPlans().then(setPlans).catch((err) => console.log("Plan load error", err));
  }, []);

  const onSelect = async (planId) => {
    setSelected(planId);
    await startSubscription(planId);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Choose a plan</Text>
      <FlatList
        data={plans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              {
                backgroundColor: selected === item.id ? theme.userBubbleBg : theme.surface,
                borderColor: selected === item.id ? theme.userBubbleBorder : theme.border
              }
            ]}
            onPress={() => onSelect(item.id)}
          >
            <Text style={[styles.cardTitle, { color: theme.text }]}>{item.name}</Text>
            <Text style={[styles.price, { color: theme.text }]}>{item.price}</Text>
            {item.perks?.map((perk) => (
              <Text key={perk} style={{ color: theme.textSecondary }}>
                • {perk}
              </Text>
            ))}
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  card: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700"
  },
  price: {
    marginVertical: 6,
    fontWeight: "700"
  }
});
