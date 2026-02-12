# BigBlueButton (BBB) Integration (Hosted Provider)

This repo integrates a **hosted BigBlueButton** provider into the existing system, using a **backend-only BBB client** (so the BBB shared secret is never exposed to the browser).

> Security note: Do **not** commit your BBB shared secret. Store it only in `backend/.env` and rotate it if it was ever pasted/shared.

## Architecture (high level)

- **Frontend (Next.js)** calls our backend API.
- **Backend (Express)** signs BBB API requests using the BBB shared secret and returns:
  - a **join URL** (teacher = moderator, student = attendee)
  - a **recordings list** (teacher/admin)
- BBB API authentication uses a SHA-1 checksum:
  - `checksum = sha1(apiMethod + queryString + sharedSecret)`
  - Reference: [BigBlueButton API Reference](https://docs.bigbluebutton.org/development/api)

## Data model

`ClassSession` (Mongo) was extended to support BBB sessions:

- `meetingProvider`: `"manual" | "bbb"` (default `"manual"`)
- `bbb.meetingId`: string (stable meeting ID, derived from session id)
- `bbb.createdAt`: Date | null (set after successful BBB `create`)
- `bbb.lastCreateError`: string

## Backend configuration

Add the following variables to `backend/.env`:

- `BBB_API_URL=<YOUR_PROVIDER_API_URL>`
  - Example shape: `https://your-bbb-host.example.com/bigbluebutton/api`
  - In your provider case: it ends with `/api`.
- `BBB_SHARED_SECRET=<YOUR_SHARED_SECRET>`
- `BBB_PASSWORD_PEPPER=<LONG_RANDOM_STRING>` (recommended)
  - Used to derive deterministic attendee/moderator passwords per meeting (so join URLs are stable).

The backend reads these in `backend/src/config/env.ts`.

## Backend routes

All routes below require authentication (`Bearer` token). Most also enforce roles.

### 1) Ping / validate configuration

- `GET /integrations/bbb/ping`
  - Calls BBB `getMeetings` to verify the URL/secret works.

### 2) Ensure a BBB meeting exists for a session

- `POST /integrations/bbb/sessions/:sessionId/ensure-created`
  - Role: `teacher` or `admin`
  - Calls BBB `create` with:
    - `meetingID` (derived from session id)
    - `record=true`
    - `allowStartStopRecording=true`
    - `autoStartRecording=false`
  - Stores `bbb.createdAt` on success.

### 3) Join meeting (role-based)

- `GET /integrations/bbb/sessions/:sessionId/join`
  - Roles:
    - `teacher`: must own the session -> joins as **moderator**
    - `student`: must have a **booked** booking for the session -> joins as **attendee**
    - `admin`: joins as **moderator**
  - Returns `{ url }` where `url` is the signed BBB `join` URL.
  - Frontend opens this URL in a new tab.

### 4) End meeting

- `POST /integrations/bbb/sessions/:sessionId/end`
  - Role: `teacher` (owner) or `admin`
  - Calls BBB `end`.

### 5) List recordings for a session

- `GET /integrations/bbb/sessions/:sessionId/recordings`
  - Role: `teacher` (owner) or `admin`
  - Calls BBB `getRecordings` filtered by `meetingID`
  - Returns playback URLs for the frontend to display.

## Booking flow behavior

- For **manual** sessions, the booking flow may schedule Google Meet and store the resulting link into `ClassSession.meetingLink`.
- For **BBB** sessions:
  - The booking flow **does not** attempt to create Google Meet.
  - `meetingLink` stays empty; users join via the backend BBB join endpoint instead.

## Frontend UX

### Teacher

- In the teacher sessions page, teachers can choose a **Meeting provider**:
  - `Manual link` (uses `meetingLink`)
  - `BigBlueButton` (BBB join links are generated automatically)
- For BBB sessions, the UI shows:
  - **Join BBB** (calls backend join endpoint)
  - **Recordings** (lists playback URLs)

### Student

- In “Your Classes”, if a booking is for a BBB session, the UI shows a **Join BBB** button that calls the backend join endpoint.

## Troubleshooting

- If BBB returns:
  - `<returncode>FAILED</returncode>` and `messageKey=unauthorized`
  - it means the checksum is wrong (wrong secret or wrong URL base).
- Confirm:
  - `BBB_API_URL` is correct and ends with `/api`
  - `BBB_SHARED_SECRET` matches the provider’s secret
