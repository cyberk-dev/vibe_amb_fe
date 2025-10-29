import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Label } from "./label";
import { Input } from "./input";
import { Info } from "lucide-react";

const meta = {
  title: "UI/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Label",
  },
};

export const WithInput: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="username">
        <Info className="h-4 w-4" />
        Username
      </Label>
      <Input id="username" placeholder="Username" />
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="required">
        Full Name <span className="text-destructive">*</span>
      </Label>
      <Input id="required" placeholder="John Doe" />
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="bio">Bio</Label>
      <Input id="bio" placeholder="Tell us about yourself" />
      <p className="text-sm text-muted-foreground">
        This will be displayed on your profile.
      </p>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div
      className="grid w-full max-w-sm items-center gap-1.5"
      data-disabled="true"
    >
      <Label htmlFor="disabled">Disabled Field</Label>
      <Input id="disabled" placeholder="Disabled" disabled />
    </div>
  ),
};

export const MultipleFields: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-sm">
      <div className="grid items-center gap-1.5">
        <Label htmlFor="first-name">First Name</Label>
        <Input id="first-name" placeholder="John" />
      </div>
      <div className="grid items-center gap-1.5">
        <Label htmlFor="last-name">Last Name</Label>
        <Input id="last-name" placeholder="Doe" />
      </div>
      <div className="grid items-center gap-1.5">
        <Label htmlFor="email-multi">Email</Label>
        <Input type="email" id="email-multi" placeholder="john@example.com" />
      </div>
    </div>
  ),
};
