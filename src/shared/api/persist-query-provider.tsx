"use client";

import { QueryClient } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { createStore, del, get, set } from "idb-keyval";
import type { PersistedClient, Persister } from "@tanstack/query-persist-client-core";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

interface QueryProviderProps {
  children: ReactNode;
}

const customStore = createStore(process.env.NEXT_PUBLIC_IDB_NAME || "ATLAS-DEV", "keyval");

const createIndexedDBPersister = (idbValidKey: IDBValidKey = "atlas") => {
  return {
    persistClient: async (client: PersistedClient) => {
      try {
        await set(idbValidKey, client, customStore);
      } catch (error) {
        console.error("Failed to persist query client to IndexedDB:", error);
      }
    },
    restoreClient: async () => {
      try {
        return await get<PersistedClient>(idbValidKey, customStore);
      } catch (error) {
        console.error("Failed to restore query client from IndexedDB:", error);
        return undefined;
      }
    },
    removeClient: async () => {
      try {
        await del(idbValidKey, customStore);
      } catch (error) {
        console.error("Failed to remove query client from IndexedDB:", error);
      }
    },
  } as Persister;
};

const persister = createIndexedDBPersister("atlas");

export const PersistQueryProvider = ({ children }: QueryProviderProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {},
      }),
  );

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            return query.meta?.persist === true && query.state.status === "success";
          },
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
};
