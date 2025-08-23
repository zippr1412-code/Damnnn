import React, { useState } from "react";
import { AppContext } from "./AppContext";

export const AppProvider = ({ children }) => {
  // Keep app-level (non-auth) state here (themes, match filters, etc.)
  const [appReady, setAppReady] = useState(true);

  return (
    <AppContext.Provider value={{ appReady, setAppReady }}>
      {children}
    </AppContext.Provider>
  );
};
