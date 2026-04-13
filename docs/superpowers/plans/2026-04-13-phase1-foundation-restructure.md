# Phase 1 Foundation And Repo Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the repository into production-style client/server layout, add Docker and CI scaffolding, and prepare the project for Phase 2 contract-hardening and bug fixes.

**Architecture:** Move existing frontend assets into a dedicated `client` app boundary and backend runtime code into `server/src`, with a thin `server.js` entrypoint. Add platform-level infrastructure (`docker-compose`, nginx reverse proxy, workflows, env templates, tests scaffold) without changing business logic behavior in this phase.

**Tech Stack:** React (CRA current baseline), Express, Mongoose, Docker, Nginx, GitHub Actions, Jest/Supertest scaffolding.

---

### Task 1: Create Migration Safety Checkpoints

**Files:**
- Modify: `.gitignore`
- Create: `docs/superpowers/plans/2026-04-13-phase1-foundation-restructure.md`

- [ ] Step 1: capture current workspace status
- [ ] Step 2: avoid touching unrelated modified files
- [ ] Step 3: execute migration only for folders in scope (`public`, `src`, frontend config, server runtime folders)

### Task 2: Restructure Frontend Into `client/`

**Files:**
- Move: `public/**` -> `client/public/**`
- Move: `src/**` -> `client/src/**`
- Move: `tailwind.config.js` -> `client/tailwind.config.js`
- Move: `package.json` (frontend) -> `client/package.json`
- Create: `client/.env.example`
- Create: `client/Dockerfile`
- Create: `client/nginx.conf`
- Create: `client/src/main.jsx`
- Modify: `client/src/index.js`

- [ ] Step 1: move frontend directories into `client`
- [ ] Step 2: create `main.jsx` entry and route `index.js` to `main.jsx`
- [ ] Step 3: add env template and Dockerfile for client image build/runtime

### Task 3: Restructure Backend Runtime Into `server/src/`

**Files:**
- Move: `server/config/**` -> `server/src/config/**`
- Move: `server/controllers/**` -> `server/src/controllers/**`
- Move: `server/middlewares/**` -> `server/src/middlewares/**`
- Move: `server/models/**` -> `server/src/models/**`
- Move: `server/routes/**` -> `server/src/routes/**`
- Move: `server/utils/**` -> `server/src/utils/**`
- Move: `server/mail/**` -> `server/src/mail/**`
- Create: `server/src/services/emailService.js`
- Create: `server/src/services/progressService.js`
- Create: `server/src/validators/auth.validators.js`
- Create: `server/src/middlewares/validate.js`
- Create: `server/src/middlewares/errorHandler.js`
- Create: `server/src/middlewares/upload.js`
- Create: `server/src/utils/apiResponse.js`
- Create: `server/src/utils/asyncHandler.js`
- Create: `server/src/utils/AppError.js`
- Create: `server/src/app.js`
- Create: `server/server.js`
- Modify: `server/package.json`
- Create: `server/.env.example`

- [ ] Step 1: move runtime code directories under `server/src`
- [ ] Step 2: split app setup (`src/app.js`) from server bootstrap (`server.js`)
- [ ] Step 3: update package scripts to use new entrypoints
- [ ] Step 4: scaffold middleware/services/validators/utils foundation files

### Task 4: Add Docker Compose And Nginx Layer

**Files:**
- Create: `docker-compose.yml`
- Create: `docker-compose.prod.yml`
- Create: `nginx/nginx.conf`
- Create: `.env.example`

- [ ] Step 1: add local compose with mongo + server + client
- [ ] Step 2: add prod compose with nginx reverse proxy and no mongo service
- [ ] Step 3: add root env template and nginx reverse-proxy config

### Task 5: Add Test And CI Scaffolding

**Files:**
- Create: `tests/integration/auth.test.js`
- Create: `tests/integration/course.test.js`
- Create: `tests/integration/catalog.test.js`
- Create: `tests/integration/payment.test.js`
- Create: `tests/integration/progress.test.js`
- Create: `tests/unit/.gitkeep`
- Create: `tests/setup/jest.config.js`
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/deploy.yml`

- [ ] Step 1: add integration test placeholders and shared test config
- [ ] Step 2: add CI workflow (install, lint placeholder, tests placeholder)
- [ ] Step 3: add deploy workflow skeleton for main branch merge

### Task 6: Verify Structure And Report Next Steps

**Files:**
- Read-only verification of created/moved files

- [ ] Step 1: verify final folder structure with directory listing
- [ ] Step 2: run static diagnostics check for obvious breakages
- [ ] Step 3: deliver completion summary + immediate Phase 2 recommendations
