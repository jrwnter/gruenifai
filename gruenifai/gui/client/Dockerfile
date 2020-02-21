FROM node:latest as build-deps
WORKDIR /usr/src/app
RUN wget https://peter-ertl.com/jsme/download/JSME_2017-02-26.zip && unzip JSME_2017-02-26.zip && mv JSME_2017-02-26 jsme && mv jsme public/

COPY package.json ./
RUN yarn install
COPY . ./
RUN yarn build

FROM nginx:1.12-alpine
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

