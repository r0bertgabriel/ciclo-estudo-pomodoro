/**
 * Configurações e constantes da aplicação
 */

export const DEFAULT_SETTINGS = {
    focusTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    sessionsBeforeLongBreak: 4,
    autoStartBreaks: true,
    autoStartPomodoros: false,
    notifications: true,
    alarmSound: 'bell',
    currentTemplate: 'default'
};

export const TIME_TEMPLATES = {
    default: {
        name: 'Padrão (25-5-15)',
        focusTime: 25,
        shortBreakTime: 5,
        longBreakTime: 15,
        sessionsBeforeLongBreak: 4
    },
    intense: {
        name: 'Intenso (40-10-20)',
        focusTime: 40,
        shortBreakTime: 10,
        longBreakTime: 20,
        sessionsBeforeLongBreak: 4
    },
    short: {
        name: 'Curto (15-3-10)',
        focusTime: 15,
        shortBreakTime: 3,
        longBreakTime: 10,
        sessionsBeforeLongBreak: 3
    },
    long: {
        name: 'Longo (50-10-30)',
        focusTime: 50,
        shortBreakTime: 10,
        longBreakTime: 30,
        sessionsBeforeLongBreak: 3
    }
};

export const STORAGE_KEYS = {
    SETTINGS: 'pomodoro_settings',
    STATS: 'pomodoro_stats',
    STUDY_CYCLE: 'pomodoro_study_cycle',
    CYCLE_PROGRESS: 'pomodoro_cycle_progress',
    CUSTOM_TEMPLATES: 'pomodoro_custom_templates'
};

export const TIMER_MODES = {
    FOCUS: 'focus',
    SHORT_BREAK: 'shortBreak',
    LONG_BREAK: 'longBreak'
};

export const THEME_COLORS = {
    [TIMER_MODES.FOCUS]: {
        primary: '#e74c3c',
        glow: 'rgba(231, 76, 60, 0.4)',
        bgGradient1: '#2d1b1b',
        bgGradient2: '#1a0f0f'
    },
    [TIMER_MODES.SHORT_BREAK]: {
        primary: '#3498db',
        glow: 'rgba(52, 152, 219, 0.4)',
        bgGradient1: '#1b2b3d',
        bgGradient2: '#0f1a2d'
    },
    [TIMER_MODES.LONG_BREAK]: {
        primary: '#2ecc71',
        glow: 'rgba(46, 204, 113, 0.4)',
        bgGradient1: '#1b3d2b',
        bgGradient2: '#0f2d1a'
    }
};

export const MOTIVATIONAL_QUOTES = {
    [TIMER_MODES.FOCUS]: {
        start: [
            "Estudar não garante sucesso. Mas a falta dele garante fracasso com mais estilo.",
            "Amanhã você vai agradecer por não ter começado hoje — afinal, nada mudou mesmo.",
            "Você não está cansado, só percebeu que nada disso faz sentido.",
            "Quem cedo madruga... fica com sono o dia inteiro.",
            "Estudar é transformar café em ansiedade."
        ],
        running: [
            "Continue estudando! Um dia o conhecimento vai te aquecer — quando você morar debaixo da ponte.",
            "O importante não é entender, é parecer ocupado.",
            "Estude como se a sua vida dependesse disso. (Spoiler: talvez nem assim dê certo.)",
            "Acredite nos seus sonhos... mesmo que todos riam, inclusive você.",
            "Força! Falta só todo o resto.",
            "Nem o Ctrl+S salva mais você.",
            "Platão estudou tanto e morreu. Pense nisso.",
            "Estude, porque nada dói mais do que descobrir que você é burro tarde demais.",
            "Pense positivo: cada reprovação é uma oportunidade de falhar com mais experiência.",
            "Você não é preguiçoso. Só percebeu que o esforço raramente compensa."
        ],
        almostDone: [
            "Quase lá! Mas não comemore ainda, tem mais pela frente.",
            "Reta final! (Até a próxima reta final.)",
            "Parabéns! Você quase terminou... essa parte insignificante.",
            "Falta pouco! Para descobrir que não adiantou nada.",
            "Você está chegando lá... mas 'lá' muda de lugar sempre."
        ]
    },
    [TIMER_MODES.SHORT_BREAK]: {
        start: [
            "Pausa curta: porque até fingir produtividade cansa.",
            "Respire. Você vai precisar para voltar ao sofrimento.",
            "Descanse enquanto pode, o desespero já volta.",
            "5 minutos para refletir sobre suas escolhas de vida.",
            "Pausa estratégica: prorrastinar com propósito."
        ],
        running: [
            "Aproveite. Essa pode ser a parte mais produtiva do seu dia.",
            "Relaxe. O fracasso pode esperar mais 5 minutos.",
            "Momento zen: aceite que você não sabe nada.",
            "Sua pausa é tão curta quanto suas chances de sucesso.",
            "Hidrate-se! Lágrimas também contam.",
            "Continue assim: não fazendo nada é sua especialidade.",
            "Pausa bem merecida! Afinal, você estudou por... minutos inteiros!"
        ]
    },
    [TIMER_MODES.LONG_BREAK]: {
        start: [
            "Pausa longa: hora de questionar todas as suas decisões.",
            "Você merece! (Será?)",
            "Descanso completo: prepare-se para voltar e não lembrar de nada.",
            "Pausa longa suficiente para esquecer tudo que aprendeu.",
            "Momento de reflexão: por que você está fazendo isso mesmo?"
        ],
        running: [
            "Você completou um ciclo! (De mediocridade, mas ainda assim.)",
            "Parabéns! Agora volta tudo do zero.",
            "Descanse bem. A montanha de estudos continua lá.",
            "Produtividade em alta! (Mentira, mas o pensamento positivo ajuda.)",
            "Momento de celebrar! Você sobreviveu. Por enquanto.",
            "Continue assim após a pausa! (Ou não, tanto faz.)",
            "Longo descanso para processar que não processou nada."
        ]
    }
};

export const COMPLETION_MESSAGES = {
    [TIMER_MODES.FOCUS]: "Parabéns! Você fingiu estudar por mais alguns minutos. 🎉",
    [TIMER_MODES.SHORT_BREAK]: "Pausa terminada! Hora de voltar a não entender nada. 💪",
    [TIMER_MODES.LONG_BREAK]: "Ciclo completo! Agora começa outro ciclo de sofrimento. 🎊"
};

export const DEFAULT_MESSAGES = {
    [TIMER_MODES.FOCUS]: "Pronto para mais uma rodada de auto-ilusão? Vamos lá!",
    [TIMER_MODES.SHORT_BREAK]: "Hora de fingir que vai descansar.",
    [TIMER_MODES.LONG_BREAK]: "Pausa longa para lamentar escolhas de vida."
};

export const SOUND_FREQUENCIES = {
    bell: [800, 600],
    chime: [523, 659, 784],
    digital: [1000, 1000, 1000]
};

// API Configuration
// Detecta automaticamente se está rodando localmente ou em produção
export const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000'
    : `${window.location.protocol}//${window.location.hostname}:8000`;

// Flag para verificar se backend está disponível
/**
 * Verifica se o backend está disponível
 * @returns {Promise<boolean>}
 */
export async function checkBackendAvailability() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout
        
        const response = await fetch(`${API_BASE_URL}/api/health`, {
            method: 'GET',
            signal: controller.signal,
            cache: 'no-cache'
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            console.log('✅ Backend disponível');
            return true;
        } else {
            console.warn('⚠️ Backend respondeu com erro. Usando modo offline.');
            return false;
        }
    } catch (error) {
        console.warn('⚠️ Backend não disponível:', error.message);
        console.info('ℹ️ Aplicação funcionando em modo offline (localStorage).');
        return false;
    }
}
