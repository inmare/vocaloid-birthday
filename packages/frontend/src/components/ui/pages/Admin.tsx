import api from "@/api";
import { useAuth } from "@components/AuthContext";
import { type FormEvent } from "react";
// import styled from "styled-components";

// const hide = styled.style`
//   display: none;
// `;

export default function Admin() {
  const { isLoading, accessToken, setAccessToken } = useAuth();

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();

    const target = event.target as HTMLFormElement;
    const formData = new FormData(target);
    const pwd = formData.get("pwd") as string;
    try {
      const response = await api.post("/api/auth/login", { password: pwd });
      setAccessToken(response.data.accessToken);
      console.log("로그인에 성공했습니다!");
      console.log(response.data.accessToken, accessToken);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await api.post("/api/logout");
      setAccessToken(null);
      console.log("로그아웃에 성공했습니다");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div>
        {!accessToken && !isLoading && (
          <form onSubmit={handleLogin}>
            <input type="password" name="pwd" id="pwd" />
            <button type="submit">로그인</button>
          </form>
        )}
        {accessToken && !isLoading && (
          <form onSubmit={handleLogout}>
            <button type="submit">로그아웃</button>
          </form>
        )}

        {isLoading && <div>로드 중입니다...</div>}
      </div>
    </>
  );
}
