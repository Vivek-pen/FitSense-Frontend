# FitPulse Frontend

FitPulse is the frontend application for a fitness tracking platform. It provides the user interface for:

- Signing in with Keycloak
- Logging workouts and viewing activity history
- Viewing workout summaries and charts
- Reading AI-generated fitness recommendations

This repository contains only the frontend. The backend repository is available here:

> **Backend repository:** [https://github.com/Vivek-pen/FitSense]

## Technology

Built with React, TypeScript, Vite, React Router, TanStack React Query, Keycloak, and Recharts.

## Run locally

### Prerequisites

- Node.js 18 or later
- npm

### Steps

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file and set the required frontend configuration:

   ```env
   VITE_API_BASE_URL=http://localhost:9090
   VITE_KEYCLOAK_URL=http://localhost:8181
   VITE_KEYCLOAK_REALM= 
   VITE_KEYCLOAK_CLIENT_ID= 
   ```

3. Start the frontend:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in a browser.

## Production build

To create a production build:

```bash
npm run build
```

The output is generated in the `dist` folder.

