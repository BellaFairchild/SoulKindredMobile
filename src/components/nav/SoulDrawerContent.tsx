import React from 'react';
import { View, StyleSheet, Text, Image, Pressable } from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/AppTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { ThemeToggle } from '../tools/ThemeToggle';
import { useAuth } from '@/auth/useAuth';
import { useRouter } from 'expo-router';

const menuItems = [
  { key: 'profile', label: 'Profile', icon: 'person-outline' },
  { key: 'companion', label: 'Companion', icon: 'heart-outline' },
  { key: 'vault', label: 'Soul Vault', icon: 'file-tray-full-outline' },
  { key: 'scenes', label: 'Scenes', icon: 'film-outline' },
  { key: 'support', label: 'Support', icon: 'help-buoy-outline' },
  { key: 'settings', label: 'Settings', icon: 'settings-outline' },
  { key: 'resources', label: 'Resources', icon: 'book-outline' },
];

export function SoulDrawerContent(props: DrawerContentComponentProps) {
  const { state, navigation } = props;
  const insets = useSafeAreaInsets();
  const { theme, toggleTheme } = useTheme() as any;
  const isLight = theme.mode === 'light';
  const activeKey = state.routes[state.index]?.name;
  const { user, logout } = useAuth();
  const router = useRouter();

  const colors = {
    bg: theme.appBackground,
    activeAccent: theme.primary,
    activeItemBg: isLight ? `${theme.primary}15` : 'rgba(29, 216, 255, 0.08)',
    inactiveText: isLight ? 'rgba(30, 41, 59, 0.7)' : '#FFFFFF', // White in dark mode
    inactiveIcon: '#00BCD4', // Cyan icons for both themes
    border: isLight ? 'rgba(0, 188, 212, 0.3)' : 'rgba(0, 188, 212, 0.25)', // Cyan tint border in both themes
  };

  const handleNavigate = (key: string) => {
    navigation.navigate(key as never);
    navigation.closeDrawer?.();
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.bg, paddingTop: insets.top + 20 }]}>
      <View style={styles.header}>
        <Image
          source={isLight ? require('../../../assets/images/logo_light.png') : require('../../../assets/images/logo_dark.png')}
          style={styles.logoFull}
          resizeMode="contain"
        />
        <View style={styles.headerTextCol}>
          <Text style={[styles.appName, { color: isLight ? theme.neutralDark : '#fff', fontFamily: theme.typography.h1 }]}>Soul Kindred</Text>
          <Text style={[styles.tagline, { color: isLight ? 'rgba(30, 41, 59, 0.5)' : '#94a3b8', fontFamily: theme.typography.main }]}>Calm, Caring, Connection</Text>
        </View>
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContainer}
        scrollEnabled={true}
      >
        <View style={styles.menu}>
          {menuItems.map((item) => {
            const focused = activeKey === item.key;
            return (
              <Pressable
                key={item.key}
                onPress={() => handleNavigate(item.key)}
                style={({ pressed }) => [
                  styles.menuItem,
                  { borderColor: colors.border },
                  focused && {
                    backgroundColor: colors.activeItemBg,
                    borderColor: colors.activeAccent,
                  },
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color={focused ? colors.activeAccent : colors.inactiveIcon}
                />
                <Text style={[
                  styles.menuLabel,
                  { color: focused ? theme.primary : colors.inactiveText, fontFamily: theme.typography.button }
                ]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </DrawerContentScrollView>

      {/* Theme Toggle Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>

        {/* Auth Button */}
        <Pressable
          onPress={async () => {
            if (user) {
              await logout();
              router.replace('/(auth)/login');
            } else {
              router.push('/(auth)/login');
            }
          }}
          style={({ pressed }) => [
            styles.authBtn,
            { backgroundColor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' },
            pressed && styles.pressed
          ]}
        >
          <Ionicons name={user ? "log-out-outline" : "log-in-outline"} size={20} color={theme.secondary} />
          <Text style={[styles.authText, { color: theme.secondary, fontFamily: theme.typography.button }]}>
            {user ? 'Log Out' : 'Log In'}
          </Text>
        </Pressable>

        <BlurView intensity={isLight ? 40 : 25} style={[styles.themeCard, { backgroundColor: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)' }]}>
          <View style={styles.themeInfo}>
            <ThemeToggle isLight={isLight} onToggle={toggleTheme} />
          </View>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContainer: {
    paddingTop: 0,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  logoFull: {
    width: 200,
    height: 100,
    marginBottom: -10,
  },
  headerTextCol: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 0,
  },
  menu: {
    gap: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  menuLabel: {
    fontWeight: '700',
    fontSize: 16,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 20,
  },
  themeCard: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    overflow: 'hidden',
  },
  themeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  authBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  authText: {
    fontSize: 14,
    fontWeight: '600',
  }
});
