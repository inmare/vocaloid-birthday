import api from "@/api";
import { useAuth } from "@components/AuthContext";
import { type FormEvent } from "react";
import Btn from "../fragments/Btn";
import CustomTextInput from "../fragments/CustomTextInput";

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
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await api.post("/api/auth/logout");
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
          <form
            onSubmit={handleLogin}
            className="flex justify-center gap-2 p-5"
          >
            <CustomTextInput name="pwd" type="password" />
            <Btn className="rounded-lg px-4 py-2" type="submit">
              로그인
            </Btn>
          </form>
        )}
        {accessToken && !isLoading && (
          <form
            onSubmit={handleLogout}
            className="flex justify-center gap-2 p-5"
          >
            <Btn className="rounded-lg px-4 py-2" type="submit">
              로그아웃
            </Btn>
          </form>
        )}

        {isLoading && <div className="p-5 text-center">로드 중입니다...</div>}
      </div>
    </>
  );
}
