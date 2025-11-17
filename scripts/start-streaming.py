#!/usr/bin/env python3
"""
🍅 Pomodoro Boladão - Script de Inicialização em Modo Streaming
Multiplataforma: Linux, Windows e macOS
"""

import os
import platform
import signal
import subprocess
import sys
import time
from pathlib import Path

# Detectar diretório do projeto
SCRIPT_DIR = Path(__file__).parent.resolve()
PROJECT_DIR = SCRIPT_DIR.parent.parent
BACKEND_DIR = PROJECT_DIR / "backend"
FRONTEND_DIR = PROJECT_DIR / "frontend"
LOGS_DIR = PROJECT_DIR / "logs"

# Configurações
BACKEND_PORT = 8000
FRONTEND_PORT = 3000

class StreamingLauncher:
    def __init__(self):
        self.backend_process = None
        self.frontend_process = None
        self.ngrok_available = False
        self.platform = platform.system()
        
    def print_banner(self):
        """Exibe banner de inicialização"""
        print("\n" + "="*50)
        print("🍅 Pomodoro Boladão - Modo Streaming")
        print("="*50)
        print(f"📁 Projeto: {PROJECT_DIR}")
        print(f"🖥️  Sistema: {self.platform}")
        print()
    
    def check_ngrok(self):
        """Verifica se ngrok está instalado"""
        try:
            result = subprocess.run(
                ['ngrok', 'version'],
                capture_output=True,
                text=True,
                timeout=5
            )
            if result.returncode == 0:
                print("✅ ngrok encontrado")
                self.ngrok_available = True
                return True
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass
        
        print("⚠️  ngrok não encontrado!")
        print()
        if self.platform == "Linux":
            print("Instale com: sudo snap install ngrok")
        elif self.platform == "Darwin":  # macOS
            print("Instale com: brew install ngrok/ngrok/ngrok")
        elif self.platform == "Windows":
            print("Baixe em: https://ngrok.com/download")
        print()
        
        resposta = input("Deseja continuar sem ngrok? (s/N): ").strip().lower()
        if resposta == 's':
            self.ngrok_available = False
            return False
        else:
            sys.exit(1)
    
    def check_dependencies(self):
        """Verifica dependências do backend"""
        print("📦 Verificando dependências do backend...")
        
        try:
            import fastapi
            import uvicorn
            print("✅ Dependências já instaladas")
            return True
        except ImportError:
            print("📥 Instalando dependências...")
            requirements = BACKEND_DIR / "requirements.txt"
            subprocess.run([
                sys.executable, "-m", "pip", "install", "-r", str(requirements)
            ])
            return True
    
    def start_frontend(self):
        """Inicia servidor frontend"""
        print(f"\n🌐 Iniciando servidor frontend na porta {FRONTEND_PORT}...")
        
        LOGS_DIR.mkdir(exist_ok=True)
        log_file = LOGS_DIR / "frontend.log"
        
        with open(log_file, "w") as f:
            self.frontend_process = subprocess.Popen(
                [sys.executable, "-m", "http.server", str(FRONTEND_PORT)],
                stdout=f,
                stderr=subprocess.STDOUT,
                cwd=FRONTEND_DIR
            )
        
        time.sleep(2)
        print(f"✅ Frontend rodando em http://localhost:{FRONTEND_PORT}")
    
    def start_backend(self):
        """Inicia backend com suporte a ngrok"""
        print(f"\n🚀 Iniciando backend na porta {BACKEND_PORT}...")
        
        # Configurar variável de ambiente para ngrok
        env = os.environ.copy()
        if self.ngrok_available:
            env['ENABLE_NGROK'] = 'true'
            print("🌍 Habilitando túnel público com ngrok...")
        else:
            env['ENABLE_NGROK'] = 'false'
        
        LOGS_DIR.mkdir(exist_ok=True)
        log_file = LOGS_DIR / "backend.log"
        
        with open(log_file, "w") as f:
            self.backend_process = subprocess.Popen(
                [sys.executable, "-m", "uvicorn", "backend.main:app", 
                 "--host", "0.0.0.0", "--port", str(BACKEND_PORT)],
                stdout=f,
                stderr=subprocess.STDOUT,
                cwd=PROJECT_DIR,
                env=env
            )
        
        time.sleep(3)
        print(f"✅ Backend rodando em http://localhost:{BACKEND_PORT}")
    
    def get_ngrok_url(self):
        """Obtém URL pública do ngrok"""
        if not self.ngrok_available:
            return None
        
        print("\n⏳ Aguardando túnel ngrok...")
        time.sleep(3)
        
        try:
            import requests
            response = requests.get('http://localhost:4040/api/tunnels', timeout=5)
            tunnels = response.json()
            
            if tunnels.get('tunnels'):
                for tunnel in tunnels['tunnels']:
                    if tunnel['public_url'].startswith('https'):
                        url = tunnel['public_url']
                        print(f"🌍 URL Pública: {url}")
                        print("📱 QR Code disponível no canto inferior direito do app")
                        return url
        except Exception as e:
            print(f"⚠️  Não foi possível obter URL do ngrok: {e}")
            print("   Verifique em: http://localhost:4040")
        
        return None
    
    def show_info(self):
        """Exibe informações de acesso"""
        print("\n" + "="*50)
        print("✅ Pomodoro Boladão está rodando!")
        print("="*50)
        print()
        print("📍 URLs:")
        print(f"  Frontend:  http://localhost:{FRONTEND_PORT}")
        print(f"  Backend:   http://localhost:{BACKEND_PORT}")
        print(f"  API Docs:  http://localhost:{BACKEND_PORT}/docs")
        
        if self.ngrok_available:
            self.get_ngrok_url()
        
        print()
        print("="*50)
        print()
        print("🎬 Funcionalidades de Streaming ativas:")
        print("  ✨ Animações de status")
        print("  📊 Barra de progresso grande")
        print("  🎉 Relatório visual ao final")
        print("  📚 Histórico lateral")
        if self.ngrok_available:
            print("  📱 QR Code com ngrok")
        print()
        print("="*50)
        print()
        print("Para parar os servidores, pressione Ctrl+C")
        print()
    
    def open_browser(self):
        """Abre o navegador automaticamente"""
        import webbrowser
        time.sleep(1)
        
        try:
            webbrowser.open(f"http://localhost:{FRONTEND_PORT}")
            print("✅ Navegador aberto")
        except Exception:
            print("⚠️  Não foi possível abrir o navegador automaticamente")
    
    def cleanup(self, signum=None, frame=None):
        """Para os processos ao encerrar"""
        print("\n\n🛑 Parando servidores...")
        
        if self.backend_process:
            self.backend_process.terminate()
            self.backend_process.wait(timeout=5)
        
        if self.frontend_process:
            self.frontend_process.terminate()
            self.frontend_process.wait(timeout=5)
        
        print("✅ Servidores parados")
        sys.exit(0)
    
    def run(self):
        """Executa o launcher"""
        # Registrar handler de sinal
        signal.signal(signal.SIGINT, self.cleanup)
        signal.signal(signal.SIGTERM, self.cleanup)
        
        try:
            self.print_banner()
            self.check_ngrok()
            self.check_dependencies()
            self.start_frontend()
            self.start_backend()
            self.show_info()
            self.open_browser()
            
            # Manter rodando
            print("✅ Tudo pronto! Aguardando...\n")
            while True:
                time.sleep(1)
                
        except KeyboardInterrupt:
            self.cleanup()
        except Exception as e:
            print(f"\n❌ Erro: {e}")
            self.cleanup()

def main():
    launcher = StreamingLauncher()
    launcher.run()

if __name__ == "__main__":
    main()
