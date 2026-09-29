import { Suspense } from "react";
import CustomerAuth from "@/components/customer/CustomerAuth";

export default function CustomerRegisterPage() {
  return (
    <Suspense fallback={null}>
      <CustomerAuth mode="register" />
    </Suspense>
  );
}