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

  // Guard early if the markup is missing any required elements.
  if (!form || !resultBox || !resetButton) {
    return;
  }

  const totalQuestions = Object.keys(answerKey).length;

  // Helper to reset the quiz back to its initial state.
  const resetQuiz = () => {
    form.reset();
    form.classList.remove("was-validated");
    resultBox.classList.add("d-none");
    resultBox.textContent = "";
    resetButton.classList.add("d-none");
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
    resetButton.classList.remove("d-none");
  });

  // Allow the learner to retake the quiz without refreshing the page.
  resetButton.addEventListener("click", resetQuiz);
})();
