let currentPlayer = null;
let currentScore = 0;

// Load saved data from this browser
let highScores = JSON.parse(localStorage.getItem("highScores")) || {
  Ryan: 0,
  Tyler: 0
};

let history = JSON.parse(localStorage.getItem("history")) || [];

// Get the elements from the page
const playerSelect = document.getElementById("player-select");
const counterScreen = document.getElementById("counter-screen");

const playerName = document.getElementById("player-name");
const counter = document.getElementById("counter");

const ryanButton = document.getElementById("ryan-button");
const tylerButton = document.getElementById("tyler-button");

const bounceButton = document.getElementById("bounce-button");
const undoButton = document.getElementById("undo-button");
const endButton = document.getElementById("end-button");

const ryanHighScore = document.getElementById("ryan-high-score");
const tylerHighScore = document.getElementById("tyler-high-score");

const historyDiv = document.getElementById("history");

// Start a turn
function startTurn(player) {
  currentPlayer = player;
  currentScore = 0;

  playerName.textContent = player;
  counter.textContent = currentScore;

  playerSelect.hidden = true;
  counterScreen.hidden = false;
}

// Add one bounce
function addBounce() {
  currentScore++;
  counter.textContent = currentScore;
}

// Undo one bounce
function undoBounce() {
  if (currentScore > 0) {
    currentScore--;
    counter.textContent = currentScore;
  }
}

// End the current turn
function endTurn() {
  if (!currentPlayer) return;

  // Update high score if necessary
  if (currentScore > highScores[currentPlayer]) {
    highScores[currentPlayer] = currentScore;
  }

  // Save this turn to history
  history.unshift({
    player: currentPlayer,
    score: currentScore,
    date: new Date().toLocaleString()
  });

  // Save everything on this device
  localStorage.setItem("highScores", JSON.stringify(highScores));
  localStorage.setItem("history", JSON.stringify(history));

  updateScores();
  updateHistory();

  currentPlayer = null;
  currentScore = 0;

  counterScreen.hidden = true;
  playerSelect.hidden = false;
}

// Update high scores on screen
function updateScores() {
  ryanHighScore.textContent = highScores.Ryan;
  tylerHighScore.textContent = highScores.Tyler;
}

// Update score history
function updateHistory() {
  historyDiv.innerHTML = "";

  if (history.length === 0) {
    historyDiv.textContent = "No games yet.";
    return;
  }

  history.forEach(turn => {
    const entry = document.createElement("p");
    entry.textContent =
      turn.player + ": " + turn.score + " bounces — " + turn.date;

    historyDiv.appendChild(entry);
  });
}

// Buttons
ryanButton.addEventListener("click", () => startTurn("Ryan"));
tylerButton.addEventListener("click", () => startTurn("Tyler"));

bounceButton.addEventListener("click", addBounce);
undoButton.addEventListener("click", undoBounce);
endButton.addEventListener("click", endTurn);

// Show saved scores when the app opens
updateScores();
updateHistory();
