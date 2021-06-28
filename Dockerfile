# Base stage -----------------------------------------------------------------------
FROM node:16-alpine3.13 as base
WORKDIR /usr/app
COPY package*.json ./

#  Dev stage -----------------------------------------------------------------------
FROM base as dev
RUN npm install
COPY . .
EXPOSE 3000
CMD npm run start

# Build stage ----------------------------------------------------------------------
FROM base as build
RUN npm ci

ARG REACT_APP_WEBAPI
ENV REACT_APP_WEBAPI=${REACT_APP_WEBAPI}

COPY . .
RUN npm run build

# PROD stage -----------------------------------------------------------------------
FROM nginx:1.20-alpine as prod
COPY --from=build /usr/app/build /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
