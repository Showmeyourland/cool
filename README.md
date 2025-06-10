# AI Sales Buddy MVP - README

## 🔍 Overview

AI Sales Buddy is a browser-based real-time voice transformation web app. It captures your microphone audio, sends it to ElevenLabs’ speech-to-speech API, and plays back an American-accented version in near real-time. This MVP version includes voice and speed selection, live usage tracking, and user authentication via Supabase.

---

## 🧱 Target Users

* Virtual assistants
* Sales reps
* Call center agents

---

## 🪜 Core Features

* Email + password login (Supabase auth)
* Real-time microphone streaming to ElevenLabs
* Voice selection: Male / Female
* Speed adjustment: Slow / Normal / Fast
* Mid-session voice/speed switching
* In-memory processing only (no saved audio)
* User usage tracking (minutes used, per session log)
* Admin dashboard with usage visibility

---

## 📊 Usage Tracking

### Per user:

* `total_minutes_used`

### Per session:

```json
{
  "user_id": "uuid",
  "started_at": "2025-06-04T12:00:00Z",
  "duration_minutes": 2.5,
  "voice": "female",
  "speed": "normal",
  "error_logs": []
}
```

---

## 🚫 Usage Limits (Optional)

The app includes a usage limiter flag per user in Supabase (e.g., `minute_cap: 30`). Limiting is not enforced yet but ready for future use.

---

## 📂 Folder Structure

```
AI Sales Buddy/
├── public/
│   ├── index.html          # Web UI
│   ├── script.js           # Mic capture + UI control
├── server.js               # Audio routing + ElevenLabs integration
├── supabaseClient.js       # Supabase config + auth
├── utils/
│   ├── audioProcessor.js   # Handles audio chunking/streaming
│   ├── userTracker.js      # Usage tracking logic
├── .env                    # ElevenLabs + Supabase keys
├── .env.example            # Sample .env config
└── README.md
```

---

## ⚖️ Tech Stack

* **Frontend**: HTML/CSS + Vanilla JS
* **Backend**: Node.js (Express)
* **Auth/DB**: Supabase (auth + Postgres)
* **Audio API**: ElevenLabs Speech-to-Speech

---

## ⚡ Setup Instructions

### ✅ 1. Clone the Project

On Replit, create a new Node.js project and paste in the files.

### ⚖️ 2. Environment Variables (`.env`)

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
ELEVENLABS_API_KEY=your_elevenlabs_key
```

### 🌐 3. Run the App

```bash
node server.js
```

Visit the Replit-provided URL to access the app in your browser.

### 👥 4. Create Supabase Tables

Use Supabase SQL editor or schema migration to create:

#### `users` table

```sql
create table users (
  id uuid primary key,
  email text unique,
  total_minutes_used float default 0,
  is_admin boolean default false
);
```

#### `sessions` table

```sql
create table sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  voice text,
  speed text,
  started_at timestamp default now(),
  duration_minutes float,
  error_logs text[]
);
```

---

## 🚀 Next Steps

* Finalize frontend playback loop for real-time feedback
* Build out admin dashboard (simple table view)
* Add usage meter to user dashboard
* Improve latency performance and error display

---

## ✍️ To-Do Lists

### Developer Tasks (Replit-Specific Requirements for Replit to Build):

* [ ] Build `index.html` with login, voice/speed selection, and playback UI
* [ ] Build `script.js` to handle:

  * Mic capture
  * Streaming 1s audio chunks
  * Receiving transformed audio from backend
  * Playing audio in near real-time
* [ ] `server.js`:

  * Accept audio chunk POSTs
  * Forward to ElevenLabs API
  * Return processed audio
* [ ] Supabase Integration:

  * Add email/password auth (via Supabase client)
  * Store user auth and session info in DB
  * Track total usage and session logs
* [ ] Add Supabase Admin Dashboard:

  * View list of users
  * View per-user usage summaries and sessions
* [ ] Connect all UI events to backend logic (start/stop, voice change, speed toggle)

### Nice-to-Have (Post-MVP):

* [ ] Add voice previews before session start
* [ ] Enforce minute caps if user exceeds limit
* [ ] Let users export session logs or see history

---

## 🔗 Resources

* Supabase Docs: [https://supabase.com/docs](https://supabase.com/docs)
* ElevenLabs Docs: [https://docs.elevenlabs.io](https://docs.elevenlabs.io)
* Web Audio API: [https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

---

## 🛡️ Privacy Compliance

* No audio data is stored
* All processing is live, in-memory only
* Authenticated users only
* API keys stored securely via .env and never exposed to client

---

## 📖 License

MIT
