// Core application logic
import { topics } from '../data/topics.js';
import { exercises } from '../data/exercises.js';
import { 
    renderLevelSelection, 
    renderTopicSelection, 
    renderMissingWordExercise, 
    renderTTsExercise,
    addNavigation,
    updateProgress,
    showFeedback,
    finishTopic,
    scrollToNextButton,
    applyTheme,
    randomizeOptions,
    shuffleArray,
    generateTranslation
} from './ui.js';

// App state
let currentTopic = null;
let currentExercise = 0;
let points = 0;
let userAnswers = [];
let isDarkMode = localStorage.getItem('darkMode') === 'true';
let topicBestScores = JSON.parse(localStorage.getItem('terazPolskiBestScores')) || {};
let currentSetIndex = null;
let selectedLevel = 1; // Default to level 1
let topicSetHistory = JSON.parse(localStorage.getItem('terazPolskiSetHistory')) || {};
let currentExercises = [];

// DOM elements
const levelSelectionScreen = document.getElementById('level-selection-screen');
const topicSelectionScreen = document.getElementById('topic-selection-screen');
const exerciseContainer = document.getElementById('exercise-container');
const progressContainer = document.getElementById('progress-container');
const progressFill = document.getElementById('progress-fill');
const pointsDisplay = document.getElementById('points');
const completionScreen = document.getElementById('completion-screen');
const finalScore = document.getElementById('final-score');
const completionMessage = document.getElementById('completion-message');
const themeToggle = document.getElementById('theme-toggle');
const newTopicBtn = document.getElementById('new-topic-btn');
const restartTopicBtn = document.getElementById('restart-topic-btn');
const backToLevelsBtn = document.getElementById('back-to-levels-btn');
const resetProgressBtn = document.getElementById('reset-progress-btn');

// Initialize theme
applyTheme(isDarkMode);

// Theme toggle
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        localStorage.setItem('darkMode', isDarkMode);
        applyTheme(isDarkMode);
        
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
        }
    });
}

// Select a random set that hasn't been used recently
function selectRandomSet(topicKey) {
    const topicExercises = exercises[topicKey];
    if (!topicExercises || !topicExercises.sets) return 0;
    
    // Initialize history if needed
    if (!topicSetHistory[topicKey]) {
        topicSetHistory[topicKey] = [];
    }
    
    const numSets = topicExercises.sets.length;
    
    // Get available sets (not in last 2 used)
    const availableSets = [];
    for (let i = 0; i < numSets; i++) {
        if (!topicSetHistory[topicKey].slice(-2).includes(i)) {
            availableSets.push(i);
        }
    }
    
    // If all sets were recently used, reset history
    if (availableSets.length === 0) {
        topicSetHistory[topicKey] = [];
        for (let i = 0; i < numSets; i++) {
            availableSets.push(i);
        }
    }
    
    // Select random from available
    const randomIndex = availableSets[Math.floor(Math.random() * availableSets.length)];
    
    // Update history
    topicSetHistory[topicKey].push(randomIndex);
    localStorage.setItem('terazPolskiSetHistory', JSON.stringify(topicSetHistory));
    
    return randomIndex;
}

// Filter exercises by level
function filterExercisesByLevel(exercises) {
    return exercises.filter(exercise => exercise.level <= selectedLevel);
}

// Start topic exercises
function startTopicExercises(topicKey) {
    if (topicSelectionScreen) topicSelectionScreen.classList.add('hidden');
    if (progressContainer) progressContainer.classList.remove('hidden');
    if (exerciseContainer) exerciseContainer.classList.remove('hidden');
    if (completionScreen) completionScreen.classList.add('hidden');
    
    currentTopic = topicKey;
    currentExercise = 0;
    points = 0;
    userAnswers = [];
    
    currentSetIndex = selectRandomSet(topicKey);
    
    // Get exercises from selected set and filter by level
    const topicExercises = exercises[topicKey];
    if (!topicExercises || !topicExercises.sets) return;
    
    const allSets = topicExercises.sets;
    const selectedSet = allSets[currentSetIndex] || allSets[0];
    
    // Filter exercises by level
    currentExercises = filterExercisesByLevel(selectedSet);
    
    // If we don't have 5 exercises, try to get more from other sets
    if (currentExercises.length < 5) {
        const additionalExercises = [];
        allSets.forEach((set, index) => {
            if (index !== currentSetIndex) {
                const filtered = filterExercisesByLevel(set);
                filtered.forEach(exercise => {
                    if (additionalExercises.length < (5 - currentExercises.length)) {
                        additionalExercises.push(exercise);
                    }
                });
            }
        });
        currentExercises.push(...additionalExercises);
    }
    
    // Limit to maximum 5 exercises
    currentExercises = currentExercises.slice(0, 5);
    
    // Reset user answers for the new set
    userAnswers = new Array(currentExercises.length).fill(null);
    
    if (pointsDisplay) pointsDisplay.textContent = points;
    updateProgress(currentExercise, currentExercises.length, progressFill, document.getElementById('progress-text'));
    loadExercise();
}

// Load and display current exercise
function loadExercise() {
    const topicData = topics[currentTopic];
    const exercise = currentExercises[currentExercise];
    
    if (!exercise || !exerciseContainer) {
        if (exerciseContainer) {
            exerciseContainer.innerHTML = `
                <div class="exercise-content" style="text-align: center;">
                    <h3>No exercises available at your current level</h3>
                    <p>Try selecting a higher vocabulary level or a different topic.</p>
                    <button class="btn btn-next" onclick="showTopicSelection()" style="margin-top: 20px;">
                        Back to Topics
                    </button>
                </div>
            `;
        }
        return;
    }
    
    exerciseContainer.innerHTML = '';
    
    const titleContainer = document.createElement('div');
    titleContainer.className = 'exercise-title';
    titleContainer.innerHTML = `
        <span><i class="fas fa-${exercise.type === 'missing-word' ? 'puzzle-piece' : 'headphones'}"></i> ${exercise.type === 'missing-word' ? 'Fill in the Blank' : 'Listen & Identify Topic'}</span>
        <div>
            <span class="topic-name">${topicData.name}</span>
            <span class="level-badge" style="font-size: 0.8rem; margin-right: 10px;">Level ${selectedLevel}</span>
            <button class="back-btn" id="back-to-topics-btn">
                <i class="fas fa-arrow-left"></i> Topics
            </button>
        </div>
    `;
    exerciseContainer.appendChild(titleContainer);
    
    setTimeout(() => {
        const backBtn = document.getElementById('back-to-topics-btn');
        if (backBtn) {
            backBtn.addEventListener('click', showTopicSelection);
        }
    }, 0);
    
    // Store randomized options on the exercise object
    if (exercise.type === 'missing-word') {
        if (!exercise.currentOptions) {
            const randomized = randomizeOptions(exercise.options, exercise.correct);
            exercise.currentOptions = randomized.options;
            exercise.currentCorrect = randomized.correctIndex;
        }
    }
    
    if (exercise.type === 'tts') {
        if (!exercise.currentTopics) {
            const topics = [...exercise.topics];
            const correctTopic = topics[exercise.correct];
            const shuffledTopics = shuffleArray(topics);
            const newCorrectIndex = shuffledTopics.indexOf(correctTopic);
            
            exercise.currentTopics = shuffledTopics;
            exercise.currentCorrect = newCorrectIndex;
        }
    }
    
    let content;
    if (exercise.type === 'missing-word') {
        content = renderMissingWordExercise(exercise, currentExercise, userAnswers, (index, correctIndex, ex) => {
            handleMissingWordAnswer(index, correctIndex, ex);
        });
    } else if (exercise.type === 'tts') {
        content = renderTTsExercise(exercise, currentExercise, userAnswers, (index, correctIndex, ex) => {
            handleTTSAnswer(index, correctIndex, ex);
        });
    }
    
    if (content) {
        exerciseContainer.appendChild(content);
    }
    
    const nav = addNavigation(
        currentExercise, 
        currentExercises.length, 
        userAnswers,
        () => {
            if (currentExercise > 0) {
                currentExercise--;
                // Reset randomized options for new exercise
                if (currentExercises[currentExercise]) {
                    delete currentExercises[currentExercise].currentOptions;
                    delete currentExercises[currentExercise].currentTopics;
                    delete currentExercises[currentExercise].currentCorrect;
                }
                loadExercise();
                updateProgress(currentExercise, currentExercises.length, progressFill, document.getElementById('progress-text'));
            }
        },
        () => {
            if (currentExercise < currentExercises.length - 1) {
                currentExercise++;
                // Reset randomized options for new exercise
                if (currentExercises[currentExercise]) {
                    delete currentExercises[currentExercise].currentOptions;
                    delete currentExercises[currentExercise].currentTopics;
                    delete currentExercises[currentExercise].currentCorrect;
                }
                loadExercise();
                updateProgress(currentExercise, currentExercises.length, progressFill, document.getElementById('progress-text'));
            } else {
                finishTopicScreen();
            }
        }
    );
    exerciseContainer.appendChild(nav);
}

// Handle missing word answer
function handleMissingWordAnswer(selectedIndex, correctIndex, exercise) {
    userAnswers[currentExercise] = selectedIndex;
    
    if (selectedIndex === correctIndex) {
        points += 10;
        if (pointsDisplay) pointsDisplay.textContent = points;
    }
    
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === selectedIndex) {
            btn.classList.add('selected');
            if (index === correctIndex) {
                btn.classList.add('correct');
            } else {
                btn.classList.add('incorrect');
            }
        } else if (index === correctIndex) {
            btn.classList.add('correct');
        }
    });
    
    showFeedback(selectedIndex === correctIndex, exercise.explanation, exercise, true);
    
    // Show translation after answer
    const translationDisplay = document.getElementById('translation-display');
    if (translationDisplay) {
        // Generate translation with correct answer filled in
        const correctAnswer = exercise.options[exercise.correct];
        const fullSentence = exercise.sentence.replace('___', correctAnswer);
        const exerciseWithAnswer = { ...exercise, sentence: fullSentence };
        translationDisplay.textContent = generateTranslation(exerciseWithAnswer);
        translationDisplay.style.display = 'block';
    }
    
    // Enable the Next button - use ID for reliable selection
    const enableNextButton = () => {
        const nextBtn = document.getElementById('exercise-next-btn');
        if (nextBtn) {
            nextBtn.disabled = false;
            return nextBtn;
        }
        return null;
    };
    
    // Try immediately
    let nextBtn = enableNextButton();
    
    // Also try after a short delay to ensure DOM is ready
    if (!nextBtn) {
        setTimeout(() => {
            nextBtn = enableNextButton();
            if (nextBtn) {
                scrollToNextButton(nextBtn);
            }
        }, 100);
    } else {
        scrollToNextButton(nextBtn);
    }
}

// Handle TTS answer
function handleTTSAnswer(selectedIndex, correctIndex, exercise) {
    userAnswers[currentExercise] = selectedIndex;
    
    if (selectedIndex === correctIndex) {
        points += 10;
        if (pointsDisplay) pointsDisplay.textContent = points;
    }
    
    const cards = document.querySelectorAll('.topic-card');
    cards.forEach((card, index) => {
        card.classList.add('locked');
        if (index === selectedIndex) {
            card.classList.add('selected');
        }
        if (index === correctIndex) {
            card.classList.add('correct');
        }
    });
    
    showFeedback(selectedIndex === correctIndex, exercise.explanation, exercise, false);
    
    // Show audio text after answer
    const audioTextDisplay = document.getElementById('audio-text-display');
    if (audioTextDisplay) {
        audioTextDisplay.style.display = 'block';
    }
    
    // Enable the Next button - use ID for reliable selection
    const enableNextButton = () => {
        const nextBtn = document.getElementById('exercise-next-btn');
        if (nextBtn) {
            nextBtn.disabled = false;
            return nextBtn;
        }
        return null;
    };
    
    // Try immediately
    let nextBtn = enableNextButton();
    
    // Also try after a short delay to ensure DOM is ready
    if (!nextBtn) {
        setTimeout(() => {
            nextBtn = enableNextButton();
            if (nextBtn) {
                scrollToNextButton(nextBtn);
            }
        }, 100);
    } else {
        scrollToNextButton(nextBtn);
    }
}

// Finish topic screen
function finishTopicScreen() {
    const levelBadgeElement = document.getElementById('completion-level-badge');
    finishTopic(points, currentExercises.length, topicBestScores, currentTopic, selectedLevel, completionMessage, finalScore, levelBadgeElement);
    
    if (exerciseContainer) exerciseContainer.classList.add('hidden');
    if (progressContainer) progressContainer.classList.add('hidden');
    if (completionScreen) completionScreen.classList.remove('hidden');
}

// Show topic selection screen
function showTopicSelection() {
    if (completionScreen) completionScreen.classList.add('hidden');
    if (exerciseContainer) exerciseContainer.classList.add('hidden');
    if (progressContainer) progressContainer.classList.add('hidden');
    if (topicSelectionScreen) topicSelectionScreen.classList.remove('hidden');
    renderTopicSelection(topicBestScores, selectedLevel, startTopicExercises);
}

// Show level selection screen
function showLevelSelection() {
    if (topicSelectionScreen) topicSelectionScreen.classList.add('hidden');
    if (levelSelectionScreen) levelSelectionScreen.classList.remove('hidden');
}

// Initialize the app
function initApp() {
    // Show level selection first
    if (levelSelectionScreen) {
        levelSelectionScreen.classList.remove('hidden');
    }
    
    renderLevelSelection(
        selectedLevel,
        (newLevel) => {
            selectedLevel = newLevel;
        },
        () => {
            if (levelSelectionScreen) levelSelectionScreen.classList.add('hidden');
            if (topicSelectionScreen) topicSelectionScreen.classList.remove('hidden');
            renderTopicSelection(topicBestScores, selectedLevel, startTopicExercises);
        }
    );
    
    if (newTopicBtn) {
        newTopicBtn.addEventListener('click', showTopicSelection);
    }
    
    if (restartTopicBtn) {
        restartTopicBtn.addEventListener('click', () => {
            if (completionScreen) completionScreen.classList.add('hidden');
            startTopicExercises(currentTopic);
        });
    }
    
    if (backToLevelsBtn) {
        backToLevelsBtn.addEventListener('click', showLevelSelection);
    }
    
    if (resetProgressBtn) {
        resetProgressBtn.addEventListener('click', resetProgress);
    }
}

// Reset all progress and clear localStorage
function resetProgress() {
    const confirmed = confirm(
        'Are you sure you want to reset all progress?\n\n' +
        'This will clear:\n' +
        '• All topic scores\n' +
        '• Exercise history\n\n' +
        'This action cannot be undone.'
    );
    
    if (confirmed) {
        // Clear all localStorage items related to the app
        localStorage.removeItem('terazPolskiBestScores');
        localStorage.removeItem('terazPolskiSetHistory');
        // Note: We keep 'darkMode' so theme preference is preserved
        
        // Reset app state
        topicBestScores = {};
        topicSetHistory = {};
        
        // Refresh the topic selection screen to show no scores
        if (topicSelectionScreen && !topicSelectionScreen.classList.contains('hidden')) {
            renderTopicSelection(topicBestScores, selectedLevel, startTopicExercises);
        }
        
        // Show a brief confirmation
        const originalText = resetProgressBtn.innerHTML;
        resetProgressBtn.innerHTML = '<i class="fas fa-check"></i> Reset Complete!';
        resetProgressBtn.style.color = 'var(--correct)';
        resetProgressBtn.style.borderColor = 'var(--correct)';
        
        setTimeout(() => {
            resetProgressBtn.innerHTML = originalText;
            resetProgressBtn.style.color = '';
            resetProgressBtn.style.borderColor = '';
        }, 2000);
    }
}

// Initialize the app when page loads
window.addEventListener('load', initApp);

// Make showTopicSelection available globally for inline onclick handlers
window.showTopicSelection = showTopicSelection;
