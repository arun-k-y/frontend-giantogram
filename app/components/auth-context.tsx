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

// context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  accessToken: string | null;
  email: string | null;
  mobile: string | null;
  isDeactivated: boolean;
  setAuthData: (
    data: {
      accessToken?: string | null;
      email?: string | null;
      mobile?: string | null;
      isDeactivated?: boolean;
    },
    remember?: boolean
  ) => Promise<void>; // <--- should be async if using AsyncStorage
  isReady: boolean;
};

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  email: null,
  mobile: null,
  isDeactivated: false,
  setAuthData: async () => {},
  isReady: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [mobile, setMobile] = useState<string | null>(null);
  const [isDeactivated, setIsDeactivated] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      const token = await AsyncStorage.getItem("userToken");
      const email = await AsyncStorage.getItem("userEmail");
      const mobile = await AsyncStorage.getItem("userMobile");
      const isDeactivated = await AsyncStorage.getItem("isDeactivated");

      if (token) setAccessToken(token);
      if (email) setEmail(email);
      if (mobile) setMobile(mobile);
      if (isDeactivated) setIsDeactivated(isDeactivated === "true");

      setIsReady(true);
    };

    load();
  }, []);

  const setAuthData = async (
    {
      accessToken,
      email,
      mobile,
      isDeactivated = false,
    }: {
      accessToken?: string | null;
      email?: string | null;
      mobile?: string | null;
      isDeactivated?: boolean;
    },
    remember: boolean = false
  ) => {
    setAccessToken(accessToken ?? null);
    setEmail(email ?? null);
    setMobile(mobile ?? null);
    setIsDeactivated(isDeactivated ?? false);

    if (remember) {
      if (accessToken) await AsyncStorage.setItem("userToken", accessToken);
      if (email) await AsyncStorage.setItem("userEmail", email);
      if (mobile) await AsyncStorage.setItem("userMobile", mobile);
      await AsyncStorage.setItem("isDeactivated", String(isDeactivated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        email,
        mobile,
        isDeactivated,
        setAuthData,
        isReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
