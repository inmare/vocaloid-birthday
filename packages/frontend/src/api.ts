import axios from "axios";
import { DEV_API_ENDPOINT } from "./constants";

const api = axios.create({
  baseURL: DEV_API_ENDPOINT,
  withCredentials: true,
});

// 나중에 context로 고치기
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 기존의 요청이 /api/auth/refresh가 아니고, 403 에러가 났을 때만 실행
    // 무한 루프 방지
    if (
      error.response.status === 403 &&
      !originalRequest._retry &&
      originalRequest.url !== "/api/auth/refresh"
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await api.post(
          "/api/auth/refresh",
          {},
          { withCredentials: true },
        );
        setAccessToken(data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.log("세션이 만료되었습니다. 다시 로그인 해주세요");
        setAccessToken(null);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
