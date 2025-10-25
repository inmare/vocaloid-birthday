import { createContext, useContext } from "react";

interface AuthContextType {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

/**
 * Access token용 context
 * */
export const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Context에서 accessToken, setAccessToken을 가져오는 함수
 * */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthProvider 내부가 아닌 곳에서 context를 사용했습니다");
  }
  return context;
}
