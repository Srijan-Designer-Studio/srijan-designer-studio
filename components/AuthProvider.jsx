'use client'; // This MUST be here for it to work

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}