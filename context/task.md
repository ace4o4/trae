*(This file gives the "Hands" to the AI. It is a step-by-step execution plan.)*

```markdown
# Development Task List: REOS Hackathon Build

## Phase 0: Initialization (Do this first)
- [ ] Initialize a new Vite project: `npm create vite@latest reos -- --template react`
- [ ] Install dependencies: `npm install firebase framer-motion lucide-react clsx tailwind-merge`
- [ ] Setup Tailwind CSS: `npx tailwindcss init -p` (Configure `content` paths in `tailwind.config.js`).
- [ ] Create folder structure: `src/components`, `src/hooks`, `src/lib`.
- [ ] **Action:** Create `src/lib/firebase.js` and paste the Firebase Config (Ask user for keys).

## Phase 1: The Core Logic (The Invisible Engine)
- [ ] **Create Hook:** `src/hooks/useEmergencySystem.js`
    - Logic: Connect to Firebase Realtime DB.
    - Export functions: `sendAlert(flat, type)`, `resolveAlert(id)`, `alerts` (state object).
    - Use `onValue` for real-time subscription.
- [ ] **Create Hook:** `src/hooks/useSensors.js`
    - Logic: Initialize `window.SpeechRecognition` (handle browser prefixes).
    - Logic: Add `devicemotion` listener. If acceleration.x > 25, trigger callback.
    - Return: `isListening` (bool), `startListening()` function.

## Phase 2: The UI Components (The Visuals)
- [ ] **Create Component:** `src/components/BuildingGrid.jsx`
    - Render a grid of 40 boxes (10 floors x 4 flats).
    - Prop: `activeAlerts` (Array/Object).
    - Logic: Map through floors. If a flat number matches an active alert, apply `animate-pulse` and `bg-red-600`.
    - Style: Dark mode, neon borders.
- [ ] **Create Component:** `src/components/AlertLog.jsx`
    - Render a list of active alerts on the side.
    - Button: "Mark Resolved" (calls `resolveAlert`).

## Phase 3: The Screens (Assembly)
- [ ] **Create Screen:** `src/GuardDashboard.jsx`
    - Layout: Split screen. Left side = `BuildingGrid`. Right side = `AlertLog`.
    - Integration: Use `useEmergencySystem` to fetch data and pass it to components.
- [ ] **Create Screen:** `src/ResidentApp.jsx`
    - Layout: 3 Huge Buttons (Medical, Fire, Security).
    - Integration: Use `useEmergencySystem` to `sendAlert`.
    - Integration: Use `useSensors` to auto-trigger on "Help" voice command.
    - Style: Minimalist, panic-friendly.

## Phase 4: Routing & Polish
- [ ] **Update:** `src/App.jsx`
    - Add simple conditional rendering or React Router.
    - Route `/guard` -> `GuardDashboard`.
    - Route `/` (default) -> `ResidentApp`.
- [ ] **Assets:** Add a dummy `siren.mp3` file to `public/`.
- [ ] **Polish:** In `GuardDashboard`, play audio when `alerts` length increases.

## Phase 5: Testing Instructions
1. Open localhost in two windows.
2. Window A: `/guard` (The Dashboard).
3. Window B: `/` (The Resident App).
4. Click "Medical" in Window B.
5. Verify Window A's grid lights up instantly.