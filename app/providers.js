"use client";

import { Provider as ReduxProvider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import store from "../store";
import { HelmetProvider } from 'react-helmet-async';
import CustomCookieConsent from "@/components/partials/widget/cookie-consent";

export default function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      <HelmetProvider>
        <ReduxProvider store={store}>
          {children}
          <CustomCookieConsent />
        </ReduxProvider>
      </HelmetProvider>
    </SessionProvider>
  );
}