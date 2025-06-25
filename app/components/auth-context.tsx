// import React, { createContext, useContext, useState } from "react";

// type AuthContextType = {
//   accessToken: string | null;
//   setAccessToken: (token: string | null) => void;
// };

// const AuthContext = createContext<AuthContextType>({
//   accessToken: null,
//   setAccessToken: () => {},
// });

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [accessToken, setAccessToken] = useState<string | null>(null);

//   return (
//     <AuthContext.Provider value={{ accessToken, setAccessToken }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  isReady: boolean;
};

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  setAccessToken: () => {},
  isReady: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Try to load token from storage
    const loadStoredToken = async () => {
      const stored = await AsyncStorage.getItem("accessToken");
      if (stored) {
        setAccessToken(stored);
      }
      setIsReady(true); // done loading
    };
    loadStoredToken();
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, isReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
