# 1️⃣ Terminal 1 - Backend (INICIAR PRIMEIRO!)
cd /home/br4b0/Desktop/Development/in_silico/prototipos/ciclo-estudo-pomodoro
python3 -m uvicorn backend.main:app --reload --port 8000

# 2️⃣ Terminal 2 - Frontend
python3 -m http.server 8080