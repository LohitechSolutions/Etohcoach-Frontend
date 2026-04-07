# Multistage build process for compiling our React app.
# DO NOT REMOVE THIS LINE: USES_MULTISTAGE_DOCKER

###################################
## Build Variables ################
###################################
ARG CI_REGISTRY
ARG NGINX_CONTAINER
ARG NODE_CONTAINER_IMAGE
ARG NODE_CONTAINER_TAG
ARG STORE_URL
ARG YARN_OPTS
ARG PUBLIC_URL
ARG REACT_APP_BASE_URL

###################################
## Base container #################
###################################
FROM ${CI_REGISTRY}/shared-services/docker-images/${NODE_CONTAINER_IMAGE}:${NODE_CONTAINER_TAG}

RUN mkdir /app

COPY . /app
WORKDIR /app/src

RUN yarn ${YARN_OPTS} \
 && yarn workspace web build

###################################
## Run unit tests #################
###################################
RUN ls /app/src/packages/web/build/

###################################
## Compile into NginX container ###
###################################
FROM ${CI_REGISTRY}/shared-services/docker-images/nginx:${NGINX_CONTAINER}
ARG TAG

ENV APP_VERSION=${TAG}

COPY --from=0 /app/src/packages/web/build/ /usr/share/nginx/html/
RUN ls /usr/share/nginx/html/

CMD ["/init-with-config.sh"]
