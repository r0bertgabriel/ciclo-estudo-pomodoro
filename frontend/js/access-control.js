/**
 * Módulo de controle de acesso - Modo somente leitura
 */

class AccessControl {
    constructor() {
        this.isReadOnly = this.checkReadOnlyMode();
        this.init();
    }

    checkReadOnlyMode() {
        // Verificar se está acessando via ngrok (visitante)
        const hostname = window.location.hostname;
        const isNgrok = hostname.includes('ngrok') || hostname.includes('ngrok.io') || hostname.includes('ngrok-free.app');
        
        // Também verificar parâmetro na URL
        const urlParams = new URLSearchParams(window.location.search);
        const readOnlyParam = urlParams.get('readonly');
        
        return isNgrok || readOnlyParam === 'true';
    }

    init() {
        if (this.isReadOnly) {
            console.log('🔒 Modo somente leitura ativado');
            this.applyReadOnlyMode();
            this.showReadOnlyBanner();
        }
    }

    applyReadOnlyMode() {
        // Aguardar DOM carregar
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.disableControls());
        } else {
            this.disableControls();
        }
    }

    disableControls() {
        // Desabilitar todos os botões de controle
        const controlButtons = document.querySelectorAll(
            '.control-btn, .mode-btn, .settings-btn, #settingsBtn, ' +
            'button[type="submit"], button[type="button"]'
        );
        
        controlButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
            btn.title = 'Modo somente visualização';
        });

        // Desabilitar inputs
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.disabled = true;
            input.readOnly = true;
        });

        // Ocultar botões que não fazem sentido em modo leitura
        const hideElements = document.querySelectorAll(
            '.session-history-toggle'
        );
        hideElements.forEach(el => {
            el.style.display = 'none';
        });

        // Prevenir cliques
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (target.matches('button, input, select, textarea, .control-btn, .mode-btn')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, true);

        console.log('🔒 Controles desabilitados');
    }

    showReadOnlyBanner() {
        const banner = document.createElement('div');
        banner.className = 'readonly-banner';
        banner.innerHTML = `
            <span class="readonly-icon">👁️</span>
            <span class="readonly-text">Modo Visualização</span>
            <span class="readonly-info">Você está acompanhando este timer em tempo real</span>
        `;
        document.body.appendChild(banner);

        // Esconder QR Code em modo leitura (não faz sentido)
        const qrContainer = document.querySelector('.qr-code-container');
        if (qrContainer) {
            qrContainer.style.display = 'none';
        }
    }
}

// Inicializar controle de acesso
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.accessControl = new AccessControl();
    });
} else {
    window.accessControl = new AccessControl();
}

export default AccessControl;
