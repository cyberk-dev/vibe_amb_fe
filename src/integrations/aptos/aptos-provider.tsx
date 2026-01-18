"use client";

import dynamic from "next/dynamic";
import { PropsWithChildren } from "react";

// Dynamically import the actual provider with ssr: false to prevent
// @aptos-labs/ts-sdk from being bundled in server components
const AptosProviderInner = dynamic(() => import("./aptos-provider-inner").then((mod) => mod.AptosProviderInner), {
  ssr: false,
  loading: () => null,
});

export function AptosProvider({ children }: PropsWithChildren) {
  return <AptosProviderInner>{children}</AptosProviderInner>;
}
