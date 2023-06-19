FROM nginx:stable

# Set up node.js
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

# Copy the built site to the dir that nginx expects for static sites
RUN npm run build && \
    cp -a ./dist/. /usr/share/nginx/html/

EXPOSE 80
