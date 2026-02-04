import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { SoulDrawerContent } from '@/components/nav/SoulDrawerContent';
import { useTheme } from '@/context/AppTheme';

export default function DrawerLayout() {
  const { theme } = useTheme() as any;
  const isLight = theme.mode === 'light';

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        overlayColor: isLight ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.6)',
        drawerStyle: {
          width: 310,
          backgroundColor: theme.appBackground
        },
      }}
      drawerContent={(props) => <SoulDrawerContent {...props} />}
    >
      <Drawer.Screen name="(tabs)" options={{ drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="profile" options={{ title: 'Profile' }} />
      <Drawer.Screen name="companion" options={{ title: 'Companion' }} />

      <Drawer.Screen name="vault" options={{ title: 'Vault' }} />
      <Drawer.Screen name="scenes" options={{ title: 'Scenes' }} />
      <Drawer.Screen name="support" options={{ title: 'Support' }} />
      <Drawer.Screen name="settings" options={{ title: 'Settings' }} />
      <Drawer.Screen name="resources" options={{ title: 'Resources' }} />
      <Drawer.Screen name="management" options={{ title: 'App Management' }} />
    </Drawer>
  );
}
