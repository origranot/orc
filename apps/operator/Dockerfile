# Use multi-stage builds to reduce the final image size
FROM node:22-alpine3.20 AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile

# Build the application
RUN npx nx build operator

# Use a lighter image for the runtime
FROM node:22-alpine3.20 AS runtime

# Set the working directory
WORKDIR /app

# Copy the build artifacts and node_modules from the builder stage
COPY --from=builder /app/dist/apps/operator ./operator
COPY --from=builder /app/node_modules ./node_modules

# Expose the application port
EXPOSE 5000

# Start the application
CMD sh -c "node operator/main.js"
