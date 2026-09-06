import { Suspense } from "react";
import CustomerAuth from "@/components/customer/CustomerAuth";

export default function CustomerLoginPage() {
	return (
		<Suspense fallback={null}>
			<CustomerAuth mode="login" />
		</Suspense>
	);
}