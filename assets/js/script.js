//Elements
//Buttons
const startQuizBtn = $('#start-quiz-btn');
const answerBtnA = $('#answer-btn-a');
const answerBtnB = $('#answer-btn-b');
const answerBtnC = $('#answer-btn-c');
const answerBtnD = $('#answer-btn-d');
const viewScoreBtn = $('#score-btn');
const restartQuizBtn = $('#restart-quiz-btn');
const submitScoreBtn = $('#submit-score-btn');

//Cards
const startCard = $('#start-card');
const qCard = $('#q-card');
const endCard = $('#end-card')

//Quiz Elements
const qNum = $('#q-num');
const qText = $('#q-text');
const quizOpts = $('#quiz');
const checkAns = $('#check-answer');

//Other Elements
const scoreSpan = $('#score');
const finalScoreSpan = $('#final-score');
const timerText = $('#timer');
const initialsInput = $('#initials-input');
const namesList = $('#modal-names-list')
const scoresList = $('#modal-scores-list')
let submittedScores = [];

//Questions
const Q1 = {question: "Which of the following denotes an object?", a: "{property: \"value\"}", b: "[property: \"value\"]", c: "object()", d: "object{property, value}", answer: "answer-btn-a"};
const Q2 = {question: "Which variable cannot be reassigned?", a: "var", b: "const", c: "let", d: "con", answer: "answer-btn-b"};
const Q3 = {question: "Which operator requires equal value and type to return true?", a: "=", b: "==", c: "===", d: "&&", answer: "answer-btn-c"};
const Q4 = {question: "Which of the following begins a loop?", a: "as long as", b: "until", c: "break", d: "for", answer: "answer-btn-d"};
const Q5 = {question: "Which jquery syntax gets an element by id?", a: "$('#elementID')", b: "('elementID')", c: "$#elementID", d: "$('elementID')", answer: "answer-btn-a"};
const Q6 = {question: "Which of the following is an array?", a: "{}", b: "[]", c: "\"\"", d: "//", answer: "answer-btn-b"};
let qArray = [Q1, Q2, Q3, Q4, Q5, Q6];
let qArrayRand = [];
let qDone = [];
let Q;

//Counters
let score = 0;
let answered = 0;
let remainingSeconds;

//Shuffle Questions
function shuffleArray(array) {
  let currentIndex = array.length;
  let randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  qArrayRand = array;
};

//Timer
function timer() {
  let timerInterval = setInterval(function() {
    remainingSeconds--;
    timerText.text(remainingSeconds);

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      answered = 6; //force answered to 6 so displayNext() will result in switch to end card
      displayNext();
    }
  }, 1000);
};

//Start Quiz
//Hides starting card, shows question card, sets time to 60s, and starts timer
function startQuiz() {
  startCard.removeClass('d-block');
  startCard.addClass('d-none');
  qCard.removeClass('d-none');
  qCard.addClass('d-block');
  score = 0;
  remainingSeconds = 60;
  timerText.text(remainingSeconds);
  timer();
};

//Event listener for start quiz button. Shuffles questions, displays the quiz form, and populates the question
startQuizBtn.on('click', function() {
  shuffleArray(qArray);
  startQuiz();
  showQuestion();
});

//During Quiz
//Populates question area
function showQuestion() {
  //Select question, add it to qDone array
  Q = qArrayRand.shift();
  qDone.push(Q);
  //display question elements
  let num = answered + 1;
  answered++;
  qNum.text("Question " + num);
  qText.text(Object.values(Q)[0]);
  answerBtnA.text(Object.values(Q)[1]);
  answerBtnB.text(Object.values(Q)[2]);
  answerBtnC.text(Object.values(Q)[3]);
  answerBtnD.text(Object.values(Q)[4]);
}

//Checks the answer and displays correctt or incorrect, then displays the next question
function checkAnswer(target) {
  if (target.id == Object.values(Q)[5]) {
    checkAns.text("Correct!");
    //adjust score
    score += 10;
    scoreSpan.text(score);
  } else {
    checkAns.text("Incorrect!");
    //remove 10 seconds
    remainingSeconds -= 10;
    if (remainingSeconds <= 0) {
      remainingSeconds = 1;
    }
  }
  displayNext();
}

//Event listener that calls checkAnswer function on the target button
quizOpts.on('click', function(event) {
  checkAnswer(event.target);
})

//Checks if any questions remain. If not, displays end card. If yes, displays next question
function displayNext() {
  if (answered == 6) {
    //end timer
    //show end card
    remainingSeconds = 1;
    finalScoreSpan.text(score);
    qCard.removeClass('d-block');
    qCard.addClass('d-none');
    endCard.removeClass('d-none');
    endCard.addClass('d-block');
  } else {
    showQuestion();
  }
}

//End Quiz

//Submit Score
//Save initials and score to local storage
submitScoreBtn.on('click', function(event) {
  event.preventDefault();

  let submittedScore = {
    initials: initialsInput.val(),
    score: score
  };
  submittedScores.push(submittedScore);

  localStorage.setItem("submittedScores", JSON.stringify(submittedScores));
  submitScoreBtn.addClass("btn-success");
  initialsInput.val('');
  addToScores();
});

function addToScores() {
  let lastScore = JSON.parse(localStorage.getItem("submittedScores"));
  if (lastScore !== null) {
    for (let i = 0; i < lastScore.length; i++) {
      console.log(lastScore[i]);
      namesList.append('<li>' + lastScore[i].initials);
      scoresList.append('<li>' + lastScore[i].score);
    }
  }
}

//Event listener on restart buttton that resets variables calls starting functions
restartQuizBtn.on('click', function() {
  endCard.removeClass('d-block')
  endCard.addClass('d-none')
  checkAns.text("-");
  answered = 0;
  score = 0;
  scoreSpan.text(score);
  qDone = [];
  qArrayRand = [];
  qArray = [Q1, Q2, Q3, Q4, Q5, Q6];
  shuffleArray(qArray);
  startQuiz();
  showQuestion();
});

addToScores();