# Das Filter app image
# Runtime only: the compiled static assets (static/) are committed/prebuilt,
# so the image no longer needs bower + gulp 3 (which do not run on modern Node).
FROM node:24-bookworm-slim

ENV NODE_ENV=production
RUN apt-get update \
 && apt-get install -y --no-install-recommends graphicsmagick curl ca-certificates tini \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/app

COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund --loglevel=warn

COPY patches ./patches
RUN node patches/apply.js

COPY . .

EXPOSE 8080
ENTRYPOINT ["tini", "--"]
CMD ["node", "index.js"]
