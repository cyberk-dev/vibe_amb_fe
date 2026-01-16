"use client";

import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { Typography3XL, TypographyBase } from "@/shared/ui/typography";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="py-12">
          <div className="flex flex-col items-center gap-6">
            <ShieldAlert className="h-16 w-16 text-destructive" />
            <div className="text-center space-y-2">
              <Typography3XL as="h1">Access Denied</Typography3XL>
              <TypographyBase className="text-muted-foreground">
                You don&apos;t have permission to access this page.
              </TypographyBase>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => router.push("/")}>Go to Home</Button>
              <Button variant="outline" onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
