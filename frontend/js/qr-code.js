/**
 * Módulo de QR Code com integração ngrok
 */

import { API_BASE_URL } from './config.js';

class QRCodeManager {
    constructor() {
        this.container = null;
        this.checkInterval = null;
        this.init();
    }

    init() {
        this.createContainer();
        this.checkNgrokStatus();
        // Verificar a cada 30 segundos
        this.checkInterval = setInterval(() => this.checkNgrokStatus(), 30000);
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'qr-code-container';
        this.container.style.display = 'none';
        this.container.innerHTML = `
            <div class="qr-code-title">🌍 Acesso Público</div>
            <canvas id="qr-canvas"></canvas>
            <div class="qr-code-label">Escaneie para acessar</div>
            <div class="qr-code-url" id="qr-url"></div>
            <button class="qr-copy-btn" id="qr-copy-btn" title="Copiar link">
                📋 Copiar Link
            </button>
        `;
        document.body.appendChild(this.container);
        
        // Adicionar evento de copiar
        const copyBtn = document.getElementById('qr-copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyUrl());
        }
    }

    async checkNgrokStatus() {
        try {
            console.log('🔍 Verificando status do ngrok...');
            const response = await fetch(`${API_BASE_URL}/api/ngrok/url`);
            console.log('📡 Resposta do servidor:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('📦 Dados recebidos:', data);
                
                if (data.url) {
                    console.log('✅ URL do ngrok encontrada:', data.url);
                    this.currentUrl = data.url;
                    this.generateQRCode(data.url);
                    this.updateUrlDisplay(data.url);
                    this.container.style.display = 'block';
                } else {
                    console.log('⚠️ Ngrok não está ativo');
                    this.container.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('❌ Erro ao verificar ngrok:', error);
            this.container.style.display = 'none';
        }
    }
    
    updateUrlDisplay(url) {
        const urlElement = document.getElementById('qr-url');
        if (urlElement) {
            // Mostrar URL encurtada
            const shortUrl = url.replace('https://', '').replace('http://', '');
            urlElement.textContent = shortUrl;
            urlElement.title = url;
        }
    }
    
    copyUrl() {
        if (this.currentUrl) {
            navigator.clipboard.writeText(this.currentUrl).then(() => {
                const btn = document.getElementById('qr-copy-btn');
                if (btn) {
                    btn.textContent = '✅ Copiado!';
                    setTimeout(() => {
                        btn.textContent = '📋 Copiar Link';
                    }, 2000);
                }
            }).catch(err => {
                console.error('Erro ao copiar:', err);
                alert('Link: ' + this.currentUrl);
            });
        }
    }

    generateQRCode(url) {
        const canvas = document.getElementById('qr-canvas');
        if (!canvas) {
            console.error('❌ Canvas não encontrado');
            return;
        }
        
        console.log('🎨 Gerando QR Code para:', url);
        
        // Sempre usar API pública (mais confiável e sem dependências)
        const img = new Image();
        img.crossOrigin = "anonymous";
        
        img.onload = () => {
            canvas.width = 120;
            canvas.height = 120;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, 120, 120);
            ctx.drawImage(img, 0, 0, 120, 120);
            console.log('✅ QR Code renderizado com sucesso');
        };
        
        img.onerror = (error) => {
            console.error('❌ Erro ao carregar imagem do QR Code:', error);
            // Fallback: desenhar placeholder
            canvas.width = 120;
            canvas.height = 120;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, 120, 120);
            ctx.fillStyle = '#333';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('QR Code', 60, 55);
            ctx.font = '10px Arial';
            ctx.fillText('Erro ao gerar', 60, 75);
        };
        
        // Gerar QR Code via API
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(url)}`;
        console.log('🔗 URL da API QR:', qrUrl);
        img.src = qrUrl;
    }

    destroy() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
        if (this.container) {
            this.container.remove();
        }
    }
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.qrCodeManager = new QRCodeManager();
    });
} else {
    window.qrCodeManager = new QRCodeManager();
}

export default QRCodeManager;
