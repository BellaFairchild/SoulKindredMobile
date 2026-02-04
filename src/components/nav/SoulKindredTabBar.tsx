import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { Animated, Image, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { useSoulKindred } from '@/state/useSoulKindred';

// Custom bottom tab bar for expo-router Tabs.
export function SoulKindredTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [dialOpen, setDialOpen] = useState(false);
  const themeMode = useSoulKindred((s) => (s.theme === 'night' ? 'dark' : 'light'));
  const moodKey = useSoulKindred((s) => s.moodKey);
  const moodIntensity = useSoulKindred((s) => s.moodIntensity);
  const unread = useSoulKindred((s) => s.unread);

  const rpmIconUrl = useSoulKindred((s) => s.rpmIconUrl);
  const dial = useRef(new Animated.Value(0)).current;
  const dialActions = useMemo(
    () => [
      { key: 'breathing', icon: 'leaf', label: 'Breath', param: 'breathe' },
      { key: 'tapping', icon: 'hand-left', label: 'Tap', param: 'tap' },
      { key: 'bodyscan', icon: 'body', label: 'Body', param: 'scan' },
    ],
    [],
  );
  const dialPositions = [
    { x: -78, y: -70 },
    { x: 0, y: -92 },
    { x: 78, y: -70 },
  ];
  const dialStyle = {
    opacity: dial,
    transform: [{ scale: dial.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }],
  } as const;

  useEffect(() => {
    Animated.timing(dial, {
      toValue: dialOpen ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [dialOpen, dial]);

  const routes = state.routes;
  const orbRoute = routes.find((r) => r.name === 'zen');
  const otherRoutes = routes.filter((r) => r.name !== 'zen');
  const leftRoutes = otherRoutes.slice(0, 2);
  const rightRoutes = otherRoutes.slice(2);
  const activeName = routes[state.index]?.name;
  const accent = '#22c55e';

  const renderTab = (route: typeof routes[number]) => {
    const { options } = descriptors[route.key];
    const label =
      options.tabBarLabel !== undefined
        ? options.tabBarLabel
        : options.title !== undefined
          ? options.title
          : route.name;
    const isFocused = state.index === routes.indexOf(route);
    const color = isFocused ? '#22c55e' : '#94a3b8';

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
        setDialOpen(false);
      }
    };

    const fallbackIcon = isFocused ? 'ellipse' : 'ellipse-outline';
    const contentIcon =
      typeof options.tabBarIcon === 'function' ? (
        options.tabBarIcon({
          focused: isFocused,
          color,
          size: 22,
        })
      ) : (
        <Ionicons name={fallbackIcon as any} size={22} color={color} />
      );

    return (
      <Pressable
        key={route.key}
        onPress={onPress}
        style={({ pressed }) => [
          styles.tab,
          pressed && styles.pressed,
          isFocused && styles.activeTab,
        ]}
      >
        {contentIcon}
        <Text style={[styles.label, isFocused && styles.labelActive]}>{label}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.outer}>
        {dialOpen && (
          <Pressable style={styles.dialBackdrop} onPress={() => setDialOpen(false)} />
        )}

        <Animated.View
          pointerEvents={dialOpen ? 'auto' : 'none'}
          style={[styles.dial, dialStyle]}
        >
          {dialActions.map((action, idx) => (
            <Animated.View
              key={action.key}
              style={[
                styles.dialItemWrap,
                {
                  transform: [
                    { translateX: dial.interpolate({ inputRange: [0, 1], outputRange: [0, dialPositions[idx].x] }) },
                    { translateY: dial.interpolate({ inputRange: [0, 1], outputRange: [0, dialPositions[idx].y] }) },
                    { scale: dial.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) },
                  ],
                },
              ]}
            >
              <Pressable
                style={({ pressed }) => [styles.dialAction, pressed && styles.pressed]}
                onPress={() => {
                  setDialOpen(false);
                  router.push(`/tools?tab=${action.param}`);
                }}
              >
                <View style={styles.dialIconCircle}>
                  <Ionicons name={action.icon as any} size={18} color="#0b1220" />
                </View>
                <Text style={styles.dialLabel}>{action.label}</Text>
              </Pressable>
            </Animated.View>
          ))}
        </Animated.View>

        <View style={styles.orbSlot} pointerEvents="box-none">
          {orbRoute && (
            <Pressable
              key={orbRoute.key}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: orbRoute.key,
                  canPreventDefault: true,
                });
                if (event.defaultPrevented) return;
                navigation.navigate(orbRoute.name);
                setDialOpen(false);
              }}
              onLongPress={() => setDialOpen((prev) => !prev)}
              delayLongPress={140}
              style={({ pressed }) => [
                styles.tab,
                styles.orbSlot,
                pressed && styles.pressed,
                state.index === routes.indexOf(orbRoute) && styles.activeTab,
                styles.orb,
              ]}
            >
              {typeof descriptors[orbRoute.key].options.tabBarIcon === 'function' ? (
                descriptors[orbRoute.key].options.tabBarIcon!({
                  focused: state.index === routes.indexOf(orbRoute),
                  color: '#0b1220',
                  size: 26,
                })
              ) : (
                <Ionicons
                  name={(state.index === routes.indexOf(orbRoute) ? 'ellipse' : 'ellipse-outline') as any}
                  size={26}
                  color="#0b1220"
                />
              )}
            </Pressable>
          )}
        </View>

        <View style={styles.glassPlate}>
          <BlurView
            intensity={themeMode === 'dark' ? 28 : 42}
            tint={themeMode === 'dark' ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.row}>
            {leftRoutes.map(renderTab)}
            <View style={styles.rowSpacer} />
            {rightRoutes.map((route) =>
              route.name === 'avatar' ? (
                <FriendIcon
                  key={route.key}
                  label="friend"
                  active={activeName === 'avatar'}
                  accent={accent}
                  avatarUrl={rpmIconUrl}
                  onPress={() => navigation.navigate('avatar' as never)}
                />
              ) : (
                renderTab(route)
              ),
            )}
          </View>
        </View>

      </View>
    </View>
  );
}

function FriendIcon({
  label,
  active,
  accent,
  avatarUrl,
  onPress,
}: {
  label: string;
  active: boolean;
  accent: string;
  avatarUrl?: string;
  onPress: () => void;
}) {
  const [broken, setBroken] = React.useState(false);

  const safeUri =
    avatarUrl && !broken
      ? encodeURI(avatarUrl) // ✅ handles file:// paths safely
      : undefined;

  return (
    <Pressable onPress={onPress} style={styles.btn}>
      <View
        style={[
          styles.avatarWrap,
          active ? { borderColor: `rgba(120,180,255,0.85)`, shadowColor: accent } : null,
        ]}
      >
        {safeUri ? (
          <Image
            source={{ uri: safeUri }}
            style={styles.avatarImg}
            onError={() => setBroken(true)} // ✅ fallback instead of crash
          />
        ) : (
          <View style={styles.avatarFallback} />
        )}
      </View>

      <Text
        style={[
          styles.btnText,
          { color: active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)' },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default SoulKindredTabBar;

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,
    zIndex: 999,
    elevation: 999,
    overflow: 'visible',
  },
  outer: {
    height: 82,
    overflow: 'visible',
  },
  glassPlate: {
    height: 82,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    overflow: 'hidden',
    paddingHorizontal: 18,
    justifyContent: 'center',
    backgroundColor: 'rgba(20,20,24,0.35)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    paddingTop: 6,
    justifyContent: 'space-between',
  },
  rowSpacer: {
    width: 72,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#0b1220',
  },
  pressed: {
    opacity: 0.8,
  },
  orbSlot: {
    position: 'absolute',
    alignSelf: 'center',
    top: -28,
    width: 98,
    height: 98,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3000,
    elevation: 3000,
  },
  orb: {
    flex: 0,
    backgroundColor: '#22c55e',
    borderRadius: 32,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
    shadowColor: '#22c55e',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 2000,
    elevation: 2000,
  },
  label: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  labelActive: {
    color: '#22c55e',
  },
  dialBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dial: {
    position: 'absolute',
    alignSelf: 'center',
    top: -124,
    width: 1,
    height: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4000,
    elevation: 4000,
  },
  dialItemWrap: {
    position: 'absolute',
    alignItems: 'center',
  },
  dialAction: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },
  dialIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#bbf7d0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22c55e',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  dialLabel: {
    color: '#e2e8f0',
    fontWeight: '700',
    fontSize: 12,
    textShadowColor: '#0b1220',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    borderRadius: 12,
  },
  avatarWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0f172a',
    borderWidth: 2,
    borderColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(148,163,184,0.35)',
  },
  btnText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
});
