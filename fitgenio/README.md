# FITGENIO — Digital Health & Wellness Platform

> Fitgenio keeps desk workers healthy by reminding them to take micro exercise breaks — and uses AI-powered video monitoring to make sure they're doing it right.

# The Problem

Modern desk workers sit for **8–10 hours a day** without moving.  
This leads to:
- Chronic back, neck, and wrist pain
- Eye strain and fatigue
- Reduced productivity and focus
- Long-term musculoskeletal disorders 

Most wellness apps just send notifications — and get ignored.  
**Fitgenio actually watches you do the exercises.**

# The Solution

Fitgenio runs in the background while you work.  
After every focus session, it opens a guided exercise break with:

- ⏰ Customizable work/break timings 
- 🎯 Real-time animated exercise demonstrations
- 📷 Live webcam monitoring with AI form feedback
- ✔️ Self-check checkpoints to ensure correct technique
- ⏩ Skip option when you're in the middle of something important
- 🔁 Automatic looping — work, break, work, break


## Demo Flow

1. Login / Get Started
        ↓
2. Work Timer starts (customizable: 1–120 min)
        ↓
3. Timer ends → Break begins automatically
        ↓
4. Animated exercise demo + AI video monitoring
        ↓
5. Break ends → Work timer starts again
        ↓
6. Press Stop anytime to exit


## Features

| Feature | Description |
| ⏱️ Flexible Timers | Drag sliders to set your own work & break durations |
| 🎯 Quick Presets | Test (1/1), Pomodoro (25/5), Classic (50/10), Deep Work (90/20) |
| 🎬 Animated Demos | SVG character animations showing exact exercise technique |
| 📷 AI Form Monitor | Webcam-based live feedback on your exercise form |
| ✔️ Self-Check System | Tap checkpoints to confirm you're doing each step correctly |
| ⏩ Skip Option | Skip exercises if you're in an important meeting |
| ⏹️ Stop Button | Cleanly exit the app at any time |
| 📊 Session Stats | See total sessions, focus minutes, and exercises completed |

---

## Exercises Included

| Exercise | Target Area | Duration |

| 🔄 Neck Rolls | Neck & upper spine | 30 sec |
| 🏔️ Shoulder Shrugs | Shoulders & traps | 20 sec |
| ⭕ Wrist Circles | Wrists & forearms | 25 sec |
| 🌀 Seated Spinal Twist | Lower back & core | 40 sec |
| 👁️ Eye Focus Shift | Eye muscles & strain | 30 sec |

---

# Tech Stack

| Technology | Purpose |
|---|---|
| **React** | UI framework & component architecture |
| **JavaScript (ES6+)** | Core logic, timers, state management |
| **JSX** | HTML-in-JavaScript templating |
| **CSS-in-JS** | Inline styles for all components |
| **SVG + CSS Keyframes** | Animated exercise demonstration characters |
| **WebRTC / MediaDevices API** | Live webcam access for form monitoring |
| **Vite** | Development server & build tool |

# Getting Started

# Prerequisites
- Node.js v18+ installed
- A modern browser (Chrome recommended for camera access)

# Installation

```bash
# Clone the repository
git clone 

# Navigate into the project
cd fitgenio

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open your browser at **http://localhost:5173**



# Project Structure

```
fitgenio/
├── src/
│   └── App.jsx          # Entire application (single file)
├── index.html           # HTML entry point + Google Fonts
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── README.md            # You are here
```


# How the Timer Works

The timer uses a recursive `runCycle()` function that passes durations as direct arguments — preventing stale closure bugs that are common in React timer implementations.

```
runCycle(workSecs, breakSecs, sessionNumber)
    ↓
setInterval → countdown
    ↓
hits 0 → switch screen → start break timer
    ↓
hits 0 → runCycle(workSecs, breakSecs, sessionNumber + 1)
    ↓
loops until Stop is pressed
```

# Future Roadmap

- Real AI pose estimation using TensorFlow.js / MediaPipe
- Calendar integration (Google Calendar, Outlook) to skip meetings automatically
- Desktop app version (Electron) for true background running
- Personalized exercise recommendations based on pain points
- Team/corporate dashboard for workplace wellness tracking
- Wearable device integration (Apple Watch, Fitbit)
- Streak tracking and gamification

# License
MIT License — free to use, modify, and distribute.

> *"Your body is your most productive tool. Take care of it."* 💪
