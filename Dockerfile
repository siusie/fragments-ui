FROM nginx:stable

LABEL maintainer="Xi Chen <xchen339@myseneca.ca>" \
    description="Front-end web app for testing"

# Set up node.js (download the setup script, run it through a bash shell and once that's happened, use the package manager (apt-get) to install the build-essential, nodejs packages, clean up unnecessary files)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get update && apt-get install -y \
    build-essential \
    nodejs \
    && rm -fr /var/lib/apt/lists/*

# Copy our source code in
WORKDIR /usr/local/src/fragments-ui
COPY . .

# Build our site
RUN npm ci

###########################################################################
# Build our image, then copy the built site to the dir that nginx expects for static sites
RUN npm run build && \
    cp -a ./dist/. /usr/share/nginx/html/

# NOTE: an nginx container runs on port 80
EXPOSE 80

