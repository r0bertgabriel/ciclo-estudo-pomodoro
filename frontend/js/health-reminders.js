/**
 * Gerenciador de Lembretes de Saúde
 */

export class HealthReminders {
    constructor() {
        this.exercises = {
            short: [
                {
                    icon: '🙆',
                    title: 'Alongamento de Pescoço',
                    description: 'Incline a cabeça para os lados, segurando por 10 segundos cada lado.',
                    duration: '30s'
                },
                {
                    icon: '👀',
                    title: 'Exercício para os Olhos',
                    description: 'Olhe para longe (6 metros) por 20 segundos. Regra 20-20-20.',
                    duration: '20s'
                },
                {
                    icon: '🤲',
                    title: 'Alongamento de Pulsos',
                    description: 'Estenda o braço e puxe os dedos para baixo e para cima.',
                    duration: '30s'
                },
                {
                    icon: '💪',
                    title: 'Rotação de Ombros',
                    description: 'Faça movimentos circulares com os ombros, 10 vezes para frente e 10 para trás.',
                    duration: '40s'
                },
                {
                    icon: '🧘',
                    title: 'Respiração Profunda',
                    description: 'Inspire profundamente por 4 segundos, segure por 4, expire por 4.',
                    duration: '1min'
                }
            ],
            long: [
                {
                    icon: '🚶',
                    title: 'Caminhada Rápida',
                    description: 'Levante e caminhe por alguns minutos. Movimente todo o corpo.',
                    duration: '5min'
                },
                {
                    icon: '🤸',
                    title: 'Alongamento Completo',
                    description: 'Alongue braços, pernas, costas e pescoço. Toque os dedos dos pés.',
                    duration: '3min'
                },
                {
                    icon: '🏃',
                    title: 'Exercícios Leves',
                    description: '10 polichinelos, 10 agachamentos, 10 flexões de braço (na parede).',
                    duration: '5min'
                },
                {
                    icon: '🧘‍♂️',
                    title: 'Meditação Rápida',
                    description: 'Sente confortavelmente, feche os olhos e respire profundamente.',
                    duration: '5min'
                },
                {
                    icon: '💆',
                    title: 'Automassagem',
                    description: 'Massageie pescoço, ombros, têmporas e mãos suavemente.',
                    duration: '3min'
                }
            ]
        };

        this.waterReminders = [
            '💧 Hora de se hidratar! Beba um copo de água.',
            '🚰 Não esqueça: seu corpo precisa de água!',
            '💦 Pausa para hidratação! Tome água agora.',
            '🥤 Momento perfeito para beber água!',
            '💙 Cuide-se! Beba água durante a pausa.',
            '🌊 Reponha líquidos! Hora da água.',
            '🏃‍♂️ Levante, pegue água e alongue-se!',
            '✨ Seu cérebro agradece: beba água!'
        ];
    }

    /**
     * Obtém exercício aleatório
     */
    getRandomExercise(breakType = 'short') {
        const exercises = breakType === 'short' ? this.exercises.short : this.exercises.long;
        return exercises[Math.floor(Math.random() * exercises.length)];
    }

    /**
     * Obtém lembrete de água aleatório
     */
    getRandomWaterReminder() {
        return this.waterReminders[Math.floor(Math.random() * this.waterReminders.length)];
    }

    /**
     * Obtém múltiplos exercícios
     */
    getMultipleExercises(breakType = 'short', count = 3) {
        const exercises = breakType === 'short' ? this.exercises.short : this.exercises.long;
        const shuffled = [...exercises].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    /**
     * Cria card de exercício HTML
     */
    createExerciseCard(exercise) {
        return `
            <div class="exercise-card">
                <div class="exercise-icon">${exercise.icon}</div>
                <div class="exercise-content">
                    <h4 class="exercise-title">${exercise.title}</h4>
                    <p class="exercise-description">${exercise.description}</p>
                    <span class="exercise-duration">${exercise.duration}</span>
                </div>
            </div>
        `;
    }

    /**
     * Cria lembrete de água HTML
     */
    createWaterReminderHTML() {
        const reminder = this.getRandomWaterReminder();
        return `
            <div class="water-reminder">
                <div class="water-icon">💧</div>
                <p class="water-text">${reminder}</p>
            </div>
        `;
    }

    /**
     * Mostra lembretes de saúde no DOM
     */
    showHealthReminders(breakType = 'short') {
        const container = document.getElementById('healthRemindersContainer');
        if (!container) {
            console.warn('Container de lembretes de saúde não encontrado');
            return;
        }

        const exercises = this.getMultipleExercises(breakType, 2);
        const waterReminder = this.createWaterReminderHTML();
        
        let html = '<div class="health-reminders-section">';
        html += '<h3 class="reminders-title">💪 Aproveite a pausa!</h3>';
        html += waterReminder;
        html += '<div class="exercises-list">';
        exercises.forEach(exercise => {
            html += this.createExerciseCard(exercise);
        });
        html += '</div>';
        html += '</div>';

        container.innerHTML = html;
        container.style.display = 'block';
    }

    /**
     * Esconde lembretes de saúde
     */
    hideHealthReminders() {
        const container = document.getElementById('healthRemindersContainer');
        if (container) {
            container.style.display = 'none';
            container.innerHTML = '';
        }
    }

    /**
     * Mostra notificação de água
     */
    showWaterNotification() {
        const reminder = this.getRandomWaterReminder();
        
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('💧 Hora de Beber Água!', {
                body: reminder,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💧</text></svg>',
                badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💧</text></svg>'
            });
        }
    }

    /**
     * Mostra notificação de exercício
     */
    showExerciseNotification(breakType = 'short') {
        const exercise = this.getRandomExercise(breakType);
        
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`${exercise.icon} ${exercise.title}`, {
                body: `${exercise.description}\n⏱️ Duração: ${exercise.duration}`,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💪</text></svg>'
            });
        }
    }
}

// Estilos CSS para os lembretes (adicionar ao styles.css ou criar arquivo separado)
export const healthRemindersStyles = `
.health-reminders-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1.5rem;
    border-radius: 12px;
    color: white;
    margin-top: 1rem;
}

.reminders-title {
    margin: 0 0 1rem 0;
    font-size: 1.3rem;
    text-align: center;
}

.water-reminder {
    background: rgba(255, 255, 255, 0.2);
    padding: 1rem;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    backdrop-filter: blur(10px);
}

.water-icon {
    font-size: 2rem;
    animation: bounce 2s infinite;
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.water-text {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
}

.exercises-list {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
}

.exercise-card {
    background: rgba(255, 255, 255, 0.15);
    padding: 1rem;
    border-radius: 10px;
    display: flex;
    gap: 1rem;
    align-items: start;
    backdrop-filter: blur(10px);
    transition: transform 0.3s ease, background 0.3s ease;
}

.exercise-card:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateX(5px);
}

.exercise-icon {
    font-size: 2rem;
    min-width: 40px;
}

.exercise-content {
    flex: 1;
}

.exercise-title {
    margin: 0 0 0.4rem 0;
    font-size: 1rem;
    font-weight: 600;
}

.exercise-description {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    opacity: 0.9;
    line-height: 1.4;
}

.exercise-duration {
    display: inline-block;
    background: rgba(255, 255, 255, 0.2);
    padding: 0.2rem 0.6rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
}

@media (max-width: 768px) {
    .health-reminders-section {
        padding: 1rem;
    }
    
    .exercise-card {
        flex-direction: column;
        text-align: center;
    }
    
    .water-reminder {
        flex-direction: column;
        text-align: center;
    }
}
`;
