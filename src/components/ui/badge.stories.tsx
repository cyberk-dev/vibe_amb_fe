import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "./badge";
import { Check, X, AlertCircle } from "lucide-react";

const meta = {
  title: "UI/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline"],
      description: "The visual style variant of the badge",
    },
    asChild: {
      control: "boolean",
      description:
        "Change the component to the HTML tag or custom component of the children",
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Badge",
    variant: "default",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

export const Destructive: Story = {
  args: {
    children: "Destructive",
    variant: "destructive",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Check />
        Success
      </>
    ),
  },
};

export const WithIconDestructive: Story = {
  args: {
    variant: "destructive",
    children: (
      <>
        <X />
        Error
      </>
    ),
  },
};

export const WithIconOutline: Story = {
  args: {
    variant: "outline",
    children: (
      <>
        <AlertCircle />
        Warning
      </>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>
        <Check />
        Success
      </Badge>
      <Badge variant="secondary">
        <AlertCircle />
        Info
      </Badge>
      <Badge variant="destructive">
        <X />
        Error
      </Badge>
      <Badge variant="outline">
        <Check />
        Complete
      </Badge>
    </div>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm">Active:</span>
        <Badge variant="default">
          <Check />
          Active
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Pending:</span>
        <Badge variant="secondary">
          <AlertCircle />
          Pending
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Error:</span>
        <Badge variant="destructive">
          <X />
          Failed
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Draft:</span>
        <Badge variant="outline">Draft</Badge>
      </div>
    </div>
  ),
};
