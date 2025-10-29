import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Alert, AlertTitle, AlertDescription } from "./alert";
import { AlertCircle, Terminal, Info } from "lucide-react";

const meta = {
  title: "UI/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive"],
      description: "The visual style variant of the alert",
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert className="w-[450px]">
      <Terminal />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[450px]">
      <AlertCircle />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  ),
};

export const WithoutIcon: Story = {
  render: () => (
    <Alert className="w-[450px]">
      <AlertTitle>Important Update</AlertTitle>
      <AlertDescription>
        We&apos;ve updated our terms of service. Please review them at your
        convenience.
      </AlertDescription>
    </Alert>
  ),
};

export const WithCustomIcon: Story = {
  render: () => (
    <Alert className="w-[450px]">
      <Info />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        This is an informational message with a custom icon.
      </AlertDescription>
    </Alert>
  ),
};

export const TitleOnly: Story = {
  render: () => (
    <Alert className="w-[450px]">
      <Terminal />
      <AlertTitle>Simple alert with title only</AlertTitle>
    </Alert>
  ),
};

export const DescriptionOnly: Story = {
  render: () => (
    <Alert className="w-[450px]">
      <AlertDescription>
        This alert only contains a description without a title.
      </AlertDescription>
    </Alert>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Alert className="w-[450px]">
      <AlertCircle />
      <AlertTitle>System Maintenance Scheduled</AlertTitle>
      <AlertDescription>
        We will be performing scheduled maintenance on our servers this weekend.
        During this time, some services may be temporarily unavailable. We
        apologize for any inconvenience this may cause and appreciate your
        patience. The maintenance window is expected to last approximately 4
        hours starting at 2:00 AM UTC on Saturday.
      </AlertDescription>
    </Alert>
  ),
};

export const MultipleAlerts: Story = {
  render: () => (
    <div className="space-y-4 w-[450px]">
      <Alert>
        <Terminal />
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>
          This is a default styled alert message.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>Destructive Alert</AlertTitle>
        <AlertDescription>
          This is a destructive styled alert message.
        </AlertDescription>
      </Alert>
    </div>
  ),
};
