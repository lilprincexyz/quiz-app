// quiz object
let quiz = {

  // questions array
  questions: [
    {
      text: "Demonstrating an understanding of the Pythagorean theorem at least a millenia before Pythagoras, which Old Babylonian clay tablet shows the diagonal rule and assorted Pythagorean triples?",
      choices: ["YBC 7289", "Plimpton 322", "Hammurabi code", "BM 13901"],
      rightChoiceIndex: 1
    },
    {
      text: "Let's assume that the constant pi has not been known since Euclidean geometry. What is one formula to approximate the area of a circle without the use of pi, the radius and the diameter?", 
      choices: ["pi * r squared", "4/3 * C squared", "9/5 * (C + 32)", "C squared / 12"],
      rightChoiceIndex: 3
    },
    {
      text: "During the time of ancient Egypt, how many palms was the equivalent of a royal cubit and what was the name of their slope measured in building the steppe pyramids?",
      choices: ["6 and hexad", "7 and seqed", "10 and ennead", "13 and triskaidecad"],
      rightChoiceIndex: 1,
    },
    {
      text: "What logarithmic base number is the current decimal system and the binary system?",
      choices: ["10 and 2", "6 and 3", "60 and 12", "100 and 20"],
      rightChoiceIndex: 0,
    },
    {
      text: "How many colors does it take to paint every region in any map without any two adjacent regions being the same color?",
      choices: ["4", "8", "16", "32"],
      rightChoiceIndex: 0,
    }
  ],

  // applause array as positive feedback
  applaud: [
    "Wow. You got it right!",
    "Correct. Keep it up!",
    "Nice job. On to the next page.",
    "Excellent! Nothing is beyond your reach."
  ],

  // chastisement array as negative feedback
  chastise: [
    "Nope. Try again.",
    "Nice try but that's not it...",
    "That's incorrect."
  ],

  // default setting
  score: 0,
  currentQuestionIndex: 0,
  route: 'start',
  lastAnswerCorrect: false,
  feedbackRandom: 0
};

// quiz mod lets
let setRoute = (quiz, route) => {
  quiz.route = route;
}

let resetGame = quiz => {
  quiz.score = 0;
  quiz.currentQuestionIndex = 0;
  setRoute(quiz, 'start');
}

let answerQuestion = (quiz, answer) => {
  let currentQuestion = quiz.questions[quiz.currentQuestionIndex];
  quiz.lastAnswerCorrect = currentQuestion.rightChoiceIndex === answer;
  if (quiz.lastAnswerCorrect) {
    quiz.score++;
  }
  selectFeedback(quiz);
  setRoute(quiz, 'answer-feedback');
}

let selectFeedback = quiz => {
  quiz.feedbackRandom = Math.random();
}

let advance = quiz => {
  quiz.currentQuestionIndex++;
  if (quiz.currentQuestionIndex === quiz.questions.length) {
    setRoute(quiz, 'final-feedback');
  }
  else {
    setRoute(quiz, 'question');
  }
}

// Route functions by page elements
let showApp = (quiz, elements) => {
  // default to hiding all routes, then show the current route
  Object.keys(elements).forEach(route => {
    elements[route].hide();
  });
  elements[quiz.route].show();

  if (quiz.route === 'start') {
      showStartPage(quiz, elements[quiz.route]);
  }
  else if (quiz.route === 'question') {
      showQuestionPage(quiz, elements[quiz.route]);
  }
  else if (quiz.route === 'answer-feedback') {
    showAnswerFeedbackPage(quiz, elements[quiz.route]);
  }
  else if (quiz.route === 'final-feedback') {
    showFinalFeedbackPage(quiz, elements[quiz.route]);
  }
}

// `showStartPage` is not needed 
// but is included here to keep consistency
let showStartPage = (quiz, element) => {
}

let showQuestionPage= (quiz, element) => {
  showQuestionCount(quiz, element.find('.question-count'));
  showQuestionText(quiz, element.find('.question-text'));
  showChoices(quiz, element.find('.choices'));
}

let showAnswerFeedbackPage = (quiz, element) => {
  showAnswerFeedbackHeader(quiz, element.find(".feedback-header"));
  showAnswerFeedbackText(quiz, element.find(".feedback-text"));
  showNextButtonText(quiz, element.find(".see-next"));
}

let showFinalFeedbackPage = (quiz, element) => {
  showFinalFeedbackText(quiz, element.find('.results-text'));
}

let showQuestionCount = (quiz, element) => {
  let text = (quiz.currentQuestionIndex + 1) + "/" + quiz.questions.length;
  element.text(text);
}

let showQuestionText = (quiz, element) => {
  let currentQuestion = quiz.questions[quiz.currentQuestionIndex];
  element.text(currentQuestion.text);
}

let showChoices = (quiz, element) => {
  let currentQuestion = quiz.questions[quiz.currentQuestionIndex];
  let choices = currentQuestion.choices.map((choice, index) => {
    return (
      '<li>' +
        '<label>' +
          '<input type="radio" name="user-answer" value="' + index + '" id="choice-'+ index +'"required>' + choice +
        '</label>' +
      '</li>'
    );
  });
  element.html(choices);
}

let showAnswerFeedbackHeader = (quiz, element) =>{
  let html = quiz.lastAnswerCorrect ?
      "<h1 class='user-was-correct'></h1>" :
      "<h1 class='user-was-incorrect'>Wrooonnnngggg!</>";

  element.html(html);
}

let showAnswerFeedbackText = (quiz, element) => {
  let choices = quiz.lastAnswerCorrect ? quiz.applaud : quiz.chastise;
  let text = choices[Math.floor(quiz.feedbackRandom * choices.length)];
  element.text(text);
}

let showNextButtonText = (quiz, element) => {
    let text = quiz.currentQuestionIndex < quiz.questions.length - 1 ?
      "Next" : "What's my score?";
  element.text(text);
}

let showFinalFeedbackText = (quiz, element) => {
  let text = "You got " + quiz.score + " out of " +
    quiz.questions.length + " questions right.";
  element.text(text);
}

// jQuery Event handlers
let PAGE_ELEMENTS = {
  'start': $('.start-page'),
  'question': $('.question-page'),
  'answer-feedback': $('.answer-feedback-page'),
  'final-feedback': $('.final-feedback-page')
};

$("form[name='game-start']").submit(event => {
  event.preventDefault();
  setRoute(quiz, 'question');
  showApp(quiz, PAGE_ELEMENTS);
});

$(".restart-game").click(event => {
  event.preventDefault();
  resetGame(quiz);
  showApp(quiz, PAGE_ELEMENTS);
});

$("form[name='current-question']").submit(event => {
  event.preventDefault();
  let answer = $("input[name='user-answer']:checked").val();
  answer = parseInt(answer, 10);
  answerQuestion(quiz, answer);
  showApp(quiz, PAGE_ELEMENTS);
});

$(".see-next").click(event => {
  advance(quiz);
  showApp(quiz, PAGE_ELEMENTS);
});

$(() => { showApp(quiz, PAGE_ELEMENTS); });
