# build stage
FROM node:12.6 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install --silent
RUN npm install @vue/cli@3.9.0 -g
COPY . /app
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]