import React, { useState } from "react";

export const AuthContext = React.createContext({
  session: null,
  initializeSession: () => null,
});

export function AuthProvider({ children }) {
  const [session, setSession] = useState(
    JSON.parse(localStorage.getItem("session"))
  );

  const initializeSession = (
    { userId, rsaPubKey, dhPubKey, sharedSecret },
    cb
  ) => {
    console.log({ userId, rsaPubKey, dhPubKey, sharedSecret });
    const sessionObj = {
      userId,
      rsaPubKey,
      dhPubKey,
      sharedSecret,
    };
    localStorage.setItem("session", JSON.stringify(sessionObj));

    setSession(sessionObj);

    if (cb) {
      cb();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        initializeSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
