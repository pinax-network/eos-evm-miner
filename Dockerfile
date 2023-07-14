FROM oven/bun:v0.6.9
COPY . .
RUN bun install
ENTRYPOINT [ "bun", "./bin/cli.ts" ]