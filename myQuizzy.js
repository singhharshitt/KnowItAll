document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("start-btn");
    const quizContainer = document.getElementById("quiz-container");
    const questionEl = document.getElementById("question");
    const answersEl = document.getElementById("answers");
    const nextBtn = document.getElementById("next-btn");
    const timerEl = document.getElementById("time");
    const timerContainer = document.getElementById("timer");
    const scoreEl = document.getElementById("score");
    const scoreboard = document.getElementById("scoreboard");
    const leaderboardContainer = document.createElement("div");
    leaderboardContainer.id = "leaderboard";
    leaderboardContainer.classList.add("mt-6", "p-4", "bg-gray-200", "rounded", "shadow-lg", "hidden");
    document.body.appendChild(leaderboardContainer);

    let questions = [
        { question: "What is the capital of France?", answers: ["Berlin", "Madrid", "Paris", "Rome"], correct: 2 },
        { question: "What is 2 + 2?", answers: ["3", "4", "5", "6"], correct: 1 },
        { question: "Which language is used for web development?", answers: ["Python", "C++", "JavaScript", "Java"], correct: 2 }
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    let timeLeft = 30;
    let timer;
    let userName = "";

    function startQuiz() {
        userName = prompt("Enter your name:");
        if (!userName) return;
        document.getElementById("start-screen").classList.add("hidden");
        quizContainer.classList.remove("hidden");
        timerContainer.classList.remove("hidden");
        scoreboard.classList.remove("hidden");
        loadQuestion();
        startTimer();
    }

    function loadQuestion() {
        resetState();
        let currentQuestion = questions[currentQuestionIndex];
        questionEl.textContent = currentQuestion.question;
        currentQuestion.answers.forEach((answer, index) => {
            const btn = document.createElement("button");
            btn.textContent = answer;
            btn.classList.add("block", "w-full", "px-4", "py-2", "bg-gray-200", "hover:bg-blue-400", "rounded");
            btn.addEventListener("click", () => selectAnswer(index));
            answersEl.appendChild(btn);
        });
    }

    function resetState() {
        answersEl.innerHTML = "";
        nextBtn.classList.add("hidden");
    }

    function selectAnswer(index) {
        let correctAnswer = questions[currentQuestionIndex].correct;
        if (index === correctAnswer) {
            score++;
            scoreEl.textContent = score;
        }
        nextBtn.classList.remove("hidden");
    }

    function nextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            endQuiz();
        }
    }

    function startTimer() {
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                timerEl.textContent = timeLeft;
            } else {
                clearInterval(timer);
                endQuiz();
            }
        }, 1000);
    }

    function endQuiz() {
        clearInterval(timer);
        quizContainer.innerHTML = `<h2 class='text-xl font-bold text-center'>Quiz Over! Your score: ${score}</h2>`;
        timerContainer.classList.add("hidden");
        scoreboard.classList.add("hidden");
        submitScore();
    }

    function submitScore() {
        fetch("quiz_backend.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `name=${encodeURIComponent(userName)}&score=${score}`
        })
        .then(response => response.json())
        .then(data => {
            console.log("Score submitted successfully", data);
            showLeaderboard();
        })
        .catch(error => console.error("Error submitting score:", error));
    }

    function showLeaderboard() {
        fetch("quiz_backend.php")
            .then(response => response.json())
            .then(data => {
                leaderboardContainer.innerHTML = "<h2 class='text-lg font-bold text-center'>Leaderboard</h2>";
                data.forEach((entry, index) => {
                    const div = document.createElement("div");
                    div.classList.add("p-2", "rounded", "mb-2", index === 0 ? "bg-yellow-300" : "bg-gray-100");
                    div.innerHTML = `<strong>${index + 1}. ${entry.name}</strong> - ${entry.score} points`;
                    leaderboardContainer.appendChild(div);
                    
                    if (index === 0) {
                        const dancer = document.createElement("div");
                        dancer.innerHTML = "🕺";
                        dancer.style.fontSize = "2rem";
                        dancer.style.animation = "dance 1s infinite alternate";
                        div.appendChild(dancer);
                    }
                });
                leaderboardContainer.classList.remove("hidden");
            })
            .catch(error => console.error("Error fetching leaderboard:", error));
    }

    startBtn.addEventListener("click", startQuiz);
    nextBtn.addEventListener("click", nextQuestion);

    const style = document.createElement("style");
    style.innerHTML = "@keyframes dance { 0% { transform: rotate(-10deg); } 100% { transform: rotate(10deg); } }";
    document.head.appendChild(style);
});
