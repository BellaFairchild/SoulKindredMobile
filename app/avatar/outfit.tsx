import React, { useMemo } from "react";
import { View, Text, Pressable, StyleSheet, Linking } from "react-native";
import { WebView } from "react-native-webview";
import { useRouter } from "expo-router";

import { useSoulKindred } from "../../src/state/useSoulKindred";
import { extractRpmId } from "../../src/utils/rpm";
import { rpm2dUrl } from "../../src/utils/rpm2d";
import { cacheRpmIcon, rpmIconKey } from "../../src/services/cache/rpmIconCache";

export default function OutfitCreator() {
  const router = useRouter();

  const rpmAvatarId = useSoulKindred((s) => s.rpmAvatarId);
  const setFriend = useSoulKindred((s) => s.setFriend);

  // add a simple version counter inside your store later if you want.
  const [version, bumpVersion] = React.useState(1);

  const creatorUrl = useMemo(() => {
    const base = "https://soulkindred.readyplayer.me/avatar?frameApi";
    return rpmAvatarId ? `${base}&id=${rpmAvatarId}` : base;
  }, [rpmAvatarId]);

  const onMessage = async (event: any) => {
    try {
      const raw = event?.nativeEvent?.data;
      if (!raw) return;

      let msg: any = raw;
      if (typeof raw === "string" && raw.trim().startsWith("{")) msg = JSON.parse(raw);

      const eventName = msg?.eventName;
      const data = msg?.data ?? msg;

      if (eventName === "v1.frame.ready") return;

      const glbUrl =
        (eventName === "v1.avatar.exported" && data?.url) ||
        data?.url ||
        data?.avatarUrl ||
        (typeof data === "string" ? data : undefined);

      if (!glbUrl || typeof glbUrl !== "string") return;
      if (!glbUrl.includes("models.readyplayer.me")) return;

      const id = extractRpmId(glbUrl);
      if (!id) return;

      const glb = `https://models.readyplayer.me/${id}.glb`;
      const remoteIcon = rpm2dUrl(id, { size: 256, camera: "portrait", pose: "relaxed" });

      const nextVersion = version + 1;
      bumpVersion(nextVersion);

      const localIcon = await cacheRpmIcon(remoteIcon, rpmIconKey(id, nextVersion));

      setFriend({ id, glbUrl: glb, iconUrl: localIcon });

      router.back();
    } catch {
      // no crash
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} style={styles.btn}>
          <Text style={styles.btnText}>Close</Text>
        </Pressable>
        <Text style={styles.title}>Change Outfit</Text>
        <View style={{ width: 64 }} />
      </View>

      <WebView
        source={{ uri: creatorUrl }}
        onMessage={onMessage}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        javaScriptCanOpenWindowsAutomatically
        setSupportMultipleWindows={false}
        originWhitelist={["*"]}
        onShouldStartLoadWithRequest={(req) => {
          const url = req.url ?? "";

          // If RPM tries to open login / terms / auth in a popup,
          // open it externally so Save/Export actually works.
          if (
            !url.includes("readyplayer.me") &&
            (url.startsWith("http://") || url.startsWith("https://"))
          ) {
            Linking.openURL(url);
            return false;
          }

          return true;
        }}
        style={{ flex: 1 }}
      />

      <Text style={styles.hint}>Export your avatar in the creator. Soul Kindred updates your Friend instantly.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  top: {
    paddingTop: 54,
    paddingHorizontal: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { color: "#fff", fontWeight: "900", fontSize: 16 },
  btn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.10)" },
  btnText: { color: "#fff", fontWeight: "900" },
  hint: { color: "rgba(255,255,255,0.6)", fontWeight: "700", padding: 12, textAlign: "center" },
});
