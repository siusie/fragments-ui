# Stage 0: install the base dependencies
FROM nginx:stable AS dependencies

LABEL maintainer="Xi Chen <xchen339@myseneca.ca>" \
    description="Front-end web app for testing"

# Set up node.js (download the setup script, run it through a bash shell and once that's happened, use the package manager (apt-get) to install the build-essential & nodejs packages, clean up unnecessary files)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get update && apt-get install -y \
    build-essential \
    nodejs \
    && rm -fr /var/lib/apt/lists/*

###########################################################################

# Stage 1: use dependencies to build the site
FROM nginx:stable-alpine3.17-slim AS builder

# Copy our source code into the image
COPY --from=dependencies /usr/local/src/fragments-ui /usr/local/src/fragments-ui
WORKDIR /usr/local/src/fragments-ui

# Build our site
RUN npm ci --only=production

###########################################################################

# Stage 2: nginx web server to host the built site
FROM nginx:stable-alpine3.17-slim AS deploy

COPY --from=builder ./dist/. /usr/share/nginx/html/

# NOTE: an nginx container runs on port 80
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl --fail localhost:80 || exit 1
