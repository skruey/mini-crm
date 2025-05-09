import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard-shell";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "CRM Dashboard for managing companies, contacts, and deals",
};

export default function DashboardPage() {
  return <DashboardShell />;
}
