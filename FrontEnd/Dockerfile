# Build:
#   docker build -t edgecart-web --build-arg BACKEND_API_URL=http://api:8080 FrontEnd
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# rewrites() and every NEXT_PUBLIC_* value are resolved during `next build`, so the API
# URL has to be present here — supplying it only at runtime bakes in localhost instead.
ARG BACKEND_API_URL=http://localhost:5241
ARG NEXT_PUBLIC_API_URL=/bff
ENV BACKEND_API_URL=$BACKEND_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# next.config.ts sets output: "standalone", so this is a self-contained server carrying
# only the dependencies actually reached — no need to ship all of node_modules.
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Next's standalone server binds process.env.HOSTNAME, which container runtimes set to
# the container id — an address it cannot bind. Pin it to all interfaces.
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]
