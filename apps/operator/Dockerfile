FROM node:22-alpine3.20 AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile

RUN npx nx build operator

FROM node:22-alpine3.20 AS runtime

WORKDIR /app

COPY --from=builder /app/dist/apps/operator ./operator
COPY --from=builder /app/node_modules ./node_modules

# Expose the application port
EXPOSE 5000

# Start the application
CMD sh -c "node operator/main.js"
