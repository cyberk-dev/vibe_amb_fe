import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Separator } from "./separator";

const meta = {
  title: "UI/Separator",
  component: Separator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "The orientation of the separator",
    },
    decorative: {
      control: "boolean",
      description: "Whether the separator is purely decorative or semantic",
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-[300px]">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Section Title</h4>
        <p className="text-sm text-muted-foreground">
          Some content above the separator
        </p>
      </div>
      <Separator className="my-4" />
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Another Section</h4>
        <p className="text-sm text-muted-foreground">
          Some content below the separator
        </p>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-[100px] items-center">
      <div className="px-4">
        <h4 className="text-sm font-medium">Left Section</h4>
        <p className="text-xs text-muted-foreground">Content on the left</p>
      </div>
      <Separator orientation="vertical" />
      <div className="px-4">
        <h4 className="text-sm font-medium">Right Section</h4>
        <p className="text-xs text-muted-foreground">Content on the right</p>
      </div>
    </div>
  ),
};

export const InList: Story = {
  render: () => (
    <div className="w-[300px]">
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium">Item 1</h4>
          <p className="text-sm text-muted-foreground">
            Description for item 1
          </p>
        </div>
        <Separator />
        <div>
          <h4 className="text-sm font-medium">Item 2</h4>
          <p className="text-sm text-muted-foreground">
            Description for item 2
          </p>
        </div>
        <Separator />
        <div>
          <h4 className="text-sm font-medium">Item 3</h4>
          <p className="text-sm text-muted-foreground">
            Description for item 3
          </p>
        </div>
      </div>
    </div>
  ),
};

export const InMenu: Story = {
  render: () => (
    <div className="w-[200px] rounded-md border p-2">
      <div className="px-2 py-1.5 text-sm font-medium">Menu Item 1</div>
      <div className="px-2 py-1.5 text-sm font-medium">Menu Item 2</div>
      <Separator className="my-1" />
      <div className="px-2 py-1.5 text-sm font-medium">Menu Item 3</div>
      <div className="px-2 py-1.5 text-sm font-medium">Menu Item 4</div>
      <Separator className="my-1" />
      <div className="px-2 py-1.5 text-sm font-medium text-destructive">
        Delete
      </div>
    </div>
  ),
};

export const WithText: Story = {
  render: () => (
    <div className="w-[300px]">
      <div className="flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>
    </div>
  ),
};

export const MultipleSections: Story = {
  render: () => (
    <div className="w-[400px] space-y-6">
      <section>
        <h3 className="text-lg font-semibold">Section 1</h3>
        <p className="text-sm text-muted-foreground mt-2">
          This is the first section with some content.
        </p>
      </section>
      <Separator />
      <section>
        <h3 className="text-lg font-semibold">Section 2</h3>
        <p className="text-sm text-muted-foreground mt-2">
          This is the second section with different content.
        </p>
      </section>
      <Separator />
      <section>
        <h3 className="text-lg font-semibold">Section 3</h3>
        <p className="text-sm text-muted-foreground mt-2">
          This is the third section with even more content.
        </p>
      </section>
    </div>
  ),
};

export const ThinAndThick: Story = {
  render: () => (
    <div className="w-[300px] space-y-6">
      <div>
        <p className="text-sm mb-2">Default thickness:</p>
        <Separator />
      </div>
      <div>
        <p className="text-sm mb-2">Thicker separator:</p>
        <Separator className="h-[2px]" />
      </div>
      <div>
        <p className="text-sm mb-2">Even thicker:</p>
        <Separator className="h-1" />
      </div>
    </div>
  ),
};
