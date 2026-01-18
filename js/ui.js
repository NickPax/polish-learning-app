// UI rendering and interactions
import { speakText } from './tts.js';
import { topics } from '../data/topics.js';
import { exercises } from '../data/exercises.js';

// Translation mapping for common Polish sentences
const translationMap = {
    "Poproszę butelkę wody.": "I'd like a bottle of water.",
    "Ile kosztuje menu?": "How much does the menu cost?",
    "Chciałbym zamówić piwo.": "I'd like to order a beer.",
    "Czy mogę prosić o kartę dań?": "Can I ask for the menu?",
    "Jedzenie było bardzo smaczne.": "The food was very delicious.",
    "Jestem wegetarianinem i nie jem mięsa.": "I am a vegetarian and I don't eat meat.",
    "Jeszcze jedną filiżankę kawy, proszę.": "Another cup of coffee, please.",
    "Rachunek, proszę!": "The bill, please!",
    "Chciałbym zamówić kawałek ciasta.": "I'd like to order a piece of cake.",
    "Gdzie jest najbliższy dworzec?": "Where is the nearest train station?",
    "Potrzebuję pokoju na trzy noce.": "I need a room for three nights.",
    "Ile kosztuje bilet do Warszawy?": "How much does a ticket to Warsaw cost?",
    "Czy możesz mi pokazać na mapie?": "Can you show me on the map?",
    "Samolot startuje punktualnie.": "The plane departs on time.",
    "Zgubiłem swój paszport.": "I lost my passport.",
    "Jedź prosto do następnej sygnalizacji.": "Go straight to the next traffic lights.",
    "Chcę kupić bilet do Starego Miasta.": "I want to buy a ticket to the Old Town.",
    "Jak dotrzeć do najbliższego lotniska?": "How to get to the nearest airport?",
    "To jest moja siostra.": "This is my sister.",
    "Masz rodzeństwo?": "Do you have siblings?",
    "Jutro obchodzimy urodziny babci.": "Tomorrow we're celebrating grandmother's birthday.",
    "Mój brat ma na imię Łukasz.": "My brother's name is Łukasz.",
    "Moi rodzice mieszkają w nowym domu.": "My parents live in a new house.",
    "Mój wujek jest żonaty.": "My uncle is married.",
    "Moja ciocia pracuje w banku.": "My aunt works in a bank.",
    "Mój siostrzeniec ma pięć lat.": "My nephew is five years old.",
    "Nie mam już dziadków.": "I don't have grandparents anymore.",
    "Ile kosztuje ta kurtka?": "How much does this jacket cost?",
    "Chciałbym te spodnie wymienić.": "I'd like to exchange these pants.",
    "Czy jest tu jakaś zniżka?": "Is there a discount here?",
    "Czy mogę zapłacić kartą?": "Can I pay by card?",
    "To jest za drogo.": "This is too expensive.",
    "Szukam prezentu dla mojej matki.": "I'm looking for a gift for my mother.",
    "Gdzie jest przymierzalnia?": "Where is the fitting room?",
    "Wezmę inny kolor.": "I'll take a different color.",
    "Czy mogę dostać paragon?": "Can I get a receipt?",
    "Lubię grać na pianinie.": "I like to play the piano.",
    "Moje hobby to fotografia.": "My hobby is photography.",
    "W weekend często chodzę na spacery.": "On weekends I often go for walks.",
    "Gram w piłkę nożną w klubie.": "I play football in a club.",
    "Lubię pływać.": "I like to swim.",
    "Zbieram stare monety.": "I collect old coins.",
    "Lubię fotografować krajobrazy.": "I like to photograph landscapes.",
    "Gram na gitarze.": "I play the guitar.",
    "Lubię słuchać klasycznej muzyki.": "I like to listen to classical music.",
    "Pies szczeka głośno.": "The dog barks loudly.",
    "Ptak lata wysoko na niebie.": "The bird flies high in the sky.",
    "Widzę lwa w zoo.": "I see a lion in the zoo.",
    "Krowa robi muuu.": "The cow goes moo.",
    "Małpa wspina się na drzewa.": "The monkey climbs trees.",
    "Pszczoła bzyczy wokół kwiatów.": "The bee buzzes around flowers.",
    "Tygrys ryczy głośno.": "The tiger roars loudly.",
    "Zające ma długie uszy.": "Rabbits have long ears.",
    "Papuga żyje w dżungli.": "The parrot lives in the jungle.",
    "Mam spotkanie z moim szefem.": "I have a meeting with my boss.",
    "Mój kolega jest dziś bardzo zajęty.": "My colleague is very busy today.",
    "Muszę napisać raport.": "I have to write a report.",
    "Pracuję jako inżynier.": "I work as an engineer.",
    "Praca zaczyna się o 9:00.": "Work starts at 9:00.",
    "Potrzebuję nowego komputera.": "I need a new computer.",
    "Mój szef jest chory.": "My boss is sick.",
    "Mam dziś urlop wolne.": "I have a day off today.",
    "Muszę wysłać e-mail.": "I have to send an email.",
    "Boli mnie głowa.": "My head hurts.",
    "Idę do lekarza.": "I'm going to the doctor.",
    "Mam silny brzucha ból.": "I have a strong stomach ache.",
    "Moje serce kołacze.": "My heart is beating.",
    "Mam lekarską wizytę.": "I have a doctor's appointment.",
    "Swędzi mnie ramię.": "My arm itches.",
    "Czuję się zmęczony.": "I feel tired.",
    "Potrzebuję więcej odpoczynku.": "I need more rest.",
    "Szkoła zaczyna się o 8:00.": "School starts at 8:00.",
    "Dostałem dobrą ocenę z matematyki.": "I got a good grade in math.",
    "Mój nauczyciel pomaga mi w zadaniach.": "My teacher helps me with tasks.",
    "Chodzę do ósmej klasy.": "I go to eighth grade.",
    "Mamy dziś muzyki lekcję.": "We have a music lesson today.",
    "Potrzebuję nowego matematycznego zeszytu.": "I need a new math notebook.",
    "Przerwa dzwoni o 12:00.": "Break rings at 12:00.",
    "Uczę się na końcowy egzamin.": "I'm studying for the final exam.",
    "Mój ulubiony przedmiot to biologia.": "My favorite subject is biology.",
    "Warszawa jest stolicą Polski.": "Warsaw is the capital of Poland.",
    "Zamek jest bardzo stare i historyczne.": "The castle is very old and historical.",
    "Odwiedzam muzeum w weekend.": "I visit the museum on weekends.",
    "Gdańsk ma duży morski port.": "Gdańsk has a large seaport.",
    "W Poznaniu są słynne poznańskie koziołki.": "In Poznań there are famous Poznań goats.",
    "W Wrocławiu jest słynna panorama racławicka.": "In Wrocław there is the famous Racławice Panorama.",
    "Marszałkowska to najdłuższa ulica w Warszawie.": "Marszałkowska is the longest street in Warsaw.",
    "Śniardwy jest największym jeziorem w Polsce.": "Śniardwy is the largest lake in Poland.",
    "Wisła to ważna rzeka w Europie.": "The Vistula is an important river in Europe."
};

// Translation helper - generates English translation from Polish sentence
export function generateTranslation(exercise) {
    if (exercise.translation) {
        return exercise.translation;
    }
    
    // Get full sentence with correct answer
    const correctAnswer = exercise.options[exercise.correct];
    const fullSentence = exercise.sentence.replace('___', correctAnswer);
    
    // Look up in translation map
    if (translationMap[fullSentence]) {
        return translationMap[fullSentence];
    }
    
    // Fallback: try to find partial match or return placeholder
    // This allows for easy extension when translations are added to exercises
    return `[Translation: ${fullSentence}]`;
}

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
        // Handle both old format (number) and new format (object with score and level)
        const scoreData = topicBestScores[topicKey];
        const bestScore = typeof scoreData === 'object' ? scoreData.score : (scoreData || 0);
        const scoreLevel = typeof scoreData === 'object' ? scoreData.level : null;
        
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
        const levelClass = scoreLevel ? `level-${scoreLevel}` : '';
        const scoreDisplay = bestScore > 0 
            ? `<div class="score-badge ${levelClass}" title="${scoreLevel ? `Score: ${Math.round(bestScore)} at Level ${scoreLevel}` : `Score: ${Math.round(bestScore)}`}">
                <div style="font-size: 0.9rem; line-height: 1.1;">${Math.round(bestScore)}</div>
                ${scoreLevel ? `<div style="font-size: 0.65rem; line-height: 1; margin-top: 2px; opacity: 0.95;">L${scoreLevel}</div>` : ''}
            </div>` 
            : '';
        topicOption.innerHTML = `
            <i class="fas ${topic.icon}"></i>
            ${topic.name}
            ${scoreDisplay}
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
    
    // Translation display (shown after answer)
    const translationDisplay = document.createElement('div');
    translationDisplay.id = 'translation-display';
    translationDisplay.className = 'translation-display';
    translationDisplay.style.display = 'none';
    translationDisplay.style.marginTop = '10px';
    translationDisplay.style.marginBottom = '15px';
    translationDisplay.style.padding = '8px 12px';
    translationDisplay.style.fontSize = '0.9rem';
    translationDisplay.style.color = 'var(--subheading)';
    translationDisplay.style.fontStyle = 'italic';
    translationDisplay.style.borderLeft = '3px solid var(--border)';
    translationDisplay.style.backgroundColor = 'var(--option-bg)';
    
    // Generate translation - will be updated when answer is submitted
    translationDisplay.textContent = generateTranslation(exercise);
    content.appendChild(translationDisplay);
    
    // Show translation if user has already answered
    if (userAnswers[currentExercise] !== undefined && userAnswers[currentExercise] !== null) {
        translationDisplay.style.display = 'block';
    }
    
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
    
    // Audio text display (shown after answer)
    const audioTextDisplay = document.createElement('div');
    audioTextDisplay.id = 'audio-text-display';
    audioTextDisplay.className = 'audio-text-display';
    audioTextDisplay.style.display = 'none';
    audioTextDisplay.style.marginTop = '15px';
    audioTextDisplay.style.marginBottom = '15px';
    audioTextDisplay.style.padding = '10px';
    audioTextDisplay.style.fontSize = '1rem';
    audioTextDisplay.style.color = 'var(--subheading)';
    audioTextDisplay.style.fontStyle = 'italic';
    audioTextDisplay.style.borderTop = '1px solid var(--border)';
    audioTextDisplay.style.borderBottom = '1px solid var(--border)';
    audioTextDisplay.textContent = exercise.audioText;
    content.appendChild(audioTextDisplay);
    
    // Show audio text if user has already answered
    if (userAnswers[currentExercise] !== undefined && userAnswers[currentExercise] !== null) {
        audioTextDisplay.style.display = 'block';
    }
    
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
export function finishTopic(points, totalExercises, topicBestScores, currentTopic, selectedLevel, completionMessage, finalScore, levelBadgeElement) {
    // Handle both old format (number) and new format (object with score and level)
    const currentBest = topicBestScores[currentTopic];
    const currentBestScore = typeof currentBest === 'object' ? currentBest.score : (currentBest || 0);
    const currentBestLevel = typeof currentBest === 'object' ? currentBest.level : null;
    
    // Save new score if:
    // 1. Score is higher, OR
    // 2. Level is higher (completing at higher level is an achievement, even with same/lower score)
    const shouldSave = points > currentBestScore || 
                      (currentBestLevel === null || selectedLevel > currentBestLevel);
    
    if (shouldSave) {
        topicBestScores[currentTopic] = { score: points, level: selectedLevel };
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
    
    // Display level badge if element provided
    if (levelBadgeElement) {
        levelBadgeElement.textContent = `Level ${selectedLevel}`;
        levelBadgeElement.style.display = 'inline-block';
    }
}
