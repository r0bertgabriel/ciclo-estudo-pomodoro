#!/usr/bin/env python3
"""
🍅 Pomodoro Boladão - Launcher
Script Python para iniciar a aplicação com interface gráfica
"""

import subprocess
import sys
import time
import webbrowser
from pathlib import Path

try:
    import tkinter as tk
    from tkinter import messagebox
    HAS_GUI = True
except ImportError:
    tk = None  # type: ignore
    messagebox = None  # type: ignore
    HAS_GUI = False

# Configurações
BACKEND_PORT = 8000
FRONTEND_PORT = 8080
BACKEND_CMD = [sys.executable, "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", str(BACKEND_PORT)]
FRONTEND_CMD = [sys.executable, "-m", "http.server", str(FRONTEND_PORT)]

class PomodoroLauncher:
    def __init__(self):
        self.backend_process = None
        self.frontend_process = None
        self.project_dir = Path(__file__).parent
        
    def check_dependencies(self):
        """Verifica se as dependências estão instaladas"""
        try:
            import importlib.util
            fastapi_spec = importlib.util.find_spec("fastapi")
            uvicorn_spec = importlib.util.find_spec("uvicorn")
            return fastapi_spec is not None and uvicorn_spec is not None
        except (ImportError, ValueError):
            return False
    
    def install_dependencies(self):
        """Instala dependências do backend"""
        print("📦 Instalando dependências...")
        requirements = self.project_dir / "backend" / "requirements.txt"
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", str(requirements)])
    
    def start_backend(self):
        """Inicia o backend"""
        print(f"🚀 Iniciando backend na porta {BACKEND_PORT}...")
        log_file = self.project_dir / "logs" / "backend.log"
        log_file.parent.mkdir(exist_ok=True)
        
        with open(log_file, "w") as f:
            self.backend_process = subprocess.Popen(
                BACKEND_CMD,
                stdout=f,
                stderr=subprocess.STDOUT,
                cwd=self.project_dir
            )
        time.sleep(3)
        print("✅ Backend iniciado!")
    
    def start_frontend(self):
        """Inicia o frontend"""
        print(f"🚀 Iniciando frontend na porta {FRONTEND_PORT}...")
        log_file = self.project_dir / "logs" / "frontend.log"
        
        # Executar http.server de dentro da pasta frontend
        frontend_dir = self.project_dir / "frontend"
        
        with open(log_file, "w") as f:
            self.frontend_process = subprocess.Popen(
                FRONTEND_CMD,
                stdout=f,
                stderr=subprocess.STDOUT,
                cwd=frontend_dir  # ✅ Mudado de project_dir para frontend_dir
            )
        time.sleep(2)
        print("✅ Frontend iniciado!")
    
    def open_browser(self):
        """Abre o navegador"""
        print("🌐 Abrindo navegador...")
        # Como http.server agora roda de dentro de /frontend/, 
        # index.html está na raiz do servidor
        
        # Suprimir erros do Fontconfig (comum no Linux)
        import os
        os.environ['FONTCONFIG_FILE'] = '/dev/null'
        os.environ['FONTCONFIG_PATH'] = '/dev/null'
        
        try:
            webbrowser.open(f"http://localhost:{FRONTEND_PORT}/")
        except Exception:
            print("⚠️ Não foi possível abrir o navegador automaticamente.")
            print(f"   Por favor, abra manualmente: http://localhost:{FRONTEND_PORT}/")

    
    def stop(self):
        """Para os processos"""
        print("\n🛑 Parando aplicação...")
        if self.backend_process:
            self.backend_process.terminate()
        if self.frontend_process:
            self.frontend_process.terminate()
        print("✅ Aplicação parada!")
    
    def run_gui(self):
        """Executa com interface gráfica"""
        if not HAS_GUI or tk is None or messagebox is None:
            print("❌ Interface gráfica não disponível. Use --console")
            return
            
        root = tk.Tk()
        root.title("Pomodoro Boladao")
        root.geometry("400x300")
        root.resizable(False, False)
        
        # Label título
        title = tk.Label(root, text="Pomodoro Boladao", font=("Arial", 20, "bold"), fg="#d32f2f")
        title.pack(pady=20)
        
        # Status
        self.status_label = tk.Label(root, text="Pronto para iniciar", font=("Arial", 12))
        self.status_label.pack(pady=10)
        
        # Frame para botões
        button_frame = tk.Frame(root)
        button_frame.pack(pady=20)
        
        # Garantir que messagebox não é None para o type checker
        assert messagebox is not None
        
        def start_app():
            assert messagebox is not None  # Para o type checker
            self.status_label.config(text="Iniciando...")
            root.update()
            
            if not self.check_dependencies():
                if messagebox.askyesno("Dependências", "Dependências não instaladas. Instalar agora?"):
                    self.install_dependencies()
                else:
                    self.status_label.config(text="Cancelado")
                    return
            
            try:
                self.start_backend()
                self.start_frontend()
                self.open_browser()
                self.status_label.config(text="✅ Aplicação rodando!")
                start_btn.config(state="disabled")
                stop_btn.config(state="normal")
                browser_btn.config(state="normal")
            except Exception as e:
                messagebox.showerror("Erro", f"Erro ao iniciar: {e}")
                self.status_label.config(text="❌ Erro ao iniciar")
        
        def stop_app():
            self.stop()
            self.status_label.config(text="Aplicação parada")
            start_btn.config(state="normal")
            stop_btn.config(state="disabled")
            browser_btn.config(state="disabled")
        
        def open_browser_window():
            self.open_browser()
        
        def on_close():
            assert messagebox is not None  # Para o type checker
            if self.backend_process or self.frontend_process:
                if messagebox.askyesno("Sair", "A aplicação está rodando. Deseja parar e sair?"):
                    self.stop()
                    root.destroy()
            else:
                root.destroy()
        
        # Botões
        start_btn = tk.Button(button_frame, text="▶ Iniciar", command=start_app, 
                             width=15, height=2, font=("Arial", 10, "bold"), bg="#4CAF50", fg="white")
        start_btn.grid(row=0, column=0, padx=5)
        
        stop_btn = tk.Button(button_frame, text="■ Parar", command=stop_app,
                            width=15, height=2, font=("Arial", 10, "bold"), bg="#f44336", fg="white", state="disabled")
        stop_btn.grid(row=0, column=1, padx=5)
        
        browser_btn = tk.Button(button_frame, text="Abrir Navegador", command=open_browser_window,
                               width=32, height=2, font=("Arial", 10), bg="#2196F3", fg="white", state="disabled")
        browser_btn.grid(row=1, column=0, columnspan=2, pady=10)
        
        # Info
        info = tk.Label(root, text=f"Timer: localhost:{FRONTEND_PORT}/\n"
                                  f"Ciclos: localhost:{FRONTEND_PORT}/ciclos.html\n"
                                  f"API: localhost:{BACKEND_PORT}/docs",
                       font=("Arial", 9), fg="gray")
        info.pack(pady=10)
        
        root.protocol("WM_DELETE_WINDOW", on_close)
        root.mainloop()
    
    def run_console(self):
        """Executa sem interface gráfica"""
        print("\n" + "="*50)
        print("🍅 POMODORO BOLADÃO - LAUNCHER")
        print("="*50 + "\n")
        
        if not self.check_dependencies():
            print("⚠️  Dependências não encontradas!")
            resposta = input("Instalar agora? (s/n): ")
            if resposta.lower() == 's':
                self.install_dependencies()
            else:
                print("Cancelado.")
                return
        
        try:
            self.start_backend()
            self.start_frontend()
            self.open_browser()
            
            print("\n" + "="*50)
            print("✅ APLICAÇÃO RODANDO!")
            print("="*50)
            print(f"\n📱 Timer:  http://localhost:{FRONTEND_PORT}/")
            print(f"📚 Ciclos: http://localhost:{FRONTEND_PORT}/ciclos.html")
            print(f"📊 Dashboard: http://localhost:{FRONTEND_PORT}/dashboard.html")
            print(f"🔧 API:    http://localhost:{BACKEND_PORT}/docs")
            print("\n💡 Pressione Ctrl+C para parar\n")
            
            # Manter rodando
            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                pass
            
        except Exception as e:
            print(f"\n❌ Erro: {e}")
        finally:
            self.stop()

def main():
    launcher = PomodoroLauncher()
    
    if HAS_GUI and "--console" not in sys.argv:
        launcher.run_gui()
    else:
        launcher.run_console()

if __name__ == "__main__":
    main()
