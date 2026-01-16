"use client";

import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { FileQuestion } from "lucide-react";
import { useRouter } from "next/navigation";
import { Typography3XL, TypographyBase } from "@/shared/ui/typography";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="py-12">
          <div className="flex flex-col items-center gap-6">
            <FileQuestion className="h-16 w-16 text-muted-foreground" />
            <div className="text-center space-y-2">
              <Typography3XL as="h1">404 - Page Not Found</Typography3XL>
              <TypographyBase className="text-muted-foreground">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
              </TypographyBase>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => router.push("/")}>Go to Home</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
