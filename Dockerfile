# Stage 1: Build Angular
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/rapid-institute-managment-system /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
