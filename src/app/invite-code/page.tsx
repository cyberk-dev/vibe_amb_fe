import type { Metadata } from "next";
import { InviteCodeScreen } from "@/screens/invite-code";

export const metadata: Metadata = {
  title: "Enter Invite Code - Lucky Money Battle Royale",
  description: "Enter your invite code to join the Lucky Money Battle Royale game by VIBE Ambassador",
};

export default function InviteCodePage() {
  return <InviteCodeScreen />;
}
