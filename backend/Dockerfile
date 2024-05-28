ARG NODE=node:21-alpine3.19

# Stage 1: builder
FROM ${NODE} AS builder

# Combine commands to reduce layers
RUN apk add --no-cache libc6-compat \
    && apk add --no-cache curl \
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nestjs

WORKDIR /app

COPY --chown=nestjs:nodejs package*.json ./

RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn \
    yarn install --frozen-lockfile

COPY --chown=nestjs:nodejs . .

ENV NODE_ENV production

# Generate the production build. The build script runs "nest build" to compile the application.
RUN yarn build

# Install only the production dependencies and clean cache to optimize image size.
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn \
    yarn install --production --frozen-lockfile && yarn cache clean

USER nestjs

# Stage 2: runner
FROM ${NODE} AS runner

RUN apk add --no-cache libc6-compat \
    && apk add --no-cache curl \
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nestjs

WORKDIR /app

# Set to production environment
ENV NODE_ENV production

# Copy only the necessary files
COPY --chown=nestjs:nodejs --from=builder /app/dist ./dist
COPY --chown=nestjs:nodejs --from=builder /app/logs ./logs
COPY --chown=nestjs:nodejs --from=builder /app/public ./public
COPY --chown=nestjs:nodejs --from=builder /app/node_modules ./node_modules
COPY --chown=nestjs:nodejs --from=builder /app/package*.json ./


# Set Docker as non-root user
USER nestjs

EXPOSE 3500

ENV HOSTNAME "0.0.0.0"

ENV PORT 3540

CMD ["node", "dist/main.js"]
