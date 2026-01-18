import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PlayerSeatCard } from "./player-seat-card";
import type { PlayerSeat } from "../model/types";

const meta = {
  title: "Entities/PlayerSeatCard",
  component: PlayerSeatCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PlayerSeatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data
const occupiedSeat: PlayerSeat = {
  seatNumber: 1,
  isOccupied: true,
  isReady: true,
  player: {
    name: "Manh",
    role: "PLAYER 1",
  },
};

const waitingSeat: PlayerSeat = {
  seatNumber: 2,
  isOccupied: false,
};

const occupiedNotReadySeat: PlayerSeat = {
  seatNumber: 3,
  isOccupied: true,
  isReady: false,
  player: {
    name: "Alice",
    role: "PLAYER 3",
  },
};

// Stories
export const OccupiedReady: Story = {
  args: {
    seat: occupiedSeat,
  },
};

export const Waiting: Story = {
  args: {
    seat: waitingSeat,
  },
};

export const OccupiedNotReady: Story = {
  args: {
    seat: occupiedNotReadySeat,
  },
};

// List view example
export const ListView = {
  render: () => (
    <div className="flex flex-col gap-4 w-[400px]">
      <PlayerSeatCard seat={occupiedSeat} />
      <PlayerSeatCard seat={waitingSeat} />
      <PlayerSeatCard seat={occupiedNotReadySeat} />
      <PlayerSeatCard
        seat={{
          seatNumber: 4,
          isOccupied: false,
        }}
      />
    </div>
  ),
};
