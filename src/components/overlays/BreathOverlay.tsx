import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useOverlay } from "@/context/OverlayContext";
import LottieView from "lottie-react-native";

type Phase = "Inhale" | "Hold" | "Exhale";

const PLAN = [
  { phase: "Inhale" as const, seconds: 4 },
  { phase: "Hold" as const, seconds: 2 },
  { phase: "Exhale" as const, seconds: 6 },
];

export default function BreathOverlay() {
  const { closeOverlay } = useOverlay();

  const [running, setRunning] = useState(true);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [remaining, setRemaining] = useState(PLAN[0].seconds);

  const phase = PLAN[phaseIndex].phase;
  const total = PLAN[phaseIndex].seconds;

  const instruction = useMemo(() => {
    if (phase === "Inhale") return "Breathe in slowly…";
    if (phase === "Hold") return "Hold, gently…";
    return "Let it out…";
  }, [phase]);

  // Tick countdown
  useEffect(() => {
    if (!running) return;

    const t = setInterval(() => {
      setRemaining((s) => {
        if (s > 1) return s - 1;

        // Move to next phase
        setPhaseIndex((i) => (i + 1) % PLAN.length);
        return PLAN[(phaseIndex + 1) % PLAN.length].seconds;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [running, phaseIndex]);

  const toggle = () => {
    setRunning((v) => !v);
  };

  const reset = () => {
    setRunning(true);
    setPhaseIndex(0);
    setRemaining(PLAN[0].seconds);
  };

  return (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Breath Reset</Text>
        <Pressable onPress={closeOverlay} hitSlop={10}>
          <Text style={styles.close}>Close</Text>
        </Pressable>
      </View>

      <Text style={styles.sub}>{instruction}</Text>

      {/* Breathing Lottie Animation */}
      <View style={styles.center}>
        <LottieView
          source={require('../../../assets/animations/breath.json')}
          autoPlay={running}
          loop
          style={{ width: 250, height: 250 }}
          speed={0.6} // Slight slow down for calmness
        />

        <View style={styles.readout}>
          <Text style={styles.phase}>{phase}</Text>
          <Text style={styles.timer}>
            {remaining}s <Text style={styles.timerSmall}>/ {total}s</Text>
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <Pressable onPress={toggle} style={({ pressed }) => [styles.btn, pressed && styles.pressed]}>
          <Text style={styles.btnText}>{running ? "Pause" : "Resume"}</Text>
        </Pressable>

        <Pressable onPress={reset} style={({ pressed }) => [styles.btnSecondary, pressed && styles.pressed]}>
          <Text style={styles.btnSecondaryText}>Reset</Text>
        </Pressable>
      </View>

      <Text style={styles.tip}>Inhale 4 • Hold 2 • Exhale 6</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "900", color: "#0B1020" },
  close: { fontSize: 14, fontWeight: "900", color: "#416ECA" },
  sub: { marginTop: 6, fontSize: 13, fontWeight: "700", color: "rgba(11,16,32,0.72)" },

  center: { marginTop: 18, alignItems: "center", justifyContent: "center" },

  readout: { position: "absolute", alignItems: "center" },
  phase: { fontSize: 20, fontWeight: "900", color: "#2396E0" },
  timer: { marginTop: 6, fontSize: 16, fontWeight: "900", color: "#0B1020" },
  timerSmall: { fontSize: 12, fontWeight: "800", color: "rgba(11,16,32,0.6)" },

  controls: { flexDirection: "row", gap: 10, marginTop: 18 },
  btn: {
    flex: 1,
    height: 44,
    borderRadius: 16,
    backgroundColor: "#416ECA",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
  },
  btnText: { color: "#fff", fontSize: 14, fontWeight: "900" },

  btnSecondary: {
    width: 110,
    height: 44,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.88)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
  },
  btnSecondaryText: { color: "#0B1020", fontSize: 14, fontWeight: "900" },

  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },

  tip: { marginTop: 10, fontSize: 12, fontWeight: "700", color: "rgba(11,16,32,0.65)" },
});
