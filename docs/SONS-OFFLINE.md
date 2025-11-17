# 🔊 Sistema de Sons - Pomodoro Boladão

## 🎵 100% Offline - Web Audio API

O sistema de sons do Pomodoro Boladão é **totalmente offline** e não depende de arquivos externos ou conexão com a internet. Todos os sons são gerados em tempo real usando a **Web Audio API** nativa do navegador.

---

## 🎼 Sons Disponíveis

### 1. 🔔 **Sino** (bell)
- **Características**: Som clássico de sino
- **Notas**: 800Hz → 600Hz
- **Duração**: ~0.7s
- **Uso**: Som padrão, familiar e agradável

### 2. 🎵 **Carrilhão** (chime)
- **Características**: Melodia ascendente de 3 notas
- **Notas**: C5 (523Hz) → E5 (659Hz) → G5 (784Hz)
- **Duração**: ~0.85s
- **Uso**: Som musical e motivador

### 3. 💻 **Digital** (digital)
- **Características**: Bipes eletrônicos repetidos
- **Notas**: 3x 1000Hz (onda quadrada)
- **Duração**: ~0.5s
- **Uso**: Som moderno e direto

### 4. 🌿 **Natureza** (nature)
- **Características**: Tom suave e orgânico
- **Notas**: A4 (440Hz) → C#5 (550Hz) → E5 (660Hz)
- **Duração**: ~1.0s
- **Uso**: Som relaxante e natural

### 5. 🎉 **Sucesso** (success)
- **Características**: Sequência rápida ascendente
- **Notas**: C5 → E5 → G5 → C6 (523Hz → 1047Hz)
- **Duração**: ~0.75s
- **Uso**: Conquistas e marcos importantes

### 6. 😌 **Calmo** (calm)
- **Características**: Tons graves e suaves
- **Notas**: G4 (392Hz) → E4 (330Hz)
- **Duração**: ~0.9s
- **Uso**: Fim de pausas, transições suaves

### 7. ⚡ **Energético** (energetic)
- **Características**: Sequência rápida e estimulante
- **Notas**: A5 → C6 → E6 → G6 (880Hz → 1568Hz) (onda dente de serra)
- **Duração**: ~0.5s
- **Uso**: Motivação extra, sessões intensas

### 8. 🧘 **Zen** (zen)
- **Características**: Sons profundos e meditativos
- **Notas**: C4 (256Hz) → G4 (384Hz)
- **Duração**: ~1.3s
- **Uso**: Meditação, foco profundo

### 9. 🎊 **Celebração** (celebration)
- **Características**: Arpejo completo ascendente
- **Notas**: C5 → E5 → G5 → C6 → E6 → G6 (523Hz → 1568Hz)
- **Duração**: ~0.95s
- **Uso**: Metas concluídas, grandes conquistas

### 10. 🔅 **Sutil** (subtle)
- **Características**: Som único e discreto
- **Notas**: 600Hz
- **Duração**: ~0.2s
- **Uso**: Notificações discretas

---

## 🔧 Características Técnicas

### Web Audio API
- **Osciladores**: Geram ondas sonoras em tempo real
- **Tipos de Onda**: 
  - `sine` (senoidal) - Sons suaves e musicais
  - `square` (quadrada) - Sons eletrônicos
  - `sawtooth` (dente de serra) - Sons brilhantes
  - `triangle` (triangular) - Sons suaves intermediários

### Controle de Volume
- **Attack**: Subida rápida (0.01s)
- **Decay/Release**: Descida exponencial natural
- **Volume Base**: 0.2 - 0.5 (ajustável por som)

### Filtros
- **Lowpass Filter**: Suaviza sons agudos
- **Frequência de Corte**: 2000Hz
- **Q Factor**: 1

### Contexto de Áudio
- **Taxa de Amostragem**: Padrão do sistema (geralmente 44.1kHz ou 48kHz)
- **Latência**: Mínima (<10ms)
- **CPU**: Otimizado para baixo consumo

---

## 🎨 Personalização

### Adicionar Novo Som

1. Edite `frontend/js/config.js`:

```javascript
export const SOUND_PROFILES = {
    // ... sons existentes ...
    
    meuSom: {
        name: '🎸 Meu Som',
        notes: [
            { freq: 440, duration: 0.3, type: 'sine', volume: 0.4 },
            { freq: 550, duration: 0.3, type: 'sine', volume: 0.4 }
        ]
    }
};
```

2. Adicione opção no `frontend/index.html`:

```html
<option value="meuSom">🎸 Meu Som</option>
```

### Parâmetros das Notas

- **freq**: Frequência em Hz (20-20000)
- **duration**: Duração em segundos (0.1-2.0)
- **type**: Tipo de onda (`sine`, `square`, `sawtooth`, `triangle`)
- **volume**: Volume de 0 a 1 (0.1-0.6 recomendado)

---

## 🎯 Contextos de Uso

### Fim de Sessão de Foco
- Som principal escolhido pelo usuário
- Notificação de conclusão
- Som mais proeminente

### Fim de Pausa
- Som `calm` automático
- Mais suave que o som de foco
- Transição gentil

### Meta Concluída
- Som `celebration` automático
- Som especial de conquista
- Maior duração e complexidade

---

## 📱 Compatibilidade

### Navegadores Suportados
- ✅ Chrome/Edge (Chromium) 90+
- ✅ Firefox 89+
- ✅ Safari 14+
- ✅ Opera 76+

### Dispositivos
- ✅ Desktop (Windows, macOS, Linux)
- ✅ Mobile (iOS, Android)
- ✅ Tablets
- ✅ Progressive Web App (PWA)

### Requisitos
- Navegador moderno com suporte a Web Audio API
- Nenhum arquivo externo necessário
- Nenhuma conexão com internet necessária
- Funciona completamente offline

---

## 🚀 Vantagens

1. **Zero Dependências**: Sem arquivos MP3, OGG ou WAV
2. **Tamanho Mínimo**: Apenas código JavaScript (~2KB)
3. **Totalmente Offline**: Funciona sem internet
4. **Personalizável**: Fácil adicionar novos sons
5. **Performance**: Baixo uso de CPU e memória
6. **Cross-platform**: Funciona em todos os dispositivos
7. **Sem Lag**: Som instantâneo, sem tempo de carregamento
8. **Qualidade**: Som limpo e consistente

---

## 🔍 Referências

- [Web Audio API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [OscillatorNode - MDN](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode)
- [Musical Note Frequencies](https://pages.mtu.edu/~suits/notefreqs.html)

---

## 💡 Dicas

- **Teste os Sons**: Use o botão "🔊 Testar" nas configurações
- **Volume**: Ajuste o volume do sistema conforme preferência
- **Personalização**: Experimente diferentes tipos de onda
- **Frequências**: Use ferramentas online para converter notas musicais em Hz
- **Duração**: Sons entre 0.5-1.5s são mais agradáveis

---

**Desenvolvido com ❤️ usando Web Audio API**
