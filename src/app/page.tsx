import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Footer, Header } from "@/components/layout";

export default function Home() {
  return (
    <div className="font-sans flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col gap-6 md:gap-8 container mx-auto items-start py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Button asChild>
            <a href="/wallet-connect">🔗 Wallet Demo</a>
          </Button>

          <Button asChild>
            <a href="/auth">🔗 Auth</a>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
