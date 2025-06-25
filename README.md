# ChainX

ChainX is a full-stack project for building, testing, and deploying Cardano validators using Aiken, and providing a robust backend API with Node.js/Express. It integrates with MeshJS, Blockfrost, Koios, and supports modern API documentation via Swagger.

## Table of Contents
- [Introduction](#introduction)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Development Workflow](#development-workflow)
- [Aiken: Build & Test](#aiken-build--test)
- [API Backend Usage](#api-backend-usage)
- [Swagger & API Documentation](#swagger--api-documentation)
- [References](#references)

---

## Introduction

ChainX enables you to:
- Write Cardano validators in the `validators/` folder using Aiken.
- Add supporting functions in the `lib/` folder with `.ak` extension.
- Build a backend API with Node.js/Express, integrating MeshJS, Blockfrost, Koios, and more.
- Easily test, document, and deploy your Cardano smart contracts and related services.

---

## Project Structure

```
├── api/                # Express/Node.js backend source code
│   ├── routes/         # API route definitions (e.g. cip68.route.ts)
│   ├── utils/          # Utilities (Swagger, ...)
│   └── index.ts        # Server entry point
├── validators/         # Aiken validators (.ak)
├── lib/                # Aiken libraries (.ak)
├── env/                # Aiken environment configs
├── src/                # TypeScript source code (if separated)
├── .env                # Backend environment variables
├── package.json        # Node.js project config
├── tsconfig.json       # TypeScript config
├── aiken.toml          # Aiken config
└── README.md
```

---

## Prerequisites
- [Node.js](https://nodejs.org/) (v20 recommended for best compatibility)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Aiken](https://aiken-lang.org/) (for smart contract development)

---

## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/independenceee/ChainX.git
   cd ChainX
   ```
2. **Install Node.js dependencies:**
   ```sh
   npm install
   ```
3. **Install Aiken (if not already):**
   ```sh
   # See https://aiken-lang.org/getting-started/ for platform-specific instructions
   aiken --version
   ```

---

## Environment Variables

Create a `.env` file in the project root with the following (example):
```env
USER_MEMONIC="..."
PLATFORM_MEMONIC="..."
PLATFORM_ADDRESS="..."
PLATFORM_TOKEN="..."
BLOCKFROST_API_KEY="..."
KOIOS_TOKEN="..."
VERCEL_URL="..." # Optional, for deployment
```
- These are used for wallet, API, and blockchain integration.

---

## Development Workflow

### 1. Start the backend server (development)
```sh
npm run dev
```
- Server runs at: [http://localhost:3000](http://localhost:3000)
- Swagger UI: [http://localhost:3000/documents](http://localhost:3000/documents)
- Hot reload enabled via `nodemon`.

### 2. Build and run in production
```sh
npm run build
npm start
```
- Compiles TypeScript to JavaScript and runs the server from `dist/`.

---

## Aiken: Build & Test

### Build all validators
```sh
aiken build
```
- Compiles all `.ak` files in `validators/` and `lib/`.

### Test validators
```sh
aiken check
```
- Run all tests: `aiken check`
- Run specific test: `aiken check -m <test_name>`
- Example test in Aiken:
  ```aiken
  use config
  test foo() {
    config.network_id + 1 == 42
  }
  ```

### Configure Aiken
Edit `aiken.toml`:
```toml
[config.default]
network_id = 41
```
Or add environment modules under `env/`.

---

## API Backend Usage

- Write new API routes in `api/routes/` (e.g. `cip68.route.ts`).
- Use environment variables from `.env` for secrets and API keys.
- Example route registration in `api/index.ts`:
  ```typescript
  import cip68 from "@/api/routes/cip68.route";
  app.use("/api/v1/mint", cip68);
  ```
- Use MeshJS, Blockfrost, Koios, etc. for Cardano blockchain integration.

---

## Swagger & API Documentation

- API documentation is auto-generated and available at: [http://localhost:3000/documents](http://localhost:3000/documents)
- Swagger configuration is in `api/utils/swagger.util.ts`.
- To add documentation for a route, use JSDoc comments in your route files. Example:
  ```typescript
  /**
   * @openapi
   * /api/v1/mint:
   *   post:
   *     summary: Mint a new token
   *     requestBody:
   *       ...
   */
  router.post("/mint", ...)
  ```

---

## References

- [Aiken User Manual](https://aiken-lang.org)
- [ExpressJS](https://expressjs.com/)
- [MeshJS](https://meshjs.dev/)
- [Blockfrost](https://blockfrost.io/)
- [Koios](https://koios.rest/)
- [Swagger](https://swagger.io/)
