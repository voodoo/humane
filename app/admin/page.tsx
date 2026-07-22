import type { Metadata } from "next";
import { AdminSignupRecords } from "@/components/AdminSignupRecords";

export const metadata: Metadata = {
  title: "Humane Society · Admin signups",
  description: "Review and edit local volunteer signup records by month.",
};

export default function AdminPage() {
  return <AdminSignupRecords />;
}
