import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { RootStackParamList } from "../navigation/rootStackParamList";
import {
  consumePendingAuthenticatedDestination,
  getExpectedPrivacyVersion,
  getExpectedTosVersion,
  isPostAuthComplianceCompleteAsync,
  loadComplianceState,
  saveComplianceState,
  type CompliancePersisted,
} from "./consentStorage";
import { fetchLegalVersionsForCompliance } from "./legalDocumentsApi";
import {
  resetNavigationToAuthenticated,
  resetNavigationToEmailLogin,
} from "../navigation/rootNavigationRef";

type Props = NativeStackScreenProps<RootStackParamList, "ComplianceOnboarding">;

export function ComplianceOnboardingScreen({ route }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const step = route.params?.step ?? "legal";
  const [loading, setLoading] = useState(true);
  const [resolvedStep, setResolvedStep] = useState<"age" | "legal">("age");
  const [tos, setTos] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [legalVersions, setLegalVersions] = useState<{ tos: string; privacy: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const s = await loadComplianceState();
      if (cancelled) return;
      const st =
        step === "age" || step === "legal" ? step : !s.age_verified ? "age" : "legal";
      setResolvedStep(st);

      if (st === "legal") {
        const versions = await fetchLegalVersionsForCompliance();
        if (cancelled) return;
        setLegalVersions(versions);
        setTos(s.tos_accepted && s.tos_version_accepted === versions.tos);
        setPrivacy(s.privacy_accepted && s.privacy_version_accepted === versions.privacy);
        setAnalytics(s.analytics_consent === true);
        setMarketing(s.marketing_consent === true);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [step]);

  const applyLegalStateFromStorage = useCallback(async (s: CompliancePersisted) => {
    const versions = await fetchLegalVersionsForCompliance();
    setLegalVersions(versions);
    setTos(s.tos_accepted && s.tos_version_accepted === versions.tos);
    setPrivacy(s.privacy_accepted && s.privacy_version_accepted === versions.privacy);
    setAnalytics(s.analytics_consent === true);
    setMarketing(s.marketing_consent === true);
  }, []);

  const onAgeConfirm = useCallback(async () => {
    const prev = await loadComplianceState();
    const next: CompliancePersisted = {
      ...prev,
      age_verified: true,
    };
    await saveComplianceState(next);
    const token = await AsyncStorage.getItem("LOGIN_TOKEN");
    if (token) {
      const fresh = await loadComplianceState();
      if (!(await isPostAuthComplianceCompleteAsync(fresh))) {
        await applyLegalStateFromStorage(fresh);
        setResolvedStep("legal");
        navigation.setParams({ step: "legal" });
        return;
      }
      resetNavigationToAuthenticated("Dashboard");
      return;
    }
    resetNavigationToEmailLogin();
  }, [navigation, applyLegalStateFromStorage]);

  const onLegalContinue = useCallback(async () => {
    if (!tos || !privacy) return;
    const prev = await loadComplianceState();
    const now = new Date().toISOString();
    const tv = legalVersions?.tos ?? getExpectedTosVersion();
    const pv = legalVersions?.privacy ?? getExpectedPrivacyVersion();
    const next: CompliancePersisted = {
      ...prev,
      tos_accepted: true,
      privacy_accepted: true,
      tos_version_accepted: tv,
      privacy_version_accepted: pv,
      consent_timestamp: now,
      analytics_consent: analytics,
      marketing_consent: marketing,
    };
    await saveComplianceState(next);

    try {
      const analyticsNative = require("@react-native-firebase/analytics").default;
      await analyticsNative().setAnalyticsCollectionEnabled(analytics);
    } catch {
      /* stub or missing native module */
    }

    const pending = await consumePendingAuthenticatedDestination();
    if (pending) {
      resetNavigationToAuthenticated(pending.name, pending.params);
    } else {
      resetNavigationToAuthenticated("Dashboard");
    }
  }, [tos, privacy, analytics, marketing, legalVersions]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#c44d5c" />
      </SafeAreaView>
    );
  }

  if (resolvedStep === "age") {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>Age verification</Text>
          <Text style={styles.body}>
            EtOH Coach is intended for adults. Please confirm you are 18 or older.
          </Text>
          <Pressable style={styles.primaryBtn} onPress={() => void onAgeConfirm()}>
            <Text style={styles.primaryBtnText}>I am 18 or older</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const tosV = legalVersions?.tos ?? getExpectedTosVersion();
  const privacyV = legalVersions?.privacy ?? getExpectedPrivacyVersion();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Terms & privacy</Text>
        <Text style={styles.body}>
          Please review and accept our policies. Content is managed in the EtOH Coach admin panel and
          opens here in the app.
        </Text>

        <Pressable style={styles.row} onPress={() => setTos((v) => !v)} accessibilityRole="checkbox">
          <View style={[styles.box, tos && styles.boxOn]} />
          <Text style={styles.rowText}>
            I accept the{" "}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("LegalDocument", { kind: "terms" })}
            >
              Terms of Service
            </Text>{" "}
            (v{tosV})
          </Text>
        </Pressable>

        <Pressable
          style={styles.row}
          onPress={() => setPrivacy((v) => !v)}
          accessibilityRole="checkbox"
        >
          <View style={[styles.box, privacy && styles.boxOn]} />
          <Text style={styles.rowText}>
            I accept the{" "}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate("LegalDocument", { kind: "privacy" })}
            >
              Privacy Policy
            </Text>{" "}
            (v{privacyV})
          </Text>
        </Pressable>

        <Text style={styles.subheading}>Analytics</Text>
        <Text style={styles.bodySmall}>
          Help us improve the app with anonymous usage statistics (you can change this later in
          settings when supported).
        </Text>
        <Pressable style={styles.row} onPress={() => setAnalytics((v) => !v)} accessibilityRole="checkbox">
          <View style={[styles.box, analytics && styles.boxOn]} />
          <Text style={styles.rowText}>Allow analytics</Text>
        </Pressable>

        <Text style={styles.subheading}>Marketing (optional)</Text>
        <Pressable style={styles.row} onPress={() => setMarketing((v) => !v)} accessibilityRole="checkbox">
          <View style={[styles.box, marketing && styles.boxOn]} />
          <Text style={styles.rowText}>I agree to receive marketing communications</Text>
        </Pressable>

        <Pressable
          style={[styles.primaryBtn, (!tos || !privacy) && styles.primaryBtnDisabled]}
          disabled={!tos || !privacy}
          onPress={() => void onLegalContinue()}
        >
          <Text style={styles.primaryBtnText}>Continue</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  scroll: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#1a1a1a" },
  subheading: { fontSize: 16, fontWeight: "600", marginTop: 20, marginBottom: 8, color: "#1a1a1a" },
  body: { fontSize: 15, lineHeight: 22, color: "#444", marginBottom: 8 },
  bodySmall: { fontSize: 14, lineHeight: 20, color: "#555", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "flex-start", marginTop: 14 },
  box: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#888",
    marginRight: 12,
    borderRadius: 4,
    marginTop: 2,
  },
  boxOn: { backgroundColor: "#c44d5c", borderColor: "#c44d5c" },
  rowText: { flex: 1, fontSize: 15, lineHeight: 22, color: "#222" },
  link: { color: "#1a73e8", textDecorationLine: "underline" },
  primaryBtn: {
    marginTop: 28,
    backgroundColor: "#c44d5c",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryBtnDisabled: { opacity: 0.45 },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
