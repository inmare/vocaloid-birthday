# 빌드 스테이지
# 특정 와이파이 환경에서는 -alpine접두사가 제대로 작동을 안함
# 그 경우에는 제거하고 실행하기
# FROM node:25 as builder
FROM node:25-alpine as builder
# 컨테이너 안에서 작업실로 사용할 폴더
WORKDIR /app
# pnpm 설치
RUN npm install -g pnpm
# package.json 먼저 복사 후 현재 도커 파일 위치로 이동
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# 모든 workspace의 package.json 파일만 먼저 복사
# (pnpm install에 필요한 파일들)
COPY packages/backend/package.json ./packages/backend/
COPY packages/frontend/package.json ./packages/frontend/
COPY packages/common/package.json ./packages/common/
COPY packages/database/package.json ./packages/database/

# 의존성 설치
RUN pnpm install --frozen-lockfile
# 소스 코드 복사
COPY . .
# 빌드 실행
RUN pnpm build
# 프로덕션용 의존성 설치 (devDependencies 제외)
# RUN pnpm install --prod --frozen-lockfile

# 새로운 nodejs 컨테이너 생성
# 특정 와이파이 환경에서는 -alpine접두사가 제대로 작동을 안함
# FROM node:25 as backend
FROM node:25-alpine as backend
WORKDIR /app

# pnpm 설치
RUN npm install -g pnpm

# 기존의 빌드 결과물을 복사
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/backend/node_modules ./packages/backend/node_modules
COPY --from=builder /app/packages/common/node_modules ./packages/common/node_modules
COPY --from=builder /app/packages/database/node_modules ./packages/database/node_modules

# 1. 모든 package.json 파일들과 lockfile 복사
COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/package.json ./
COPY --from=builder /app/packages/backend/package.json ./packages/backend/
COPY --from=builder /app/packages/common/package.json ./packages/common/
COPY --from=builder /app/packages/database/package.json ./packages/database/

# 2. 빌드된 결과물(dist)만 복사
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder /app/packages/common/dist ./packages/common/dist
COPY --from=builder /app/packages/database/dist ./packages/database/dist

# SQLite 데이터 저장 폴더
RUN mkdir -p /app/data
RUN mkdir -p /app/upload
# 백엔드 포트 오픈
EXPOSE 3000
# 백엔드 시작 명령어
CMD [ "node", "packages/backend/dist/index.js" ]



# 프론트엔드용 nginx 컨테이너 생성
FROM nginx:1.29.3-alpine as frontend
# 빌드된 프론트엔드 파일 복사
COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html
# Nginx 설정 복사 (API 프록시 설정)
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 프론트엔드 포트
EXPOSE 80
# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]