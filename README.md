# 🚀 To-Do App Pro

A premium, portfolio-grade Personal Productivity Platform built with vanilla web technologies. Inspired by Neobrutalist design aesthetics, it features an interactive UI and state-of-the-art data management right in your browser.

## ✨ Features

- **Kanban Board** - Full drag-and-drop workflow (`To Do`, `In Progress`, `Complete`).
- **Calendar View** - Task pill-based grid view with month navigation.
- **Tags Board** - A 4-column dynamic grid categorizing tasks by `Study`, `Work`, `Personal`, and `Health`.
- **Shared Tasks** - Collaborative interface mockups rendering shared properties and avatar grids.
- **Chat System** - Interactive two-pane chat layout featuring automated bot responses and `localStorage` persistence.
- **Dashboard Pro** - A massive Bento Grid UI featuring:
  - 🥧 **Category Distribution** - Animated pie charts via `Chart.js`.
  - 📊 **Task Velocity** - 7-day activity bar charts mapping tasks added vs tasks completed.
  - 🔥 **Productivity Streak** - Real mathematical streak calculations parsing task completion history.
- **Settings & Preferences**:
  - Global Dark Mode & Accent Color themes via CSS Variables.
  - Data Management (`.json` Import & Export).

## 🛠️ Tech Stack

- **HTML5** - Semantic structure and Bento Grid layout.
- **CSS3** - Neobrutalist aesthetics, CSS Grid, Flexbox, Custom Variables, and rich micro-animations.
- **Vanilla JavaScript** - Heavy DOM manipulation, robust `localStorage` state management, and unified rendering cycles (`renderApp()`).
- **Chart.js** - Interactive data visualizations.

## 🚀 Getting Started

No build tools, npm, or complex setup required! 

1. Clone or download the repository.
2. Open `index.html` in any modern web browser.
3. Start managing your tasks, switching views, and watching the Dashboard analytics update in real-time.

## 🏗️ Architecture

The app uses a strict **Single Source of Truth** architecture. 
All data lives inside a centralized `tasks[]` and `appSettings` state. After any mutation (adding, completing, sorting, or deleting tasks), a unified global synchronization function `renderApp()` is invoked to simultaneously update all panels, ensuring the Kanban board, Calendar, and Dashboard metrics remain perfectly accurate without the need for a modern framework like React.
