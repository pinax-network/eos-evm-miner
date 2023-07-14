FROM oven/bun:0.6.9
COPY . .
RUN bun install
ENTRYPOINT [ "bun", "./bin/cli.ts" ]