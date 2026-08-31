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
