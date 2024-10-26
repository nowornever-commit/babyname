let questions = [];
let userAnswers = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let username = "";
let timer;  // Declare timer globally to properly clear intervals

async function loadQuestions() {
  const response = await fetch('questions.json');
  questions = await response.json();
}

function startQuiz() {
  const nameInput = document.getElementById('username').value.trim();
  if (!nameInput) {
    alert("Please enter your name to personalize your quiz experience.");
    return;
  }

  username = nameInput;
  document.getElementById('container').innerHTML = "";
  showQuestion();
}

function showQuestion() {
  if (currentQuestionIndex >= questions.length) {
    showEndPage();
    return;
  }

  const question = questions[currentQuestionIndex];
  const container = document.getElementById('container');

  container.innerHTML = `
    <h2>${question.question}</h2>
    ${question.choices
      .map(
        (choice, index) =>
          `<button onclick="selectAnswer('${choice}')">${index + 1}. ${choice}</button>`
      )
      .join('')}
    <p>Time remaining: <span id="timer">10</span> seconds</p>
  `;

  startTimer();  // Start the timer for the current question
}

function startTimer() {
  let timeLeft = 10;
  document.getElementById('timer').innerText = timeLeft;

  // Clear any existing timer before starting a new one
  if (timer) clearInterval(timer);

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      saveAnswer(null);  // No answer selected
      moveToNextQuestion();
    }
  }, 1000);
}

function selectAnswer(choice) {
  clearInterval(timer);  // Stop the timer when the user selects an answer
  saveAnswer(choice);
  moveToNextQuestion();
}

function saveAnswer(choice) {
  const question = questions[currentQuestionIndex];
  userAnswers.push({
    question: question.question,
    correctAnswer: question.answer,
    selectedAnswer: choice
  });

  if (choice === question.answer) {
    correctAnswers++;
  }
}

function moveToNextQuestion() {
  currentQuestionIndex++;
  showQuestion();
}

function showEndPage() {
  const container = document.getElementById('container');
  container.innerHTML = `
    <h1>Quiz Completed!</h1>
    <p class="last-uw"><b>${username}</b>,</p> <p class="last-w">you answered <br><b> ${correctAnswers}</b> out of ${questions.length} <br> questions correctly.</p>
    <button onclick="showDetailedResults()">Check Answers</button>
  `;
}

function showDetailedResults() {
  const container = document.getElementById('container');
  container.innerHTML = `
    <h1>Your Results</h1>
    ${userAnswers
      .map(
        (answer, index) => `
          <div class="result">
            <p><strong>Q${index + 1}:</strong> ${answer.question}</p>
            <p>Your Answer: <span class="${answer.selectedAnswer === answer.correctAnswer ? 'correct' : 'incorrect'}">
              ${answer.selectedAnswer || 'No Answer'}
            </span></p>
            <p>Correct Answer: ${answer.correctAnswer}</p>
          </div>
        `
      )
      .join('')}
    <button onclick="goBackToScore()">Back to Score</button>
  `;
}

function goBackToScore() {
  showEndPage();
}

document.getElementById('start-btn').addEventListener('click', async () => {
  await loadQuestions();
  startQuiz();
});
