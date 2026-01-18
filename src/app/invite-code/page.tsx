import type { Metadata } from "next";
import { InviteCodeScreen } from "@/screens/invite-code";

export const metadata: Metadata = {
  title: "Enter Invite Code - Horse of the Year",
  description: "Enter your invite code to join the Horse of the Year game by VIBE Ambassador",
};

export default function InviteCodePage() {
  return <InviteCodeScreen />;
}
