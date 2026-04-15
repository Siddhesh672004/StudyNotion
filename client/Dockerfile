FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM deps AS dev
COPY . .
CMD ["npm", "start"]

FROM deps AS build
COPY . .
RUN npm run build && mv build dist

FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
