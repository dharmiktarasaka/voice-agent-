# VoicePilot AI — Enterprise AI Voice Calling Platform (Phase 1 Frontend)

VoicePilot AI is a production-grade B2B SaaS dashboard and conversational intelligence interface designed for multilingual inbound and outbound AI phone calling agents (supporting English, Hindi, and Gujarati).

## Technology Stack

- **Framework**: React 19 with Vite 8
- **Routing**: React Router 7 (`createBrowserRouter`)
- **Styling**: Tailwind CSS v4 with custom dark mode and Inter typography
- **Visualizations**: Recharts analytics charts
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **State & Service Layer**: Centralized API abstraction layer (`apiClient.js`) with responsive in-memory stores ready for seamless Phase 2 Node.js & MongoDB backend integration.

---

## Implemented Pages & Features

1. **Dashboard Overview (`/`)**
   - 6 KPI Cards with sparklines and period comparison metrics (Total Calls, Answered, Successful Turns, Qualified Leads, Duration, Estimated Cost).
   - Recharts visual charts: Calls over time, in/outbound split, call outcomes donut, regional language distribution (EN/HI/GU), and hourly volume heatmap.
   - Recent call logs, active agents summary, and live activity stream.
   - Date range filtering (Today, 7D, 30D, 90D).

2. **AI Agents (`/agents`)**
   - Grid and List views with search and multi-filtering (Status, Language, Direction).
   - Status toggling with confirmation dialogs.
   - Duplicate, archive, and delete flows.
   - Voice preview simulation.

3. **7-Step Create Agent Wizard (`/agents/new`)**
   - Multi-step wizard with step validation and state preservation:
     - Step 1: Basic Information
     - Step 2: Purpose
     - Step 3: Call Direction
     - Step 4: Languages (EN, HI, GU, Auto-detect)
     - Step 5: Voice & Persona
     - Step 6: System Prompt & Guardrails
     - Step 7: Review & Save Draft / Activate

4. **Agent Details & Configuration (`/agents/:id`)**
   - Deep configuration tabs: General, Calling Rules, Languages, Voice Persona, Prompt Directives, Turn-taking & Barge-in Behavior, Post-Call Extraction Fields, and Activity History.

5. **Phone Numbers (`/phone-numbers`)**
   - Virtual phone lines management table with country tags, provider badges (Twilio, Telnyx, Vonage, Plivo), capabilities, and assigned agent.
   - Provisioning wizard modal and quick agent reassignment.
   - Telephony setup checklist for Phase 3 carrier integration.

6. **Call History (`/calls`)**
   - Searchable call logs with 8 status badges (Queued, Ringing, In Progress, Completed, Failed, No Answer, Busy, Cancelled).
   - Multi-row selection, CSV export, pagination, and multi-filters.

7. **Call Details Inspection (`/calls/:id`)**
   - Full conversational turn-by-turn transcript with speaker bubbles, timestamps, language tags, and search filter.
   - Simulated dual-channel audio player placeholder with waveform visualization.
   - AI Executive Call Summary and extracted qualification parameters.
   - Internal notes editor and sequential event timeline.

8. **Live Calls Monitoring (`/live-calls`)**
   - Real-time active conversation monitor with second-by-second duration counter.
   - Live speech ticker and latency telemetry.
   - Operator controls: Listen In, Transfer to Human, and End Call with safety confirmations.

9. **Outbound Campaigns (`/campaigns` & `/campaigns/:id`)**
   - Campaign lifecycle management (Draft, Scheduled, Running, Paused, Completed).
   - Visual dialing pipeline funnel charts and dial progress tracking.
   - Compliance safeguards checklist: DNC suppression, calling windows, and prior consent certification.

10. **Leads & Contacts CRM (`/contacts` & `/contacts/:id`)**
    - Lead stage tracking (New, Contacted, Qualified, Interested, Callback Requested, Converted, Not Interested, Do Not Contact).
    - CSV Bulk Import wizard with column auto-mapping, phone validation, and row preview.
    - Contact detail drawer with DNC suppression toggle and call logs.

11. **Follow-up Queue (`/follow-ups`)**
    - Categorized tabs: Due Today, Overdue, Upcoming, Completed.
    - Quick rescheduling modal and completion triggers.

12. **AI Knowledge Base (`/knowledge-base`)**
    - Categorized knowledge articles (Company Info, Services, Pricing, FAQs, Policies, Custom).
    - Document upload interface with processing and vector indexing simulation tracker.

13. **Analytics Deep Dive (`/analytics`)**
    - KPI cards with interactive formula explanations.
    - Duration distribution histogram and campaign unit economics comparison.

14. **Conversation Insights (`/conversation-insights`)**
    - AI-extracted customer objections and suggested prompt counters.
    - FAQ frequency, unresolved questions (knowledge gaps), and dropoff analysis.

15. **Integrations (`/integrations`)**
    - Connection cards and setup modal for Vapi, Retell AI, Twilio, MongoDB, Google Calendar, CRM Webhooks, and SendGrid.

16. **Team & Access (`/team`)**
    - Role-based permissions matrix (Owner, Admin, Manager, Agent, Viewer).
    - Invite member modal and role reassignment dialogs.

17. **Settings (`/settings`)**
    - Workspace details, agent defaults, calling rules, notification triggers, appearance preferences, and data privacy policies.

---

## Local Development & Production Build

### Running Dev Server
```bash
cd client
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production
```bash
cd client
npm run build
```
Generates optimized static assets in `client/dist/`.

---

## 🚀 Deploying to Vercel

This frontend is 100% pre-configured for **Vercel** with full client-side SPA routing (`vercel.json`), asset caching, and optimized production bundling.

### Method 1: Deploy via GitHub (Recommended)

1. Push this project to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "feat: initial VoicePilot AI frontend"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"** &rarr; **"Import Git Repository"**.
3. Select your repository.
4. **Crucial Setting**:
   - In **Root Directory**, click **Edit** and select **`client`** (or type `client`).
5. Keep **Framework Preset** as **Vite**.
6. Click **Deploy**. Vercel will build and launch your live URL in under 60 seconds!

---

### Method 2: Deploy with Vercel CLI (1-Command Direct Deploy)

If you have Node.js installed, you can deploy directly from your terminal:

```bash
cd client
npx vercel
```

- Follow the quick prompts in your terminal:
  - *Set up and deploy?* &rarr; **Y**
  - *Which scope?* &rarr; Select your Vercel account
  - *Link to existing project?* &rarr; **N**
  - *Project name?* &rarr; `voicepilot-ai` (or your choice)
  - *In which directory is your code located?* &rarr; `./`
  - *Want to modify settings?* &rarr; **N**
- To deploy to production:
  ```bash
  npx vercel --prod
  ```

