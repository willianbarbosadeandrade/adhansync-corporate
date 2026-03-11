export type PlanTier = "personal" | "professional" | "enterprise";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  company: string;
  location: string;
  plan: PlanTier;
  planLabel: string;
  roles?: string[];
}

export interface AuthSession {
  user: SessionUser;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface PricingPlan {
  id: PlanTier;
  name: string;
  description: string;
  highlighted: boolean;
  currency: string;
  monthlyPriceCents: number | null;
  yearlyPriceCents: number | null;
  features: string[];
}

export interface CheckoutSession {
  checkoutUrl: string;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  kind: "desktop" | "laptop" | "server";
  status: "active" | "inactive";
  lastActive: string;
}

export interface BillingRecord {
  id: string;
  date: string;
  description: string;
  amountCents: number;
  currency: string;
  status: "paid" | "pending" | "failed" | "refunded";
  invoiceUrl?: string;
}

export interface PaymentMethod {
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
}

export interface Subscription {
  plan: PlanTier;
  planLabel: string;
  status: "active" | "trialing" | "past_due" | "canceled";
  monthlyPriceCents: number | null;
  yearlyPriceCents: number | null;
  currency: string;
  billingCycle: "monthly" | "yearly";
  renewDate: string;
  maxDevices: number;
  activeDevices: number;
  autoStops: number;
  daysActive: number;
  licenseKey: string;
}

export interface AccountProfile {
  id: string;
  name: string;
  email: string;
  company: string;
  location: string;
}

export interface AccountData {
  profile: AccountProfile;
  subscription: Subscription;
  devices: Device[];
  billingHistory: BillingRecord[];
  paymentMethod: PaymentMethod | null;
}

export interface Prayer {
  name: string;
  nameAr: string;
  time: string;
  icon?: string;
}

export interface PrayerConfig {
  pauseBefore: number;
  pauseDuration: number;
  enabled: boolean;
}

export type PrayerConfigMap = Record<string, PrayerConfig>;

export interface DashboardData {
  locationLabel: string;
  dateIso: string;
  prayers: Prayer[];
  configs: PrayerConfigMap;
  audioEngineStatus: "active" | "paused";
  masterVolume: number;
}

export interface WeekPrayerDay {
  day: string;
  dateLabel: string;
  prayers: Record<string, string>;
}

export interface CalendarDay {
  day: number;
  isToday: boolean;
}

export interface MultiLocation {
  id: string;
  city: string;
  country: string;
  timezone: string;
  fajrTime: string;
  active: boolean;
}

export interface ScheduleData {
  locationLabel: string;
  latitude: number;
  longitude: number;
  monthLabel: string;
  prayers: Prayer[];
  config: PrayerConfigMap;
  week: WeekPrayerDay[];
  monthDays: CalendarDay[];
  selectedDay: number;
  multiLocations: MultiLocation[];
}

export interface BrowserOption {
  id: string;
  name: string;
}

export interface AudioSettingsData {
  masterVolume: number;
  fadeDurationSeconds: number;
  systemPaused: boolean;
  browserOptions: BrowserOption[];
  selectedBrowserId: string;
  browserMuteDuringPrayer: boolean;
  browserVolume: number;
  systemMuteDuringPrayer: boolean;
  systemVolume: number;
}

export interface AdhanTrack {
  id: string;
  name: string;
  reciter: string;
  region: string;
  durationSeconds: number | null;
  premium: boolean;
  isDefault: boolean;
}

export interface AdhanLibraryData {
  tracks: AdhanTrack[];
  activeTrackId: string | null;
}

export interface AnalyticsPoint {
  label: string;
  value: number;
}

export interface AnalyticsData {
  totalStops: number;
  compliancePercentage: number;
  averagePauseMinutes: number;
  activeStreakDays: number;
  weeklyStops: Array<{ day: string; stops: number; prayers: number }>;
  monthlyCompliance: Array<{ week: string; compliance: number }>;
  prayerBreakdown: Array<{ name: string; value: number; fill: string }>;
  hourlyStops: Array<{ hour: string; stops: number }>;
}

export interface CalculationMethod {
  id: string;
  name: string;
  fajrAngle: number;
  ishaAngle: number;
}

export interface AppSettingsData {
  locationLocked: boolean;
  currentLocation: string;
  latitude: string;
  longitude: string;
  lockedAt: string;
  calculationMethodId: string;
  calculationMethods: CalculationMethod[];
  quickLocations: Array<{ label: string; lat: string; lng: string }>;
  startWithOS: boolean;
  minimizeToTray: boolean;
  showCountdown: boolean;
  darkMode: boolean;
  notifyBeforeMinutes: number;
  desktopNotifications: boolean;
  soundNotifications: boolean;
}

export interface Department {
  id: string;
  name: string;
  seats: number;
  active: number;
  compliance: number;
}

export interface AdminEvent {
  id: string;
  time: string;
  event: string;
  department: string;
  status: "success" | "error" | "info";
}

export interface AdminData {
  companyName: string;
  departments: Department[];
  recentEvents: AdminEvent[];
}
