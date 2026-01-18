"use client";

import { RegistrationGuard } from "@/shared";
import { PassScreen } from "@/screens/pass";

export default function PassPage() {
  return (
    <RegistrationGuard>
      <PassScreen />
    </RegistrationGuard>
  );
}
