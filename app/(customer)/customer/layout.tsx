import type { Metadata } from "next";
import CustomerShell from "@/components/customer/CustomerShell";

export const metadata: Metadata = {
  title: { default: "Customer Dashboard", template: "%s | Drifully" },
  robots: { index: false, follow: false },
};

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <CustomerShell>{children}</CustomerShell>;
}