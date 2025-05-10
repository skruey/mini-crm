# Mini CRM

A simple CRM built with Next.js, Prisma, PostgreSQL, and Docker.

## Features

- User authentication
- Company, contact, and deal management
- Global search
- Responsive UI with shadcn/ui
- Demo data seeded for immediate use

## Getting Started

**Docker is required for the database.**

Open your browser and visit [https://www.docker.com/](https://www.docker.com/)
Open docker when downloaded

### Setup and Run

git clone https://github.com/skruey/mini-crm.git

cd mini-crm

cp .env.example .env (DATABASE_URL="postgresql://postgres:postgres@localhost:5432/
mini_crm")

docker compose up -d db

npm install

npx prisma migrate deploy

npx prisma db seed

npm run dev

### Access Visual DB in browser if needed

npx prisma studio

### Access the app

Open your browser and visit [http://localhost:3000](http://localhost:3000)

## Demo Credentials

- Email: demo@crm.com
- Password: password123

## Docker Compose Example

version: "3.8"
services:
db:
image: postgres:15
restart: always
environment:
POSTGRES_USER: postgres
POSTGRES_PASSWORD: postgres
POSTGRES_DB: mini_crm
ports: - "5432:5432"
volumes: - db_data:/var/lib/postgresql/data

volumes:
db_data:

## Tech Stack

- Next.js
- Prisma ORM
- PostgreSQL (via Docker)
- shadcn/ui

Thank you for using Mini CRM!
