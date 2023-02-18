const startBtn = document.querySelector(".start-btn");
const submitBtn = document.querySelector(".submit-btn");
const closeModal = document.querySelector(".close");
const overlay = document.querySelector(".overlay");
const difficulty = document.querySelector(".difficulty");
const difficultyBtn = difficulty.querySelector(".select");
const difficultyOptions = difficulty.querySelector(".options");
const difficultyItems = difficultyOptions.querySelectorAll(".item");
const category = document.querySelector(".category");
const categoryBtn = category.querySelector(".select");
const categoryOptions = category.querySelector(".options");
const categoryItems = categoryOptions.querySelectorAll(".item");
const answersArea = document.querySelector(".answers-area");
const questionParent = document.querySelector(".question");
const modal = document.querySelector(".modal");
let currentIndex = 0;
let correctAnswers = 0;
closeModal.addEventListener("click", () => {
  // alert("Quiz Is Finished");
  // overlay.classList.remove("active");
  // difficultyBtn.removeAttribute("disabled");
  // categoryBtn.removeAttribute("disabled");
  window.location.reload();
});

async function getQuestions(difficultyVal, categoryVal) {
  const req = await fetch("./api.json");
  const res = await req.json();
  const questions = res.results;

  const filteredQues = questions.filter(
    (ques) =>
      ques.category.toLowerCase() === categoryVal.toLowerCase() &&
      ques.difficulty.toLowerCase() === difficultyVal.toLowerCase()
  );

  const questionsCount = filteredQues.length;

  showQuestions(filteredQues[currentIndex], questionsCount);

  submitBtn.addEventListener("click", () => {
    let rightAnswer = filteredQues[currentIndex]["correct_answer"];

    currentIndex++;
    checkAnswer(rightAnswer);

    questionParent.innerHTML = "";
    answersArea.innerHTML = "";

    showQuestions(
      filteredQues[currentIndex],
      questionsCount,
      categoryVal,
      difficultyVal
    );

    showResult(questionsCount);
  });
}

function checkAnswer(rightAnswer) {
  let answers = document.getElementsByName("questions");
  let chosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      chosenAnswer = answers[i].dataset.answer;
    }
  }
  if (rightAnswer === chosenAnswer) {
    correctAnswers++;
  }
}

function showResult(count) {
  if (currentIndex === count) {
    questionParent.remove();
    modal.innerHTML = "";
    const h1 = document.createElement("h1");
    h1.innerHTML = `You got ${correctAnswers} / ${count}`;
    modal.appendChild(h1);
  }
}

function showQuestions(filteredQues, count) {
  if (currentIndex < count) {
    let questionTitle = document.createElement("h2");
    let questionText = document.createTextNode(filteredQues.question);
    questionTitle.appendChild(questionText);
    questionParent.appendChild(questionTitle);

    for (let i = 0; i < filteredQues.answers.length; i++) {
      let answerDiv = document.createElement("div");
      answerDiv.className = "answer";
      let radioInput = document.createElement("input");
      radioInput.name = "questions";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = filteredQues.answers[i];
      if (i === 0) {
        radioInput.checked = true;
      }

      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;
      let labelText = document.createTextNode(filteredQues.answers[i]);
      label.appendChild(labelText);
      answerDiv.appendChild(radioInput);
      answerDiv.appendChild(label);
      answersArea.appendChild(answerDiv);
    }
  }

  if (filteredQues === undefined) {
    difficultyBtn.removeAttribute("disabled");
    categoryBtn.removeAttribute("disabled");
    modal.innerHTML = "";
    modal.classList.add("no-ques");
    const noQuestion = document.createElement("h1");
    noQuestion.style.fontSize = "1.5rem";
    noQuestion.textContent =
      "There is no questions, please select another difficulty or category.";
    modal.appendChild(noQuestion);
  }
}

window.addEventListener("click", (e) => {
  if (e.target.classList.contains("overlay")) {
    // overlay.classList.remove("active");
    // difficultyBtn.removeAttribute("disabled");
    // categoryBtn.removeAttribute("disabled");
    window.location.reload();
  }
});

difficultyBtn.addEventListener("click", () => {
  difficultyOptions.classList.toggle("active");
});

categoryBtn.addEventListener("click", () => {
  categoryOptions.classList.toggle("active");
});

window.onclick = (e) => {
  if (!e.target.classList.contains("select")) {
    difficultyOptions.classList.remove("active");
    categoryOptions.classList.remove("active");
  }
};

difficultyItems.forEach((difficUltyItem) => {
  difficUltyItem.addEventListener("click", (e) => {
    categoryBtn.removeAttribute("disabled");
    difficultyOptions.classList.remove("active");
    const difficultyValue = e.target.textContent;
    difficultyBtn.value = difficultyValue;
    difficultyBtn.textContent = difficultyValue;

    categoryItems.forEach((categoryItem) => {
      categoryItem.addEventListener("click", (e) => {
        categoryOptions.classList.remove("active");
        const categoryVal = e.target.textContent;
        categoryBtn.value = categoryVal;
        categoryBtn.textContent = categoryVal;

        if (categoryItem && difficUltyItem) {
          startBtn.addEventListener("click", () => {
            overlay.requestFullscreen();
            getQuestions(difficultyValue, categoryVal);
            overlay.classList.add("active");
          });

          difficultyBtn.setAttribute("disabled", "disabled");
          categoryBtn.setAttribute("disabled", "disabled");
        }
      });
    });
  });
});
