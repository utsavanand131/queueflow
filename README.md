# QueueFlow

QueueFlow is a Redis-powered background job processing system built with Next.js, BullMQ, and a dedicated worker.

It demonstrates how applications can move time-consuming tasks into a background queue, process them asynchronously, handle failures, retry jobs, and monitor queue activity through a web dashboard.

## Features

- Background job processing with BullMQ
- Redis-backed job queue
- Dedicated background worker
- Multiple job types
- Automatic failure handling
- Retry flow with fail-once/succeed-on-retry testing
- Job status tracking
- Job inspector with payload and execution details
- Manual retry for failed jobs
- Live dashboard polling
- Dockerized Redis
- Retro-inspired monitoring dashboard

## Architecture

Next.js Dashboard
│
▼
Next.js API Routes
│
▼
BullMQ Job Queue
│
▼
Redis (Docker)
│
▼
QueueFlow Worker

## How It Works

1. A user creates a job from the dashboard.
2. The Next.js API adds the job to a BullMQ queue.
3. BullMQ stores and manages the job using Redis.
4. The QueueFlow worker continuously listens for jobs.
5. The worker processes the job in the background.
6. Job status and execution details can be inspected from the dashboard.
7. Failed jobs can be retried.
8. The dashboard automatically updates through periodic polling.

### Retry Flow

QueueFlow includes a test job that intentionally fails on its first attempt.

Create Job
│
▼
Worker processes job
│
▼
First attempt fails
│
▼
Job is retried
│
▼
Second attempt succeeds
│
▼
Job marked completed

This demonstrates practical background-job failure handling rather than only processing successful jobs.

## Supported Job Types

- `email`
- `report`
- `export`
- `notification`
- `failing-test`

The `failing-test` job is used to demonstrate the retry mechanism.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- BullMQ
- Redis 7
- ioredis
- Docker
- Node.js

## Project Structure

queueflow/
├── app/
│ ├── api/
│ │ └── jobs/
│ ├── jobs/
│ │ ├── new/
│ │ └── [id]/
│ ├── page.tsx
│ └── globals.css
│
├── lib/
│ ├── queue.ts
│ └── redis.ts
│
├── worker/
│ └── index.ts
│
├── docker-compose.yml
├── package.json
└── README.md

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- Docker Desktop
- Git

### 1. Clone the repository

    git clone https://github.com/utsavanand131/queueflow.git
    cd queueflow

### 2. Install dependencies

    npm install

### 3. Start Redis

    docker compose up -d

This starts Redis using the `redis:7-alpine` Docker image.

### 4. Start the Next.js application

    npm run dev

The dashboard will be available at:

    http://localhost:3000

### 5. Start the background worker

Open another terminal in the project directory and run:

    npm run worker

You should see:

    🚀 QueueFlow worker is running...

The worker will then process jobs submitted through the dashboard.

## Testing the Retry System

1. Open the QueueFlow dashboard.
2. Select **Create Job**.
3. Choose **Failing Test**.
4. Create the job.
5. Watch the worker terminal.
6. The first attempt intentionally fails.
7. The retry attempt succeeds.
8. Open the job inspector to verify that the job completed with **2 attempts**.

## Dashboard

The dashboard provides an overview of:

- Waiting jobs
- Active jobs
- Completed jobs
- Failed jobs
- Delayed jobs
- Recent job activity

Job information can be opened from the dashboard to inspect execution details and retry failed jobs.
