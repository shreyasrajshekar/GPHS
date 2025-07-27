# 🚧 Pothole Tracker

Pothole Tracker is a React Native app that detects potholes using your smartphone's motion sensors and shares their location with the community in real time. It uses AI to verify pothole events and displays them on a live map — making roads smarter, safer, and community-powered.

---

## 📱 Features

- 📉 **Motion-Based Detection**: Uses accelerometer and gyroscope to track sudden road anomalies.
- 🧠 **AI Classification**: Sends buffered sensor data to a local Gemini API to confirm real potholes.
- 🗺️ **Live Map Interface**: Shows pothole reports as markers — red for confirmed, yellow for unconfirmed, orange for processing.
- 🌍 **Community Sharing**: Uploads verified and unverified potholes to Supabase, visible to all users.
- ⚡ **Efficient & Lightweight**: Runs continuously with minimal performance impact.

---

## 🛠️ Tech Stack

| Tech            | Usage                                |
|------------------|--------------------------------------|
| React Native (Expo) | Frontend mobile app framework     |
| Expo Sensors     | Access to accelerometer & gyro data |
| Gemini API       | Local AI model for pothole validation |
| Supabase         | Backend database & auth             |
| React Native Maps| Real-time map with dynamic markers  |

---

## 🧠 How It Works

1. The app continuously reads accelerometer & gyroscope data.
2. When a sudden spike or dip is detected, it buffers motion data from **before, during, and after** the event.
3. This data is sent to a **local Gemini API** for classification.
4. Based on the result, it:
   - 🟠 Adds a "processing" marker immediately.
   - 🔴 Adds a confirmed marker if validated as a pothole.
   - 🟡 Adds an unconfirmed marker if unclear.
5. The location is stored in Supabase and visible to all users on app launch.

---

## 🧪 Demo Screenshots

*(Coming soon – add GIFs or screenshots of map, detection in action, and markers)*

---

## 📦 Installation & Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/pothole-tracker.git
   cd pothole-tracker

