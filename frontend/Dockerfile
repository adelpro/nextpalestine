# Args
ARG NODE=node:21-alpine3.19

# Stage 1: builder
FROM ${NODE} AS builder

RUN apk add --no-cache libc6-compat \
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

WORKDIR /app

COPY --chown=nextjs:nodejs package*.json ./

RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn \
    yarn install --frozen-lockfile

COPY --chown=nextjs:nodejs . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

ENV NEXT_PRIVATE_STANDALONE true
ENV NODE_ENV production

# Generate the production build
RUN yarn build

# Install only the production dependencies and clean cache
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn \
    yarn install --frozen-lockfile --production && yarn cache clean

USER nextjs

# Stage 2: runner
FROM ${NODE} AS runner

RUN apk add --no-cache libc6-compat \
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

WORKDIR /app

ENV NODE_ENV production

# Uncomment the following line in case you want to disable telemetry during runtime.
 ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/public ./public 

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# Copy next.conf only if it's not the default
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./        
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set Docker as non-root user
USER nextjs

EXPOSE 3540

ENV PORT 3540

ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]


