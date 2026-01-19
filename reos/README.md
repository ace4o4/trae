# REOS: Resilient Enclave Operating System 🛡️🔥
> *Because when the internet dies, your safety shouldn't.*

**REOS** is a next-generation decentralized emergency response system designed for "High-Risk, Zero-Connectivity" scenarios (Earthquakes, Fire, Grid Failure). Unlike traditional apps that rely on the cloud, REOS builds its own local network to save lives.

---

## 🚀 Key Innovation: "The Resilient Enclave"

REOS operates on three core pillars to solve the "Panic & Disconnect" problem:

### 1. The Eye (Edge AI CCTV) 👁️
*   **Tech**: Python, OpenCV, YOLOv8, Thermal Simulation.
*   **Function**: Turns standard CCTVs into autonomous detectors.
*   **Capabilites**:
    *   Detects **Fire** signatures (Visual + Thermal).
    *   Detects **Humans** (YOLOv8) trapped in danger zones.
    *   Works 100% offline (Edge Computing).

### 2. The Voice (Mesh Network) 📡
*   **Tech**: P2P Simulation, React.
*   **Function**: When Wi-Fi/Internet fails, REOS switches to a **Local Mesh Network**.
*   **Capabilities**:
    *   Alerts hop from phone-to-phone to reach the Guard Dashboard.
    *   Visualizer shows signal propagation in real-time.

### 3. The Guide (AR Evacuation) 🏃‍♂️
*   **Tech**: WebAR (Camera + Canvas).
*   **Function**: Panic causes disorientation. REOS uses Augmented Reality to guide you out.
*   **Capabilities**:
    *   Overlays **Green Path Arrows** on the floor.
    *   Detects Fire via Camera and shows **"RED WALL / DANGER"**.
    *   "Nalu" (Mascot) provides calm, visual instructions.

---

## 🛠️ Installation & Setup

### Prerequisites
*   Node.js (for Web App)
*   Python 3.8+ (for CCTV Module)

### 1. Web Application (Resident & Guard)
```bash
cd reos
npm install
npm run dev
```
> Access at: `http://localhost:5173`

### 2. AI CCTV Module (Python)
```bash
cd reos/cctv
pip install -r requirements.txt
python main.py
```
> Requires Webcam. Press 'q' to quit.

---

## 🎬 How to Demo (Hackathon Flow)

1.  **Start the Web App**: Open two tabs/windows.
    *   **Resident App**: The main phone interface.
    *   **Guard Dashboard**: Click "Restricted Access" in the footer (Pin: `1234`).
    
2.  **Demo 1: The AI Eye (Python)**
    *   Run `python main.py`.
    *   Show a picture of **Fire** (or a red cloth) to the webcam.
    *   **Observe**: The Python HUD turns RED, detects "FIRE SIGNATURE", and sends an alert to the Guard Dashboard.
    *   **Check Guard Dashboard**: The Alert appears with a snapshot.

3.  **Demo 2: The Resilient Mesh**
    *   In **Resident App** -> Click the **WiFi Icon** (Top Right).
    *   **Observe**: Internet goes "Offline", and the **Mesh Visualizer** appears, showing data hopping between nodes.
    
4.  **Demo 3: AR Evacuation**
    *   In **Resident App** -> Click the **Footprints Icon**.
    *   **Observe**: Camera opens. "Exit" arrows appear on the floor.
    *   Show Fire/Red Object to camera -> **Observe**: Screen warns "DANGER - TURN BACK".

---

## 📂 Project Structure

```
reos/
├── src/
│   ├── components/
│   │   ├── AREvacuationGuide.jsx   # AR Logic
│   │   ├── MeshNetworkSimulator.jsx# P2P Mesh Logic
│   │   ├── FireDetectionOverlay.jsx# Web-based Fire AI
│   │   └── ...
│   ├── ResidentApp.jsx             # Main User Interface
│   └── GuardDashboard.jsx          # Command Center
├── cctv/
│   ├── main.py                     # Python Edge AI Script
│   └── requirements.txt            # Python Deps
└── ...
```

Built with ❤️ for **Safety & Resilience**.
