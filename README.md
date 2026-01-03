# SharePastes

A simple paste‑sharing application with an Express backend and a React/Vite frontend.  
Users can create text pastes with optional expiry (TTL) and view limits, then share a unique link to view them.

---

## 🚀 Run Locally

### Prerequisites

- Node.js (>= 18)
- Redis server running locally or accessible via `REDIS_URL`

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/badalChhipa19/sharepastes.git
   cd sharepastes
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the frontend:

   ```bash
   npm run build
   ```

4. Start the backend (which also serves the built frontend):

   ```bash
   npm start
   ```

   This runs `node server.js`.

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Persistence Layer

- **Redis** is used to store pastes.
- Each paste is saved with:
  - `content` (text body)
  - `ttl_seconds` (optional expiry in seconds)
  - `max_views` (optional view limit)
  - `views_used` (counter)
- Redis keys are set with `EX` for TTL and updated on each view.
- When a paste expires (time or views), it is deleted and API returns `404` or `410`.

---

## ⚙️ API Endpoints

- `POST /api/pastes` → Create a new paste
- `GET /api/pastes/:id` → Retrieve a paste by ID (enforces TTL and view limits)
- `GET /api/healthz` → Health check

---

## 🎨 UI

- **Create Paste Page (`/`)**: Form to submit paste content, TTL, and max views.
- **View Paste Page (`/p/:id`)**: Displays paste content, remaining views, and expiry info.
- **404 Page**: Shown for invalid frontend routes.

---

## 📝 Design Decisions

- **Removed CORS and concurrently**:

  - Since the frontend build is served directly from Express, both API and UI share the same origin (`http://localhost:3000`).
  - This avoids cross‑origin issues and simplifies the run command.
  - Recruiters/testers only need `npm start` after building the frontend.

- **Relative API calls**:

  - Frontend uses `fetch("/api/...")` instead of hardcoded `http://localhost:3000`.
  - Works seamlessly in both local and hosted environments.

- **Clean run command**:
  - `npm start` → `node server.js`
  - No extra tooling required for recruiters to test.

