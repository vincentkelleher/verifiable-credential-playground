# 🛝 Verifiable Credential Playground

> A minimalistic verifiable credential utility application designed to sign VC-JWTs and expose a basic
> DID document based on Gaia-X standards.

## Getting Started

### Environment Setup

Before running anything, please build a basic `.env.local` file by running:

```bash
npm run generate-env
```

It will give you an `openssl` command to run to generate the required certificate which much
then be pasted in the newly created `.env.local`.

### Run Locally

To run this NextJS project locally use the following commands:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Run With Docker

To run this project with Docker, you will need to build the Docker image to then run it:

```bash
docker build -t verifiable-credential-playground .
docker run -p 3000:3000 -v ./.env.local:/app/.env.local verifiable-credential-playground:latest
```

Just like [Run Locally](#run-locally), you can open [http://localhost:3000](http://localhost:3000) with your browser
to see the result.