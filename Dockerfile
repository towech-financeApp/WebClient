#### DEV image -----------------------------
FROM node:16-alpine3.11 as dev

WORKDIR /work/

COPY ./package.json /work/package.json
COPY ./.eslintrc /work/.eslintrc
COPY ./.eslintignore /work/.eslintignore
COPY ./.prettierrc /work/.prettierrc
COPY ./tsconfig.json /work/package.json
RUN cd /work
RUN npm install
RUN npm install react-scripts@3.4.1 -g

COPY ./src /work/src
COPY ./public /work/public

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start"]