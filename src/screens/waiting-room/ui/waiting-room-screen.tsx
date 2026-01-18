"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { PlayerSeat } from "@/entities/player-seat";
import { WaitingRoom } from "@/widgets/waiting-room";
import { useSoundToggle } from "@/shared/lib/stores";

/** Constants for the waiting room */
const MAX_SEATS = 20;
const INITIAL_COUNTDOWN = 60;
const PLAYER_JOIN_INTERVAL_MS = 2000; // New player joins every 2 seconds

/** Fake player names for simulation */
const FAKE_PLAYER_NAMES = [
  "Manh",
  "Alex",
  "Sarah",
  "John",
  "Emily",
  "David",
  "Lisa",
  "Mike",
  "Anna",
  "Chris",
  "Emma",
  "James",
  "Olivia",
  "Daniel",
  "Sophia",
  "William",
  "Ava",
  "Joseph",
  "Mia",
  "Thomas",
];

/**
 * Generate initial empty seats
 */
function generateInitialSeats(): PlayerSeat[] {
  return Array.from({ length: MAX_SEATS }, (_, index) => ({
    seatNumber: index + 1,
    isOccupied: false,
    isReady: false,
    player: undefined,
  }));
}

/**
 * Add a player to the first empty seat
 */
function addPlayerToSeats(seats: PlayerSeat[], playerIndex: number): PlayerSeat[] {
  const newSeats = [...seats];
  const emptyIndex = newSeats.findIndex((seat) => !seat.isOccupied);

  if (emptyIndex !== -1) {
    newSeats[emptyIndex] = {
      ...newSeats[emptyIndex],
      isOccupied: true,
      isReady: true,
      player: {
        name: FAKE_PLAYER_NAMES[playerIndex % FAKE_PLAYER_NAMES.length],
        role: `PLAYER ${emptyIndex + 1}`,
      },
    };
  }

  return newSeats;
}

/**
 * WaitingRoomScreen - Screen for the waiting room / matchmaking
 *
 * Features:
 * - 20 seats grid display
 * - Auto-filling seats with fake players (simulation)
 * - 60s countdown when all seats are full
 * - Sound toggle
 *
 * Flow:
 * - Users enter after joining matchmaking from landing page
 * - Wait for all 20 seats to fill
 * - When full, 60s countdown starts
 * - After countdown, game starts (navigation to game screen)
 */
export function WaitingRoomScreen() {
  const router = useRouter();
  const { isMuted, toggleMute } = useSoundToggle();
  const [seats, setSeats] = useState<PlayerSeat[]>(generateInitialSeats);
  const [countdown, setCountdown] = useState(INITIAL_COUNTDOWN);
  const playerIndexRef = useRef(0);

  // Count connected players
  const connectedPlayers = seats.filter((seat) => seat.isOccupied).length;
  const isRoomFull = connectedPlayers >= MAX_SEATS;

  // Simulate players joining (auto-fill seats)
  useEffect(() => {
    if (isRoomFull) return;

    const interval = setInterval(() => {
      setSeats((prevSeats) => {
        const currentConnected = prevSeats.filter((seat) => seat.isOccupied).length;
        if (currentConnected >= MAX_SEATS) {
          return prevSeats;
        }
        const newSeats = addPlayerToSeats(prevSeats, playerIndexRef.current);
        playerIndexRef.current += 1;
        return newSeats;
      });
    }, PLAYER_JOIN_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isRoomFull]);

  // Countdown when room is full
  useEffect(() => {
    if (!isRoomFull) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Navigate to /pass page when countdown reaches 0
          router.push("/pass");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRoomFull, router]);

  return (
    <WaitingRoom
      seats={seats}
      maxSeats={MAX_SEATS}
      countdown={countdown}
      isCountdownActive={isRoomFull}
      isMuted={isMuted}
      onToggleMute={toggleMute}
    />
  );
}
