# Sử dụng Node.js chính thức làm base image
FROM node:18 AS build

# Đặt thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép package.json và package-lock.json
COPY package*.json ./ 

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Biên dịch ứng dụng NestJS từ TypeScript sang JavaScript
RUN npm run build

# Tạo image cuối cùng để chạy ứng dụng
FROM node:18

# Đặt thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép thư mục dist và các dependencies từ build stage vào image cuối cùng
COPY --from=build /usr/src/app/dist /usr/src/app/dist
COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=build /usr/src/app/package*.json /usr/src/app/

# Expose cổng mà ứng dụng sẽ chạy (ví dụ cổng 4000)
EXPOSE 4000

# Lệnh chạy ứng dụng khi container được khởi động
CMD ["npm", "run", "start:prod"]
