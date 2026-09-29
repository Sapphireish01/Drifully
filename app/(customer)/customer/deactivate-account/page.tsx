"use client";

import React, { useState } from "react";
import DeactivateAccountModal from "@/components/customer/DeactivateAccountModal";

export default function DeactivateAccountPage() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div style={{ padding: "40px 0" }}>
      <DeactivateAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}