import {
  BookOpen,
  Box,
  CalendarDays,
  ClipboardCheck,
  Gauge,
  LayoutDashboard,
  LineChart,
  MessageCircle,
  Stethoscope,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { NavIconName } from "@/lib/navigation";

export const NAV_ICONS: Record<NavIconName, LucideIcon> = {
  dashboard: LayoutDashboard,
  tutor: MessageCircle,
  training: ClipboardCheck,
  cases: Stethoscope,
  courses: BookOpen,
  anatomy: Box,
  level: Gauge,
  plan: CalendarDays,
  progress: LineChart,
  profile: UserRound,
};
