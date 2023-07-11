# Stage 0: install the base dependencies and build the site
FROM nginx:stable AS builder

LABEL description="Front-end web app for testing"

# Set up node.js (download the setup script, run it through a bash shell and once that's happened, use the package manager (apt-get) to install the build-essential & nodejs packages, clean up unnecessary files)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get update && apt-get install -y \
    build-essential \
    nodejs \
    && rm -fr /var/lib/apt/lists/*

WORKDIR /app

# Copy our source code into the image as `nginx` user, not `root`
COPY --chown=nginx:nginx . .

# Install dependencies and build the site
RUN npm ci && npm run build

###########################################################################

# Stage 1: nginx web server to host the built site
FROM nginx:stable-alpine3.17-slim@sha256:31491c883c5e56aaeb96d62e663256a7359a1937803be4269b775dda244cc051 AS deploy

COPY --chown=nginx:nginx --from=builder app/dist/ /usr/share/nginx/html/

# NOTE: an nginx container runs on port 80
EXPOSE 80

# Add a health check for the web server
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl --fail localhost:80 || exit 1
