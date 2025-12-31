# Stage 1: Build Angular app
FROM node:18 AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire Angular project
COPY . .

# Build Angular for production
RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built Angular files to Nginx html folder
# ⚠ Make sure the folder name matches exactly what Angular outputs in dist/
COPY --from=build /app/dist/rapid-institute-managment-system /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
