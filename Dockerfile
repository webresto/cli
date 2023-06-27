FROM node:18-alpine as planner
WORKDIR /cli
COPY ./package.json ./package.json

FROM node:18-alpine as cacher-dev
WORKDIR /cli
COPY --from=planner /cli/package.json ./package.json 
RUN npm install

FROM node:18-alpine as cacher
WORKDIR /cli
COPY --from=planner /cli/package.json ./package.json 
RUN npm install --omit=dev


FROM node:18-alpine as builder
RUN npm install -g typescript    
WORKDIR /cli
COPY --from=cacher-dev /cli/node_modules ./node_modules
COPY . .
RUN npm run build

###
FROM node:18-bullseye as release
RUN npm install -g typescript
WORKDIR /cli
ARG WEBRESTO_REGISTRY_TOKEN
COPY --from=builder ./cli/dist .
RUN ln -s /cli/src/bin/main.bin.js /bin/webresto
RUN chmod +x /bin/webresto
COPY --from=cacher /cli/node_modules ./node_modules