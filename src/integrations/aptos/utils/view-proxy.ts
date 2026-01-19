import { getAptosClient } from "../client";

interface ViewPayload {
  function: `${string}::${string}::${string}`;
  typeArguments?: string[];
  functionArguments?: unknown[];
}

/**
 * Proxy function for Aptos view calls that automatically routes through
 * Next.js API route on client-side to avoid CORS issues
 */
export async function viewProxy<T = unknown>(payload: ViewPayload): Promise<T> {
  // Check if we're running on the server (SSR) or client
  const isServer = typeof window === "undefined";

  if (isServer) {
    // Server-side: use Aptos client directly (no CORS issues)
    const aptos = getAptosClient();
    return (await aptos.view({
      payload: {
        function: payload.function,
        typeArguments: payload.typeArguments || [],
        functionArguments: (payload.functionArguments || []) as never[],
      },
    })) as T;
  } else {
    // Client-side: use API route proxy to avoid CORS
    const response = await fetch("/api/aptos/view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        function: payload.function,
        typeArguments: payload.typeArguments || [],
        functionArguments: payload.functionArguments || [],
      }),
    });

    if (!response.ok) {
      // Try to parse error response, but handle non-JSON errors
      let errorMessage = "View call failed";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If response is not JSON, use status text
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();

    // Validate response structure
    if (!result || typeof result !== "object" || !("data" in result)) {
      throw new Error("Invalid response format from API route");
    }

    return result.data as T;
  }
}
