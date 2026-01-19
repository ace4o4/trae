import cv2
import time
import requests
import json
import base64
import numpy as np
import threading
from datetime import datetime
from ultralytics import YOLO

# --- CONFIGURATION ---
FIREBASE_DB_URL = "https://trae-e4378-default-rtdb.asia-southeast1.firebasedatabase.app"
FLAT_ID = "CCTV-BASEMENT-01"
ALERT_COOLDOWN = 10 

# Initialize YOLOv8 Model
print("[INIT] Loading YOLOv8 AI Model... (This might take a moment)")
try:
    model = YOLO('yolov8n.pt') 
    print("[INIT] Model Loaded Successfully.")
except Exception as e:
    print(f"[ERROR] Failed to load YOLO: {e}")
    exit()

# Threaded Alert System
def send_alert_async(payload):
    def _send():
        url = f"{FIREBASE_DB_URL}/alerts.json"
        try:
            requests.post(url, data=json.dumps(payload), timeout=5)
            print(f" [CLOUD] Alert Sent: {payload['type']}")
        except Exception as e:
            print(f" [CLOUD] Upload Failed: {e}")
    
    thread = threading.Thread(target=_send)
    thread.start()

def create_payload(frame, threat_level, people_count):
    # Resize and encode for evidence
    small_frame = cv2.resize(frame, (320, 240))
    _, buffer = cv2.imencode('.jpg', small_frame, [int(cv2.IMWRITE_JPEG_QUALITY), 50])
    img_str = base64.b64encode(buffer).decode('utf-8')
    evidence_image = f"data:image/jpeg;base64,{img_str}"

    return {
        "type": "Fire",
        "flat": FLAT_ID,
        "residentName": f"AI WATCH (People: {people_count})",
        "status": "active",
        "timestamp": int(time.time() * 1000),
        "vitals": {"heartRate": 0, "oxygen": 0},
        "evidenceImage": evidence_image,
        "threatLevel": threat_level
    }

def draw_hud(frame, fps, fire_prob, people_count, status_text, color):
    h, w = frame.shape[:2]
    
    # Border
    cv2.rectangle(frame, (10, 10), (w-10, h-10), (0, 255, 0), 2)
    
    # Corner brackets
    l = 30
    cv2.line(frame, (10, 10), (10+l, 10), (0, 255, 0), 4) # Top-Left
    cv2.line(frame, (10, 10), (10, 10+l), (0, 255, 0), 4)
    
    cv2.line(frame, (w-10, 10), (w-10-l, 10), (0, 255, 0), 4) # Top-Right
    cv2.line(frame, (w-10, 10), (w-10, 10+l), (0, 255, 0), 4)
    
    cv2.line(frame, (10, h-10), (10+l, h-10), (0, 255, 0), 4) # Bottom-Left
    cv2.line(frame, (10, h-10), (10, h-10-l), (0, 255, 0), 4)

    cv2.line(frame, (w-10, h-10), (w-10-l, h-10), (0, 255, 0), 4) # Bottom-Right
    cv2.line(frame, (w-10, h-10), (w-10, h-10-l), (0, 255, 0), 4)
    
    # Header Background
    cv2.rectangle(frame, (15, 15), (350, 110), (0, 0, 0), -1)
    cv2.rectangle(frame, (15, 15), (350, 110), (0, 255, 0), 1)
    
    # Stats
    cv2.putText(frame, "REOS EDGE AI SYSTEM v2.0", (25, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
    cv2.putText(frame, f"FPS: {int(fps)}", (25, 65), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
    cv2.putText(frame, f"OBJECTS: {people_count}", (150, 65), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
    cv2.putText(frame, f"FIRE PROB: {fire_prob:.1f}%", (25, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 165, 255) if fire_prob > 0 else (0, 255, 0), 1)
    
    # Status Banner
    cv2.rectangle(frame, (w//2 - 150, h - 60), (w//2 + 150, h - 20), (0, 0, 0), -1)
    cv2.putText(frame, status_text, (w//2 - 120, h - 35), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

    # Blinking REC dot
    if int(time.time() * 2) % 2 == 0:
        cv2.circle(frame, (w-40, 40), 10, (0, 0, 255), -1)
        cv2.putText(frame, "LIVE", (w-90, 45), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

def detect_fire_and_people(frame):
    # 1. Fire Heuristic
    blur = cv2.GaussianBlur(frame, (15, 15), 0)
    hsv = cv2.cvtColor(blur, cv2.COLOR_BGR2HSV)
    lower_fire = np.array([0, 140, 180])
    upper_fire = np.array([30, 255, 255])
    mask = cv2.inRange(hsv, lower_fire, upper_fire)
    fire_pixels = cv2.countNonZero(mask)
    total_pixels = frame.shape[0] * frame.shape[1]
    fire_prob = (fire_pixels / total_pixels) * 1000 # Scale up for visibility
    
    is_fire = fire_prob > 2.0 # Threshold > 0.2%
    
    # 2. People Detection
    people_count = 0
    results = model(frame, verbose=False, stream=True)
    
    for r in results:
        boxes = r.boxes
        for box in boxes:
            if int(box.cls[0]) == 0: # Person
                people_count += 1
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 1)
                cv2.putText(frame, f"PERSON {box.conf[0]:.2f}", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)

    return is_fire, fire_prob, people_count, mask

def main():
    cap = None
    # Try indices safely
    for idx in range(2):
        print(f"[CAM] Testing index {idx}...")
        cap = cv2.VideoCapture(idx, cv2.CAP_DSHOW)
        if cap.isOpened():
            print(f"[CAM] Success at index {idx}")
            break
        cap.release()
    
    if not cap or not cap.isOpened():
        print("[ERROR] No Camera Found. Check if another app is using it.")
        return

    last_alert = 0
    prev_time = time.time()
    
    print("[SYSTEM] Starting Analysis Loop...")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("[ERROR] Frame read failed. Retrying...")
            time.sleep(1)
            continue
            
        curr_time = time.time()
        fps = 1 / (curr_time - prev_time)
        prev_time = curr_time

        # Analysis
        is_fire, fire_prob, people, fire_mask = detect_fire_and_people(frame)
        
        # Simulated Thermal Overlay (Pip)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        thermal = cv2.applyColorMap(gray, cv2.COLORMAP_MAGMA)
        roi_h, roi_w = 120, 160
        frame[h-roi_h-20:h-20, 20:20+roi_w] = cv2.resize(thermal, (roi_w, roi_h))
        cv2.rectangle(frame, (20, h-roi_h-20), (20+roi_w, h-20), (255, 255, 255), 1)
        cv2.putText(frame, "THERMAL", (25, h-roi_h), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1)

        # Draw Fire regions
        if is_fire:
            contours, _ = cv2.findContours(fire_mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
            for c in contours:
                if cv2.contourArea(c) > 50:
                    x, y, w, h_rect = cv2.boundingRect(c)
                    cv2.rectangle(frame, (x, y), (x+w, y+h_rect), (0, 0, 255), 2)

            status = f"THREAT DETECTED"
            color = (0, 0, 255)
            
            # Send Alert
            if curr_time - last_alert > ALERT_COOLDOWN:
                threat = "High" if people > 0 else "Medium"
                payload = create_payload(frame, threat, people)
                send_alert_async(payload)
                last_alert = curr_time
        else:
            status = "SECTOR SECURE"
            color = (0, 255, 0)
        
        # Draw HUD (Last step to be on top)
        draw_hud(frame, fps, fire_prob, people, status, color)
        h, w = frame.shape[:2] # Re-fetch just in case

        cv2.imshow('REOS AI GUARD - TERMINAL', frame)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
