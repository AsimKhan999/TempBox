# TempBox

TempBox is a fast, simple, and privacy focused temporary email service that lets users instantly generate disposable email addresses without creating an account. Users can receive emails in a temporary inbox, view messages in real time, and generate a new address whenever needed. Temporary mailboxes automatically expire, helping keep the service clean and reducing unnecessary data retention.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

## Quick Start

```bash
git clone https://github.com/AsimKhan999/TempBox.git
cd TempBox
docker compose up -d
```

Open **http://localhost** in your browser.

## Local development

1. Install [Node.js](https://nodejs.org/) and [Docker Desktop](https://www.docker.com/products/docker-desktop/).
2. Start Docker Desktop, then from the project root start PostgreSQL and Redis:

   ```bash
   docker compose up -d postgres redis
   ```

3. Install dependencies for the root command, backend, and frontend:

   ```bash
   npm install
   npm install --prefix backend
   npm install --prefix frontend
   ```

4. Run both local development servers together:

   ```bash
   npm run dev
   ```

5. Open the Vite URL printed in the terminal (usually **http://localhost:5173**). The backend runs at **http://localhost:5000**.

The backend applies database migrations on startup. To stop both servers, press **Ctrl+C**; stop the database containers with `docker compose down` when finished.

This starts the app locally but does not make `tempbox.com` receive mail from the internet. External delivery requires a domain with MX records pointing to a publicly reachable SMTP server. For development, send a test email directly to the SMTP container on `localhost:25`; its development override forwards mail to the local backend:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d smtp
```


## Services

| Service | Description |
|---------|-------------|
| Frontend | React UI served via Nginx |
| Backend | Express API server |
| SMTP | Receives incoming emails |
| PostgreSQL | Database |
| Redis | Caching and rate limiting |
| Nginx | Reverse proxy |

## Stopping

```bash
docker compose down
```

To also remove stored data:

```bash
docker compose down -v
```
