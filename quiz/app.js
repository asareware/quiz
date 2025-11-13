(() => {
  // Mapping of question name attributes to their correct answers.
  const answerKey = {
    q1: "b",
    q2: "b",
    q3: "a",
    q4: "b",
    q5: "a",
  };

  // Cache the main UI nodes we need to read or manipulate.
  const form = document.getElementById("quizForm");
  const resultBox = document.getElementById("result");
  const resetButton = document.getElementById("resetQuiz");
  const questionGrid = document.getElementById("questionGrid");

  // Guard early if the markup is missing any required elements.
  if (!form || !resultBox || !resetButton || !questionGrid) {
    return;
  }

  const totalQuestions = Object.keys(answerKey).length;

  // Fisher-Yates shuffle so each reset randomizes order deterministically.
  const shuffleArray = (nodes) => {
    const items = [...nodes];
    for (let i = items.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  };

  // Shuffle the entire question cards within the grid.
  const shuffleQuestions = () => {
    const columns = questionGrid.querySelectorAll(".question-item");
    shuffleArray(columns).forEach((column) => {
      questionGrid.appendChild(column);
    });
  };

  // Keep the first answer spaced from the prompt after shuffling options.
  const applyAnswerSpacing = (answers) => {
    answers.forEach((answer, index) => {
      if (index === 0) {
        answer.classList.add("mt-3");
      } else {
        answer.classList.remove("mt-3");
      }
    });
  };

  // Shuffle answers for every question independently.
  const shuffleAnswers = () => {
    const cards = questionGrid.querySelectorAll(".question-card");
    cards.forEach((card) => {
      const answers = card.querySelectorAll(".answer-option");
      if (!answers.length) {
        return;
      }

      const answerWrapper = answers[0].parentElement;
      const shuffledAnswers = shuffleArray(answers);
      shuffledAnswers.forEach((answer) => {
        answerWrapper.appendChild(answer);
      });
      applyAnswerSpacing(shuffledAnswers);
    });
  };

  // Helper to reset the quiz back to its initial state.
  const resetQuiz = () => {
    form.reset();
    form.classList.remove("was-validated");
    resultBox.classList.add("d-none");
    resultBox.textContent = "";
    resetButton.classList.add("d-none");
    shuffleQuestions();
    shuffleAnswers();
  };

  // Handle form submission, calculate the score, and surface the percentage.
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const formData = new FormData(form);
    let correctAnswers = 0;

    for (const [question, answer] of Object.entries(answerKey)) {
      if (formData.get(question) === answer) {
        correctAnswers += 1;
      }
    }

    const percentScore = Math.round((correctAnswers / totalQuestions) * 100);
    resultBox.textContent = `You scored ${percentScore}% (${correctAnswers}/${totalQuestions} correct).`;
    resultBox.classList.remove("d-none");

    if (percentScore === 100) {
      resetButton.classList.add("d-none");
    } else {
      resetButton.classList.remove("d-none");
    }
  });

  // Allow the learner to retake the quiz without refreshing the page.
  resetButton.addEventListener("click", resetQuiz);
})();
