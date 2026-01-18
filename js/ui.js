// UI rendering and interactions
import { speakText } from './tts.js';
import { topics } from '../data/topics.js';
import { exercises } from '../data/exercises.js';

// Helper functions
export function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

export function randomizeOptions(options, correctIndex) {
    const correctAnswer = options[correctIndex];
    const incorrectAnswers = options.filter((_, i) => i !== correctIndex);
    const shuffledIncorrect = shuffleArray(incorrectAnswers);
    
    const correctPos = Math.floor(Math.random() * options.length);
    const newOptions = [];
    let incorrectIndex = 0;
    
    for (let i = 0; i < options.length; i++) {
        if (i === correctPos) {
            newOptions.push(correctAnswer);
        } else {
            newOptions.push(shuffledIncorrect[incorrectIndex++]);
        }
    }
    
    return { 
        options: newOptions, 
        correctIndex: newOptions.indexOf(correctAnswer) 
    };
}

export function scrollToNextButton(buttonElement) {
    const scrollToBtn = (btn) => {
        if (btn) {
            btn.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
            setTimeout(() => btn.focus(), 300);
        }
    };
    
    if (buttonElement) {
        // If button is provided, use it directly
        setTimeout(() => scrollToBtn(buttonElement), 150);
    } else {
        // Otherwise, try to find it by ID first, then fallback to class
        setTimeout(() => {
            const nextBtn = document.getElementById('exercise-next-btn') || document.querySelector('.navigation .btn-next');
            scrollToBtn(nextBtn);
        }, 150);
    }
}

// Theme management
export function applyTheme(isDarkMode) {
    const root = document.documentElement;
    if (isDarkMode) {
        root.style.setProperty('--bg', 'var(--dark-bg)');
        root.style.setProperty('--text', 'var(--text-dark)');
        root.style.setProperty('--subheading', 'var(--subheading-dark)');
        root.style.setProperty('--card', 'var(--card-dark)');
        root.style.setProperty('--border', 'var(--border-dark)');
        root.style.setProperty('--option-bg', 'var(--option-bg-dark)');
        root.style.setProperty('--bg-sentence', 'rgba(30, 41, 59, 0.7)');
        root.style.setProperty('--shadow', 'var(--shadow-dark)');
        root.style.setProperty('--feedback-correct', 'var(--feedback-correct-dark)');
        root.style.setProperty('--feedback-correct-text', 'white');
        root.style.setProperty('--feedback-incorrect', 'var(--feedback-incorrect-dark)');
        root.style.setProperty('--feedback-incorrect-text', 'white');
        root.style.setProperty('--warning', '#fbbf24');
    } else {
        root.style.setProperty('--bg', 'var(--light-bg)');
        root.style.setProperty('--text', 'var(--text-light)');
        root.style.setProperty('--subheading', 'var(--subheading-light)');
        root.style.setProperty('--card', 'var(--card-light)');
        root.style.setProperty('--border', 'var(--border-light)');
        root.style.setProperty('--option-bg', 'var(--option-bg-light)');
        root.style.setProperty('--bg-sentence', '#f1f5ff');
        root.style.setProperty('--shadow', 'var(--shadow-light)');
        root.style.setProperty('--feedback-correct', 'var(--feedback-correct-light)');
        root.style.setProperty('--feedback-correct-text', 'var(--text-light)');
        root.style.setProperty('--feedback-incorrect', 'var(--feedback-incorrect-light)');
        root.style.setProperty('--feedback-incorrect-text', 'var(--text-light)');
        root.style.setProperty('--warning', '#f8961e');
    }
}

// Render level selection screen
export function renderLevelSelection(selectedLevel, onLevelChange, onProceed) {
    const levelSelectionScreen = document.getElementById('level-selection-screen');
    if (!levelSelectionScreen) return;
    
    const levelSelector = document.getElementById('level-selector');
    const levelDescription = document.getElementById('level-description');
    const proceedBtn = document.getElementById('proceed-to-topics-btn');
    
    const VOCABULARY_LEVELS = {
        1: {
            name: "Foundation",
            description: "Most essential 300 words for basic communication. Focus on high-frequency verbs, nouns, and essential phrases.",
            wordCount: 300
        },
        2: {
            name: "Elementary", 
            description: "Additional 300 common words for everyday situations. Expands vocabulary for practical conversations.",
            wordCount: 600
        },
        3: {
            name: "Intermediate",
            description: "300 useful words for more complex expressions. Includes abstract concepts and nuanced vocabulary.",
            wordCount: 900
        },
        4: {
            name: "Advanced",
            description: "300 practical words for fluent communication. Covers specialized topics and idiomatic expressions.",
            wordCount: 1200
        }
    };
    
    if (levelSelector) {
        levelSelector.value = selectedLevel;
        levelSelector.addEventListener('change', (e) => {
            const newLevel = parseInt(e.target.value);
            onLevelChange(newLevel);
            if (levelDescription) {
                levelDescription.textContent = VOCABULARY_LEVELS[newLevel].description;
            }
        });
    }
    
    if (levelDescription && VOCABULARY_LEVELS[selectedLevel]) {
        levelDescription.textContent = VOCABULARY_LEVELS[selectedLevel].description;
    }
    
    if (proceedBtn) {
        proceedBtn.addEventListener('click', onProceed);
    }
}

// Render topic selection screen
export function renderTopicSelection(topicBestScores, selectedLevel, onTopicSelect) {
    const topicOptionsContainer = document.getElementById('topic-options-container');
    const currentLevelBadge = document.getElementById('current-level-badge');
    
    if (!topicOptionsContainer) return;
    
    if (currentLevelBadge) {
        currentLevelBadge.textContent = `Level ${selectedLevel}`;
    }
    
    topicOptionsContainer.innerHTML = '';
    
    Object.keys(topics).forEach(topicKey => {
        const topic = topics[topicKey];
        const topicExercises = exercises[topicKey];
        const bestScore = topicBestScores[topicKey] || 0;
        
        // Count accessible exercises for this topic at current level
        let accessibleExerciseCount = 0;
        if (topicExercises && topicExercises.sets) {
            topicExercises.sets.forEach(set => {
                const filtered = set.filter(ex => ex.level <= selectedLevel);
                accessibleExerciseCount += filtered.length;
            });
        }
        
        const topicOption = document.createElement('div');
        topicOption.className = 'topic-option';
        topicOption.dataset.topic = topicKey;
        topicOption.innerHTML = `
            <i class="fas ${topic.icon}"></i>
            ${topic.name}
            ${bestScore > 0 ? `<div class="score-badge">${Math.round(bestScore)}</div>` : ''}
            <div style="margin-top: 10px; font-size: 0.8rem; color: var(--secondary);">
                ${accessibleExerciseCount}+ exercises
            </div>
        `;
        
        topicOption.addEventListener('click', () => onTopicSelect(topicKey));
        topicOptionsContainer.appendChild(topicOption);
    });
}

// Render missing word exercise
export function renderMissingWordExercise(exercise, currentExercise, userAnswers, onAnswer) {
    const content = document.createElement('div');
    content.className = 'exercise-content missing-word-exercise';
    
    const sentence = document.createElement('div');
    sentence.className = 'sentence';
    sentence.textContent = exercise.sentence;
    content.appendChild(sentence);
    
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';
    
    const options = exercise.currentOptions || exercise.options;
    const correctIndex = exercise.currentCorrect !== undefined ? exercise.currentCorrect : exercise.correct;
    
    options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'option-btn';
        optionBtn.textContent = option;
        optionBtn.dataset.index = index;
        
        if (userAnswers[currentExercise] !== undefined && userAnswers[currentExercise] !== null) {
            optionBtn.disabled = true;
            if (index === userAnswers[currentExercise]) {
                optionBtn.classList.add('selected');
                if (index === correctIndex) {
                    optionBtn.classList.add('correct');
                } else {
                    optionBtn.classList.add('incorrect');
                }
            } else if (index === correctIndex) {
                optionBtn.classList.add('correct');
            }
        }
        
        optionBtn.addEventListener('click', () => onAnswer(index, correctIndex, exercise));
        optionsContainer.appendChild(optionBtn);
    });
    
    content.appendChild(optionsContainer);
    
    const feedback = document.createElement('div');
    feedback.className = 'feedback';
    feedback.id = 'feedback';
    content.appendChild(feedback);
    
    return content;
}

// Render TTS exercise
export function renderTTsExercise(exercise, currentExercise, userAnswers, onAnswer) {
    const content = document.createElement('div');
    content.className = 'exercise-content tts-exercise';
    
    const instruction = document.createElement('p');
    instruction.textContent = 'Listen to the Polish sentence and select the correct topic:';
    instruction.style.marginBottom = '20px';
    instruction.style.fontSize = '1.1rem';
    content.appendChild(instruction);
    
    const audioControls = document.createElement('div');
    audioControls.className = 'audio-controls';
    
    const playBtn = document.createElement('button');
    playBtn.className = 'play-btn';
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    playBtn.title = 'Play audio';
    
    playBtn.addEventListener('click', () => {
        speakText(exercise.audioText);
        playBtn.disabled = true;
        setTimeout(() => {
            playBtn.disabled = false;
        }, 5000);
    });
    
    audioControls.appendChild(playBtn);
    content.appendChild(audioControls);
    
    const topicsContainer = document.createElement('div');
    topicsContainer.className = 'topics-container';
    
    const topics = exercise.currentTopics || exercise.topics;
    const correctIndex = exercise.currentCorrect !== undefined ? exercise.currentCorrect : exercise.correct;
    
    topics.forEach((topic, index) => {
        const topicCard = document.createElement('div');
        topicCard.className = 'topic-card';
        topicCard.textContent = topic;
        topicCard.dataset.index = index;
        
        if (userAnswers[currentExercise] !== undefined && userAnswers[currentExercise] !== null) {
            topicCard.classList.add('locked');
            if (index === userAnswers[currentExercise]) {
                topicCard.classList.add('selected');
            }
            if (userAnswers[currentExercise] !== correctIndex && index === correctIndex) {
                topicCard.classList.add('correct');
            }
        }
        
        topicCard.addEventListener('click', () => onAnswer(index, correctIndex, exercise));
        topicsContainer.appendChild(topicCard);
    });
    
    content.appendChild(topicsContainer);
    
    const feedback = document.createElement('div');
    feedback.className = 'feedback';
    feedback.id = 'feedback';
    content.appendChild(feedback);
    
    return content;
}

// Add navigation buttons
export function addNavigation(currentExercise, totalExercises, userAnswers, onPrevious, onNext) {
    const nav = document.createElement('div');
    nav.className = 'navigation';
    
    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn btn-prev';
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = currentExercise === 0;
    prevBtn.addEventListener('click', onPrevious);
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-next';
    nextBtn.id = 'exercise-next-btn';
    nextBtn.textContent = currentExercise === totalExercises - 1 ? 'Finish Topic' : 'Next';
    nextBtn.disabled = userAnswers[currentExercise] === undefined || userAnswers[currentExercise] === null;
    nextBtn.addEventListener('click', onNext);
    
    nav.appendChild(prevBtn);
    nav.appendChild(nextBtn);
    return nav;
}

// Update progress bar
export function updateProgress(currentExercise, totalExercises, progressFill, progressText) {
    const progress = ((currentExercise + 1) / totalExercises) * 100;
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `${currentExercise + 1}/${totalExercises}`;
}

// Show feedback
export function showFeedback(isCorrect, explanation, exercise, isMissingWord) {
    const feedback = document.getElementById('feedback');
    if (!feedback) return;
    
    if (isCorrect) {
        feedback.textContent = `Correct! ${explanation}`;
        feedback.className = 'feedback correct';
        if (isMissingWord) {
            const fullCorrectSentence = exercise.sentence.replace("___", exercise.options[exercise.correct]);
            setTimeout(() => speakText(fullCorrectSentence), 500);
        }
    } else {
        feedback.textContent = `Incorrect. ${explanation}`;
        feedback.className = 'feedback incorrect';
        if (isMissingWord) {
            const fullCorrectSentence = exercise.sentence.replace("___", exercise.options[exercise.correct]);
            setTimeout(() => speakText(fullCorrectSentence), 1000);
        }
    }
}

// Finish topic screen
export function finishTopic(points, totalExercises, topicBestScores, currentTopic, completionMessage, finalScore) {
    if (points > (topicBestScores[currentTopic] || 0)) {
        topicBestScores[currentTopic] = points;
        localStorage.setItem('terazPolskiBestScores', JSON.stringify(topicBestScores));
    }

    let message = "Keep practicing! 📚";
    let color = "#f8961e";
    const maxPoints = totalExercises * 10;
    if (points >= maxPoints * 0.9) {
        message = "Outstanding! 🌟";
        color = "#4ade80";
    } else if (points >= maxPoints * 0.7) {
        message = "Great job! 👏";
        color = "#4cc9f0";
    } else if (points >= maxPoints * 0.5) {
        message = "Good effort! 💪";
        color = "#f8961e";
    }

    if (completionMessage) {
        completionMessage.textContent = message;
        completionMessage.style.color = color;
    }
    if (finalScore) {
        finalScore.textContent = points;
    }
}
