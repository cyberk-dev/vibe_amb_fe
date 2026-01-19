"use client";

import { WaitingRoom } from "@/widgets/waiting-room";
import { useWaitingRoomFlow } from "../lib/use-waiting-room-flow";

/**
 * WaitingRoomScreen - Screen for the waiting room / matchmaking
 *
 * Features:
 * - Polls contract for real player data (staggered 3.5-6.5s intervals)
 * - Dynamic seats grid display with actual player names
 * - Countdown starts when 5 players join
 * - Redirects to /pass when admin starts game
 *
 * Flow:
 * - Users see this screen after joining game from landing
 * - Real players populate seats in join order
 * - When 5+ players join, countdown starts
 * - When admin starts game (status → SELECTION), redirects to /pass
 */
export function WaitingRoomScreen() {
  const { seats, isCountdownActive, countdown } = useWaitingRoomFlow();

  return <WaitingRoom seats={seats} countdown={countdown} isCountdownActive={isCountdownActive} />;
}
