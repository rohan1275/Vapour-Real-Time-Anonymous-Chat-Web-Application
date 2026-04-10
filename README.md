# 🌫 Vapour — Real-Time Anonymous Chat Platform

> Anonymous conversations. No trace.

🔗 **Live Demo:** https://vapour-real-time-anonymous-chat-web.vercel.app/

---

## 🚀 Overview

Vapour is a **real-time anonymous chat application** that allows users to create private chat rooms and communicate securely without any authentication.

Each room is **ephemeral** — messages and rooms automatically disappear when the chat ends, ensuring complete privacy and zero data persistence.

---

## ✨ Features

- 🔐 Anonymous chat (no login required)
- 🧪 Ephemeral rooms (auto-delete after chat ends)
- ⚡ Real-time messaging (Firestore listeners)
- 💬 Typing indicator (live user feedback)
- 🔗 Shareable invite links
- 🧑 Temporary usernames
- 📱 Fully responsive design (mobile + desktop)
- 🎨 Modern UI with smooth animations
- ☁️ Cloud-based backend (Firebase)

---

## 🏗️ Tech Stack

**Frontend**
- React.js
- JavaScript (ES6+)
- CSS (Modern UI + animations)

**Backend / Cloud**
- Firebase Firestore (real-time database)
- Firebase Authentication (anonymous)

**Deployment**
- Vercel (Frontend Hosting)
- GitHub (Version Control)

---

## ⚙️ How It Works

1. User creates a private room
2. Unique room ID is generated
3. Users join via link or code
4. Messages are synced in real-time using Firestore
5. When chat ends:
   - Messages are deleted
   - Room is removed (ephemeral design)

---

## 🧠 Key Concepts Demonstrated

- Real-time systems using event listeners
- Cloud database integration (Firestore)
- Ephemeral architecture (auto-cleanup)
- Frontend state management with React Hooks
- Secure API handling using environment variables
- Production deployment and debugging

---

## 📸 Screenshots

> Add screenshots here (IMPORTANT for recruiters)

![Home](./screenshots/home.png)
![Chat](./screenshots/chat.png)

---

## 🛠️ Installation & Setup

```bash
git clone https://github.com/rohan1275/vapour-real-time-anonymous-chat
cd vapour-real-time-anonymous-chat
npm install
npm run dev
