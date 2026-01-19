# Helpdesk Microservices (No Docker)

## Requirements
- Node.js 20+
- npm 9+

## Install
From repo root:
```bash
npm install
```

## Run all services (single command)
```bash
npm run dev
```

Gateway:
- http://localhost:3000/docs
- http://localhost:3000/health

## Run tests
```bash
npm test
```

## Headers (simple auth)
For all API calls add:
- x-user-id: u1
- x-role: USER (or ADMIN)
# nodeProject
