"""
Módulo de integração com ngrok para acesso público
"""
import subprocess
from typing import Optional


class NgrokManager:
    def __init__(self, port: int = 8000):
        self.port = port
        self.tunnel_url: Optional[str] = None
        self.process: Optional[subprocess.Popen] = None
    
    def start_tunnel(self) -> Optional[str]:
        """Inicia túnel ngrok e retorna URL pública"""
        try:
            # Verificar se ngrok está instalado
            result = subprocess.run(['which', 'ngrok'], capture_output=True, text=True)
            if result.returncode != 0:
                print("❌ ngrok não encontrado. Instale com: snap install ngrok")
                return None
            
            # Iniciar túnel ngrok em background
            self.process = subprocess.Popen(
                ['ngrok', 'http', str(self.port), '--log=stdout'],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            # Aguardar um pouco para ngrok inicializar
            import time
            time.sleep(3)
            
            # Obter URL do túnel via API do ngrok
            import requests
            try:
                response = requests.get('http://127.0.0.1:4040/api/tunnels')
                tunnels = response.json()
                
                if tunnels.get('tunnels'):
                    self.tunnel_url = tunnels['tunnels'][0]['public_url']
                    # Preferir HTTPS
                    for tunnel in tunnels['tunnels']:
                        if tunnel['public_url'].startswith('https'):
                            self.tunnel_url = tunnel['public_url']
                            break
                    
                    print(f"✅ Túnel ngrok ativo: {self.tunnel_url}")
                    return self.tunnel_url
            except Exception as e:
                print(f"⚠️ Erro ao obter URL do túnel: {e}")
                return None
                
        except Exception as e:
            print(f"❌ Erro ao iniciar ngrok: {e}")
            return None
    
    def stop_tunnel(self):
        """Para o túnel ngrok"""
        if self.process:
            self.process.terminate()
            self.process.wait()
            print("🛑 Túnel ngrok encerrado")
    
    def get_url(self) -> Optional[str]:
        """Retorna URL pública do túnel"""
        return self.tunnel_url

# Instância global
ngrok_manager = None

def init_ngrok(port: int = 8000) -> Optional[str]:
    """Inicializa ngrok e retorna URL pública"""
    global ngrok_manager
    ngrok_manager = NgrokManager(port)
    return ngrok_manager.start_tunnel()

def get_ngrok_url() -> Optional[str]:
    """Retorna URL atual do ngrok"""
    if ngrok_manager:
        url = ngrok_manager.get_url()
        if url:
            print(f"📡 URL ngrok solicitada: {url}")
        else:
            print("⚠️ Ngrok manager existe mas URL é None")
        return url
    else:
        print("⚠️ Ngrok manager não inicializado")
    return None

def stop_ngrok():
    """Para o túnel ngrok"""
    if ngrok_manager:
        ngrok_manager.stop_tunnel()
