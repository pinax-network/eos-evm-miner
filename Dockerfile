FROM oven/bun

COPY bun.lockb ./
RUN bun install

COPY . .

ENTRYPOINT [ "bun", "./bin/cli.ts" ]