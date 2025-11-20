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
        
        const result = isNgrok || readOnlyParam === 'true';
        
        console.log('🔐 AccessControl.checkReadOnlyMode:', {
            hostname,
            isNgrok,
            readOnlyParam,
            result
        });
        
        return result;
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
        // Ocultar tudo exceto o timer principal
        const hideSelectors = [
            '.controls',           // Botões de controle
            '.mode-buttons',       // Botões de modo
            '.settings-btn',       // Botão de configurações
            '#settingsBtn',
            '.session-history-sidebar',  // Histórico lateral
            '.subject-info',       // Info de matéria
            '.cycle-info',         // Info de ciclo
            'nav',                 // Navegação
            'header',              // Cabeçalho se houver
            '.stats-container',    // Estatísticas
            '.footer'              // Rodapé
        ];
        
        hideSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.display = 'none';
            });
        });
        
        // Centralizar e destacar o timer
        const timerCard = document.querySelector('.timer-card');
        if (timerCard) {
            timerCard.style.margin = '80px auto';
            timerCard.style.maxWidth = '500px';
            timerCard.style.transform = 'scale(1.2)';
        }
        
        // Desabilitar todos os botões restantes
        const controlButtons = document.querySelectorAll('button');
        controlButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.3';
            btn.style.cursor = 'not-allowed';
            btn.title = 'Modo somente visualização';
        });

        // Desabilitar inputs
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.disabled = true;
            input.readOnly = true;
        });

        // Prevenir todas as interações
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (target.matches('button, input, select, textarea, .control-btn, .mode-btn, a')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, true);

        console.log('🔒 Modo visualização ativo - apenas timer visível');
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
