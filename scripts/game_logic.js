const loaderElement = document.getElementById("loader");
const gameScreenElement = document.getElementById("gameScreen");
const questionCardElement = document.getElementById("questionCard");
const questionTextElement = document.getElementById("questionText");
const answersContainerElement = document.getElementById("answersContainer");
const answerButtonElements = [
  document.getElementById("answerBtn0"),
  document.getElementById("answerBtn1"),
  document.getElementById("answerBtn2"),
];
const errorScreenElement = document.getElementById("errorScreen");
const errorButtonElement = document.getElementById("errorButton");
const gameOverScreenElement = document.getElementById("gameOverScreen");
const gameOverTextElement = document.getElementById("gameOverText");
const rewardTitleElement = document.getElementById("rewardTitle");
const gameOverScoreTextElement = document.getElementById("gameOverScoreText");
const gameOverScoreElement = document.getElementById("gameOverScore");
const winStreakContainerElement = document.getElementById("winStreakContainer");
const winCountElement = document.getElementById("winCount");
const shareButtonElement = document.getElementById("shareButton");
const replayButtonElement = document.getElementById("replayButton");
const questionCounterElement = document.getElementById("questionCounter");
const totalScoreElement = document.getElementById("totalScore");
const progressBarElement = document.getElementById("progressBar");

const CACHE_KEY = "bible_quiz_game_state_v2";
const QUESTIONS_PER_LEVEL = 5;
const API_URL = `https://quizapi.tiiny.io`;
const MIN_DELAY_BETWEEN_QUESTIONS = 1200;
const ACHIEVEMENT_DISPLAY_TIME = 5000;

const gameState = {
  seed: Date.now(),
  index: 0,
  counter: 0,
  over: false,
  questions: [],
};

let achievementToastTimeout = null;
let currentLevelQuestionCount = 0;
let isTransitioning = false;

function getCurrentQuestion() {
  return gameState.questions[gameState.counter];
}

function getTotalQuestions() {
  return gameState.questions.length;
}

function getScore() {
  return gameState.questions.filter((q) => q.correct === true).length;
}

function answerQuestion(questionId, answerId) {
  const question = gameState.questions.find((q) => q.id == questionId);
  if (!question || !question.answers) return false;

  const correctAnswer = question.answers.find((a) => a.correct === true);
  if (!correctAnswer) return false;

  const isCorrect = correctAnswer.id == answerId;
  question.correct = isCorrect;

  // Update achievement stats
  const isLastInLevel =
    (gameState.counter % QUESTIONS_PER_LEVEL) + 1 === QUESTIONS_PER_LEVEL;
  const isLevelComplete = isLastInLevel;

  // Check if this level is perfect (all questions correct)
  let isLevelPerfect = false;
  if (isLevelComplete) {
    const levelStartIndex =
      Math.floor(gameState.counter / QUESTIONS_PER_LEVEL) * QUESTIONS_PER_LEVEL;
    isLevelPerfect = true;

    for (let i = levelStartIndex; i <= gameState.counter; i++) {
      if (
        i < getTotalQuestions() &&
        (!gameState.questions[i] || gameState.questions[i].correct !== true)
      ) {
        isLevelPerfect = false;
        break;
      }
    }
  }

  achievementManager.updateQuestionStats(
    isCorrect,
    isLevelComplete,
    isLevelPerfect
  );

  if (isLevelComplete) {
    // Record level attempt for comeback achievement
    const levelId = `level_${gameState.index}_${Math.floor(
      gameState.counter / QUESTIONS_PER_LEVEL
    )}`;
    achievementManager.recordLevelAttempt(levelId, isLevelPerfect);
  }

  const newAchievements = achievementManager.checkAchievements();
  if (newAchievements.length > 0) {
    displayAchievementNotification(newAchievements[0]);
  }

  return isCorrect;
}

function displayAchievementNotification(achievement) {
  if (achievementToastTimeout) {
    clearTimeout(achievementToastTimeout);
  }

  let achievementToast = document.getElementById("achievementToast");
  if (!achievementToast) {
    achievementToast = document.createElement("div");
    achievementToast.id = "achievementToast";
    achievementToast.className = "achievement-toast";
    document.body.appendChild(achievementToast);
  }

  achievementToast.innerHTML = `
    <div class="achievement-icon">${achievement.icon}</div>
    <div class="achievement-content">
      <div class="achievement-title">Achievement Unlocked!</div>
      <div class="achievement-name">${achievement.title}</div>
      <div class="achievement-description">${achievement.description}</div>
    </div>
  `;

  achievementToast.classList.add("show");

  achievementToastTimeout = setTimeout(() => {
    achievementToast.classList.remove("show");
  }, ACHIEVEMENT_DISPLAY_TIME);
}

function nextQuestion() {
  if (!gameState.over) {
    gameState.counter++;
    gameState.over = gameState.counter >= getTotalQuestions();
  }
}

function resetGame() {
  gameState.questions = [];
  gameState.counter = 0;
  gameState.over = false;
  gameState.index++;
  achievementManager.resetWinProcessed();
}

function saveGameState() {
  try {
    const dataToSave = {
      counter: gameState.counter,
      index: gameState.index,
      seed: gameState.seed,
      over: gameState.over,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(dataToSave));

    if (gameState.over) {
      sessionStorage.setItem("lastGameScore", getScore());
      sessionStorage.setItem("lastGameTotal", getTotalQuestions());
    }
  } catch (e) {
    console.error("Save failed:", e);
  }
}

function loadGameState() {
  const s = localStorage.getItem(CACHE_KEY);
  if (s) {
    try {
      const l = JSON.parse(s);
      gameState.seed = l.seed || Date.now();
      gameState.index = l.index || 0;
      gameState.counter = l.counter || 0;
      gameState.over = l.over || false;

      if (gameState.over) {
        const savedScore = sessionStorage.getItem("lastGameScore");
        const savedTotal = sessionStorage.getItem("lastGameTotal");
        if (savedScore && savedTotal) {
          const score = parseInt(savedScore);
          const total = parseInt(savedTotal);
          gameState.questions = Array(total)
            .fill()
            .map((_, i) => ({
              id: i,
              correct: i < score,
            }));
        }
      }
    } catch (e) {
      console.error("Parse fail:", e);
      localStorage.removeItem(CACHE_KEY);
      gameState.seed = Date.now();
    }
  } else {
    gameState.seed = Date.now();
  }
}

function showElement(element) {
  if (element) element.removeAttribute("cloak");
  return element;
}

function hideElement(element) {
  if (element) element.setAttribute("cloak", "");
  return element;
}

function setLoading(isLoading) {
  if (isLoading) {
    loaderElement.classList.add("is-active");
  } else {
    setTimeout(() => loaderElement.classList.remove("is-active"), 300);
  }
}

function updateProgress() {
  if (!gameState || getTotalQuestions() === 0) {
    questionCounterElement.textContent = `Question - / ${QUESTIONS_PER_LEVEL}`;
    totalScoreElement.textContent = `Score: 0`;
    progressBarElement.style.width = `0%`;
    return;
  }
  const currentQ = gameState.counter + 1;
  const totalQ = getTotalQuestions();
  const levelQ = (gameState.counter % QUESTIONS_PER_LEVEL) + 1;
  questionCounterElement.textContent = `Question ${levelQ} / ${QUESTIONS_PER_LEVEL}`;
  totalScoreElement.textContent = `Score: ${getScore()}`;
  const progressPercent = totalQ > 0 ? (currentQ / totalQ) * 100 : 0;
  progressBarElement.style.width = `${progressPercent}%`;
}

function drawQuestion() {
  const questionData = getCurrentQuestion();
  if (!questionData) {
    handleGameOver();
    return;
  }
  isTransitioning = true;
  questionCardElement.classList.add("fade-out");
  answersContainerElement.style.opacity = 0;
  setTimeout(() => {
    questionTextElement.textContent = questionData.text;

    updateProgress();

    const randomizedAnswers = shuffleArray(questionData.answers);

    answerButtonElements.forEach((button, index) => {
      if (index < randomizedAnswers.length) {
        const answerData = randomizedAnswers[index];
        button.style.animation = "none";
        button.offsetHeight;
        button.style.animation = null;

        button.disabled = false;
        button.dataset.qId = questionData.id;
        button.dataset.answerId = answerData.id;
        button.textContent = answerData.text;
        delete button.dataset.correct;
        button.classList.remove("correct", "incorrect");
      }
    });

    questionCardElement.classList.remove("fade-out");
    answersContainerElement.style.opacity = 1;
    setTimeout(() => {
      isTransitioning = false;
    }, 600);
  }, 300);
}

async function fetchQuestions() {
  if (isTransitioning) return;
  isTransitioning = true;
  setLoading(true);
  hideElement(errorScreenElement);
  try {
    const response = await fetch(
      `${API_URL}?seed=${gameState.seed}&index=${gameState.index}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();

    if (data.reset === true) {
      resetGame();
      gameState.seed = Date.now();
    }

    if (
      !data ||
      !Array.isArray(data.questions) ||
      data.questions.length === 0
    ) {
      throw new Error("No questions received");
    }

    gameState.seed = data.seed;
    gameState.index = data.index;
    gameState.questions = data.questions;
    saveGameState();
    currentLevelQuestionCount = gameState.counter % QUESTIONS_PER_LEVEL;
    showElement(gameScreenElement);
    drawQuestion();
  } catch (error) {
    console.error("Failed fetch questions:", error);
    showElement(errorScreenElement);
    isTransitioning = false;
  } finally {
    setTimeout(() => setLoading(false), 400);
  }
}

function handleAnswerSelection() {
  if (gameState.over || isTransitioning) return;
  isTransitioning = true;
  const button = this;
  const questionId = button.dataset.qId;
  const answerId = button.dataset.answerId;
  const isCorrect = answerQuestion(questionId, answerId);

  button.classList.add("pressed");
  button.dataset.correct = isCorrect;
  button.classList.add(isCorrect ? "correct" : "incorrect");
  answerButtonElements.forEach((btn) => {
    if (btn) btn.disabled = true;
  });

  saveGameState();
  // Get the current question count and check what level we're at
  const currentQuestionIndex = gameState.counter;
  const answeredQuestionIndexInLevel =
    (currentQuestionIndex % QUESTIONS_PER_LEVEL) + 1;

  setTimeout(() => {
    button.classList.remove("pressed");
    const isLastInLevel = answeredQuestionIndexInLevel === QUESTIONS_PER_LEVEL;
    // Calculate how many questions in this level were answered correctly
    let correctInCurrentLevel = 0;
    const levelStartIndex =
      Math.floor(currentQuestionIndex / QUESTIONS_PER_LEVEL) *
      QUESTIONS_PER_LEVEL;
    for (let i = levelStartIndex; i <= currentQuestionIndex; i++) {
      if (
        i < getTotalQuestions() &&
        gameState.questions[i] &&
        gameState.questions[i].correct === true
      ) {
        correctInCurrentLevel++;
      }
    }

    // Only show confetti if player has answered all questions in the level correctly and it's the last question
    if (isLastInLevel && correctInCurrentLevel === QUESTIONS_PER_LEVEL) {
      triggerLevelCompleteEffect(() => proceedToNextStep());
    } else {
      proceedToNextStep();
    }
  }, MIN_DELAY_BETWEEN_QUESTIONS);
}

function proceedToNextStep() {
  nextQuestion();
  if (gameState.over) {
    handleGameOver();
  } else {
    drawQuestion();
  }
}

function triggerLevelCompleteEffect(callback) {
  if (window.confetti) {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  }
  setTimeout(callback, 500);
}

function handleGameOver() {
  setLoading(false);

  // Check for win condition - all questions answered correctly
  const isWin = getScore() === getTotalQuestions() && getTotalQuestions() > 0;

  // Process win using achievement manager
  const totalWins = achievementManager.processWin(isWin);

  gameState.over = true;
  saveGameState();

  hideElement(gameScreenElement);
  showElement(gameOverScreenElement);
  gameOverScreenElement.dataset.win = isWin;

  // Use achievement manager to get game over text
  const score = getScore();
  const total = getTotalQuestions();
  gameOverTextElement.textContent = achievementManager.getGameOverText(
    score,
    total
  );

  if (total > 0) {
    gameOverScoreElement.textContent = `${score} / ${total}`;
  } else {
    const savedScore = sessionStorage.getItem("lastGameScore");
    const savedTotal = sessionStorage.getItem("lastGameTotal");
    if (savedScore && savedTotal) {
      gameOverScoreElement.textContent = `${savedScore} / ${savedTotal}`;
    } else {
      gameOverScoreElement.textContent = `0 / 0`;
    }
  }

  // Get wisdom title from achievement manager
  const achievedTitle = achievementManager.getWisdomTitle();
  if (achievedTitle) {
    rewardTitleElement.textContent = achievedTitle;
    showElement(rewardTitleElement);
  } else {
    hideElement(rewardTitleElement);
  }

  if (totalWins > 0) {
    showElement(winStreakContainerElement);
    winCountElement.textContent = `Total Wins: ${totalWins}`;
  } else {
    hideElement(winStreakContainerElement);
  }

  // Display achievements
  updateAchievementsDisplay();

  updateShareButtonVisibility();
  isTransitioning = false;
}

function handleReplay() {
  if (isTransitioning) return;
  hideElement(gameOverScreenElement);
  hideElement(errorScreenElement);
  resetGame();
  currentLevelQuestionCount = 0;

  sessionStorage.removeItem("lastGameScore");
  sessionStorage.removeItem("lastGameTotal");

  fetchQuestions();
}

function updateAchievementsDisplay() {
  let achievementsContainer = document.getElementById("achievementsContainer");
  if (!achievementsContainer) {
    achievementsContainer = document.createElement("div");
    achievementsContainer.id = "achievementsContainer";
    achievementsContainer.className = "achievements-container";

    const buttonsContainer = document.querySelector(".game-over-buttons");
    gameOverScreenElement
      .querySelector(".game-over-card")
      .insertBefore(achievementsContainer, buttonsContainer);
  }

  const unlockedAchievements = achievementManager.getUnlockedAchievements();
  const progress = achievementManager.getProgress();

  if (unlockedAchievements.length === 0) {
    achievementsContainer.innerHTML = `
      <div class="achievements-title">Achievements (0%)</div>
      <div class="no-achievements">Complete challenges to earn badges!</div>
    `;
    return;
  }

  const categories = {
    progress: { name: "Progress", achievements: [] },
    accuracy: { name: "Accuracy", achievements: [] },
    perfect: { name: "Perfect Levels", achievements: [] },
    challenge: { name: "Challenges", achievements: [] },
  };

  unlockedAchievements.forEach((achievement) => {
    if (categories[achievement.category]) {
      categories[achievement.category].achievements.push(achievement);
    }
  });

  let achievementsHTML = `
    <div class="achievements-title">Achievements (${progress.percentage}%)</div>
    <div class="achievements-progress">
      <div class="progress-bar-container">
        <div class="achievements-progress-bar" style="width: ${progress.percentage}%"></div>
      </div>
      <div class="progress-text">${progress.unlocked}/${progress.total}</div>
    </div>
    <div class="achievements-grid">
  `;

  unlockedAchievements.forEach((achievement) => {
    achievementsHTML += `
      <div class="achievement-badge" title="${achievement.title}: ${achievement.description}">
        <div class="badge-icon">${achievement.icon}</div>
        <div class="badge-title">${achievement.title}</div>
      </div>
    `;
  });

  achievementsHTML += `</div>`;
  achievementsContainer.innerHTML = achievementsHTML;
}

function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function updateShareButtonVisibility() {
  if (navigator.share) {
    showElement(shareButtonElement);
    shareButtonElement.onclick = async () => {
      try {
        await navigator.share({
          title: "Bible Challenge",
          text: "Take on this super tough Bible quiz!",
          url: window.location.href,
        });
      } catch (e) {
        if (e.name !== "AbortError") console.error(e);
      }
    };
  } else {
    hideElement(shareButtonElement);
  }
}

function addEventListeners() {
  if (errorButtonElement) errorButtonElement.onclick = handleReplay;
  if (replayButtonElement) replayButtonElement.onclick = handleReplay;
  answerButtonElements.forEach((button) => {
    if (button) button.onclick = handleAnswerSelection;
  });
  window.addEventListener("pagehide", saveGameState);
}

function initialize() {
  loadGameState();
  addEventListeners();
  achievementManager.checkAchievements();
  if (gameState.over) {
    handleGameOver();
  } else {
    fetchQuestions();
  }
}

document.addEventListener("DOMContentLoaded", initialize);
