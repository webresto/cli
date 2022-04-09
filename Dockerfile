FROM node:12-alpine as build
RUN npm install -g typescript    
WORKDIR /cli
COPY . .
RUN npm install
RUN npm run build

###
FROM node:12-alpine as release

RUN apk update && apk upgrade && \
    apk add --no-cache git bash curl tar

# fix git.hm problem
RUN git config --global http.sslverify "false"

RUN npm install -g typescript browserify
WORKDIR /cli
COPY --from=build ./cli/dist .
RUN npm install -g .