# syntax=docker/dockerfile:1.7
#
# Multi-stage build for the EU AI Act SME Compliance Pack storefront.
# Produces a small self-contained image (~200MB) that runs prisma migrate
# deploy on boot and then serves the Next.js standalone bundle.
#
# Target: Dokploy on Hetzner. Works with any container host.

# =============================================================================
# 1. deps — install node_modules once, cacheable.
# =============================================================================
FROM node:20-alpine AS deps
WORKDIR /app
# Prisma needs libc + openssl on Alpine.
RUN apk add --no-cache libc6-compat openssl
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci

# =============================================================================
# 2. builder — generate Prisma client + build the Next.js standalone bundle.
# =============================================================================
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Build-time NEXT_PUBLIC_APP_URL bakes into client JS — pass it via
# Dokploy build args if the production URL differs from the default.
ARG NEXT_PUBLIC_APP_URL=https://bootcamp.ai-comply.ie
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
RUN npx prisma generate
RUN npm run build

# =============================================================================
# 3. runner — minimal runtime: standalone server + prisma CLI for migrations.
# =============================================================================
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run as a non-root user.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Next.js standalone server + traced node_modules.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Static chunks + public assets aren't in the standalone bundle — copy them.
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Prisma CLI + schema for `migrate deploy` on container start.
# (The @prisma/client runtime is already traced into the standalone bundle.)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs
EXPOSE 3000

# Apply pending migrations, then start the server.
# If migrate-deploy fails (e.g. DB unreachable) the container exits and
# Dokploy will surface the failure rather than serving a half-broken app.
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && node server.js"]
