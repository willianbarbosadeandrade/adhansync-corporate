import { http } from "@/lib/http";
import type {
  AccountData,
  AdminData,
  AdhanLibraryData,
  AnalyticsData,
  AppSettingsData,
  AudioSettingsData,
  AuthSession,
  CheckoutSession,
  DashboardData,
  LoginInput,
  PricingPlan,
  PrayerConfigMap,
  ScheduleData,
} from "../types/domain";

interface MessageResponse {
  message: string;
}

export const authApi = {
  getSession: () => http.get<AuthSession>("/auth/session"),
  login: (input: LoginInput) => http.post<AuthSession>("/auth/login", input),
  logout: () => http.post<MessageResponse>("/auth/logout"),
};

export const billingApi = {
  getPlans: () => http.get<PricingPlan[]>("/billing/plans"),
  createCheckoutSession: (input: { planId: string; billingCycle: "monthly" | "yearly" }) =>
    http.post<CheckoutSession>("/billing/checkout-session", input),
  openCustomerPortal: () => http.post<CheckoutSession>("/billing/customer-portal"),
};

export const accountApi = {
  getAccount: () => http.get<AccountData>("/account"),
  updateProfile: (input: { name: string; email: string; company: string; location: string }) =>
    http.patch<AccountData>("/account/profile", input),
  generateComplianceReport: () => http.post<MessageResponse>("/account/compliance-report"),
  downloadInstaller: (platform: "windows" | "macos" | "msi") =>
    http.post<{ url: string }>("/account/download-installer", { platform }),
};

export const appApi = {
  getDashboard: () => http.get<DashboardData>("/app/dashboard"),

  getSchedule: () => http.get<ScheduleData>("/app/schedule"),
  updateScheduleConfig: (config: PrayerConfigMap) => http.put<MessageResponse>("/app/schedule/config", { config }),

  getAudioSettings: () => http.get<AudioSettingsData>("/app/audio"),
  updateAudioSettings: (input: AudioSettingsData) => http.put<MessageResponse>("/app/audio", input),
  runAdhanSimulation: () => http.post<MessageResponse>("/app/audio/simulate-adhan"),

  getAdhanLibrary: () => http.get<AdhanLibraryData>("/app/adhan"),
  setDefaultAdhan: (trackId: string) => http.put<MessageResponse>("/app/adhan/default", { trackId }),

  getAnalytics: () => http.get<AnalyticsData>("/app/analytics"),

  getSettings: () => http.get<AppSettingsData>("/app/settings"),
  updateSettings: (input: AppSettingsData) => http.put<MessageResponse>("/app/settings", input),
  unlockLocation: (confirmation: string) =>
    http.post<MessageResponse>("/app/settings/location/unlock", { confirmation }),

  getAdminData: () => http.get<AdminData>("/app/admin"),
  syncAdminData: () => http.post<MessageResponse>("/app/admin/sync"),
  exportAdminReport: () => http.post<{ url: string }>("/app/admin/export-report"),
};
