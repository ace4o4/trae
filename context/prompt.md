# Project Context: REOS (Residential Emergency Operating System)

## 1. Project Overview
REOS is a "Zero-Latency" emergency response platform for residential societies. It replaces slow intercoms/WhatsApp groups with a real-time "Digital Twin" command center.
- **Goal:** Reduce emergency response time from minutes to <3 seconds.
- **Core Mechanism:** A resident triggers an alert (Voice/Touch/Fall), and the Security Guard's dashboard *instantly* visualizes the specific apartment pulsing red on a digital map.

## 2. Tech Stack (Strict)
- **Framework:** React 18 + Vite (Fastest build/HMR).
- **Language:** JavaScript (ES6+) or TypeScript (User preference: JS for speed).
- **Styling:** Tailwind CSS + Framer Motion (Crucial for "Pulse" animations).
- **Backend/State:** Firebase Realtime Database (WebSockets for <100ms sync).
- **Icons:** Lucide React.
- **Native APIs:**
  - `window.SpeechRecognition` (Web Speech API) for voice triggering.
  - `window.DeviceMotionEvent` (Accelerometer) for fall detection.

## 3. Design System & Aesthetic
- **Theme:** "Cyberpunk Command Center".
- **Colors:**
  - Background: `bg-slate-950` (Deep Space Dark).
  - Primary Accent: `cyan-500` (Safe/Normal status).
  - Danger Accent: `red-600` (Emergency Active).
  - Text: `slate-200` (High contrast).
- **Visuals:** - Glassmorphism panels (semi-transparent backgrounds with blur).
  - Neon borders/glow effects using CSS shadows.
  - Monospace fonts for numbers/logs to look technical.

## 4. Data Structure (Firebase Schema)
The Realtime Database will have a simple structure at `/alerts`:

```json
{
  "alerts": {
    "-NK5...id": {
      "flat": "302",
      "type": "Medical", // or "Fire", "Security"
      "status": "Active", // or "Resolved"
      "timestamp": 1705500000,
      "residentName": "Satyam"
    }
  }
}