import { createContext, useState } from "react";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const localData = JSON.parse(localStorage.getItem("auth"));
  const [auth, setAuth] = useState(localData);
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
