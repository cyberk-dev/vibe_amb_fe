import { NextRequest, NextResponse } from "next/server";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { GasStationClient, GasStationTransactionSubmitter } from "@aptos-labs/gas-station-client";

// CORS headers for API route
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Create Aptos client with Origin header for server-side requests
function createAptosClientForApiRoute(requestOrigin?: string | null): Aptos {
  const NETWORK = process.env.NEXT_PUBLIC_APTOS_NETWORK === "mainnet" ? Network.MAINNET : Network.TESTNET;
  const API_KEY = process.env.NEXT_PUBLIC_APTOS_API_KEY;
  const gasStationApiKey = process.env.NEXT_PUBLIC_APTOS_GAS_STATION_API_KEY;

  // Get origin: prioritize request origin, then env vars, then fallback
  const getOrigin = () => {
    // 1. Use origin from request headers (most accurate for Vercel)
    if (requestOrigin) {
      return requestOrigin;
    }

    // 2. Use Vercel URL (automatically set by Vercel)
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }

    // 3. Use custom app URL from env
    if (process.env.NEXT_PUBLIC_APP_URL) {
      return process.env.NEXT_PUBLIC_APP_URL;
    }

    // 4. Development: use localhost
    if (process.env.NODE_ENV === "development") {
      return "http://localhost:3000";
    }

    // 5. Production fallback
    return "https://vibe-amb-fe.vercel.app";
  };

  const origin = getOrigin();

  // Client config with Origin header (required by Aptos API)
  const clientConfig = API_KEY
    ? {
        API_KEY,
        HEADERS: {
          Origin: origin,
        },
      }
    : {
        HEADERS: {
          Origin: origin,
        },
      };

  if (gasStationApiKey) {
    const gasStationClient = new GasStationClient({
      network: NETWORK,
      apiKey: gasStationApiKey,
    });

    const config = new AptosConfig({
      network: NETWORK,
      clientConfig,
      pluginSettings: {
        TRANSACTION_SUBMITTER: new GasStationTransactionSubmitter(gasStationClient),
      },
    });

    return new Aptos(config);
  }

  return new Aptos(
    new AptosConfig({
      network: NETWORK,
      clientConfig,
    }),
  );
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { function: functionName, typeArguments, functionArguments } = body;

    // Validation
    if (!functionName || typeof functionName !== "string") {
      return NextResponse.json(
        { error: "Function name is required and must be a string" },
        { status: 400, headers: corsHeaders },
      );
    }

    // Validate function name format (should be module::function)
    if (!functionName.includes("::")) {
      return NextResponse.json(
        { error: "Function name must be in format 'module::function'" },
        { status: 400, headers: corsHeaders },
      );
    }

    // Get origin from request headers (for Vercel compatibility)
    const requestOrigin = request.headers.get("origin") || request.headers.get("referer");

    // Create Aptos client with Origin header from request
    const aptos = createAptosClientForApiRoute(requestOrigin);
    const result = await aptos.view({
      payload: {
        function: functionName as `${string}::${string}::${string}`,
        typeArguments: Array.isArray(typeArguments) ? typeArguments : [],
        functionArguments: Array.isArray(functionArguments) ? functionArguments : [],
      },
    });

    return NextResponse.json({ data: result }, { headers: corsHeaders });
  } catch (error) {
    console.error("Aptos view error:", error);

    // Handle different error types
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorDetails = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
      {
        error: errorMessage,
        ...(process.env.NODE_ENV === "development" && errorDetails ? { details: errorDetails } : {}),
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
