import api, { setAccessToken as setApiAccessToken } from "@/api";
import { AuthContext } from "@components/AuthContext";
import { useEffect, useState, type ReactNode } from "react";

/**
 * AuthContext를 사용할 수 있게 해주는 react component
 * @param object 자식 react node들
 * @returns AuthContext privider
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const value = {
    isLoading,
    setIsLoading,
    accessToken,
    setAccessToken,
  };

  // 로그인해서 access token이 바뀌면 api의 access token도 업데이트 해주기
  useEffect(() => {
    setApiAccessToken(accessToken);
  }, [accessToken]);

  // 사이트 접속시 refresh token을 사용해서 access token 받아오기
  useEffect(() => {
    const checkAutnStatus = async () => {
      try {
        const response = await api.post("/api/auth/refresh");
        setAccessToken(response.data.accessToken);
      } catch {
        // console.error(error);
        // console.error(
        //   "Refresh token이 존재하지 않습니다. 다시 로그인해주세요."
        // );
        console.log("다시 로그인 해 주세요");
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAutnStatus();
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
