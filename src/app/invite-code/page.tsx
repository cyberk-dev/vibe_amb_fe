"use client";

import { InviteCodeScreen } from "@/screens/invite-code";

/**
 * Invite Code Page - Entry point for new users
 *
 * NOTE: This page does NOT use GameFlowGuard because:
 * 1. New users are not registered yet (query would fail with E_NOT_REGISTERED)
 * 2. This is the entry point - no redirection needed
 * 3. InviteCodeScreen handles its own 3-step flow
 */
export default function InviteCodePage() {
  return <InviteCodeScreen />;
}
