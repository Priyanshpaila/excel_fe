# Excel BI — Frontend (React + Vite + Mantine + ECharts)

## Setup
```bash
npm install
# Set your backend URL (Express API) in .env
# Example for your LAN IP:
# VITE_API_BASE_URL=http://192.168.13.74:8000
npm run dev
```
Open http://localhost:5173

## API Integration
Wired to these endpoints:
- POST `/auth/signup`, POST `/auth/login`
- GET `/files`, GET `/files/:fileId`, DELETE `/files/:fileId`
- POST `/files/upload` (form-data `file`)
- GET `/sheets/:sheetId/schema`, GET `/sheets/:sheetId/dataset`
- GET `/datasets/:datasetId/query?spec=<base64url(JSON)>`
