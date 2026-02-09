const STAGES = ['shape', 'batter', 'icing', 'topping', 'finish'];
const POSITIONS = [10, 35, 60, 85, 110]; // Percentages on belt

let gameState = {
  currentStageIndex: 0,
  score: 0,
  timeLeft: 60,
  target: {},
  currentCake: {
    shape: null,
    batter: null,
    icing: null,
    topping: null
  },
  timerInterval: null
};

// --- Initialization ---
function startGame() {
  gameState.score = 0;
  gameState.timeLeft = 60;
  gameState.currentStageIndex = 0;

  updateScoreUI();
  generateTarget();
  resetPlayerCake();

  clearInterval(gameState.timerInterval);
  gameState.timerInterval = setInterval(() => {
    gameState.timeLeft--;
    document.getElementById("timer").innerText = gameState.timeLeft;
    if (gameState.timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function generateTarget() {
  const shapes = ['square', 'circle', 'heart'];
  const batters = ['vanilla', 'chocolate', 'strawberry'];
  const icings = ['chocolate', 'vanilla', 'berry', null];
  const toppings = ['sprinkles', 'cherry', 'candy', null];

  gameState.target = {
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    batter: batters[Math.floor(Math.random() * batters.length)],
    icing: icings[Math.floor(Math.random() * icings.length)],
    topping: toppings[Math.floor(Math.random() * toppings.length)]
  };

  renderCake(gameState.target, document.getElementById("target-cake"));
}

function resetPlayerCake() {
  gameState.currentCake = { shape: null, batter: null, icing: null, topping: null };
  gameState.currentStageIndex = 0;
  updateCakeVisuals();
  updateConveyorPosition();
}

// --- Interaction ---

function setShape(shape) {
  if (gameState.currentStageIndex !== 0) return; // Only at stage 0
  gameState.currentCake.shape = shape;
  updateCakeVisuals();
}

function setBatter(batter) {
  if (gameState.currentStageIndex !== 1) return;
  gameState.currentCake.batter = batter;
  updateCakeVisuals();
}

function setIcing(icing) {
  if (gameState.currentStageIndex !== 2) return;
  gameState.currentCake.icing = icing;
  updateCakeVisuals();
}

function setTopping(topping) {
  if (gameState.currentStageIndex !== 3) return;
  gameState.currentCake.topping = topping;
  updateCakeVisuals();
}

function advanceCake() {
  if (gameState.timeLeft <= 0) return;

  // Validation: Can't move past shape if no shape selected
  if (gameState.currentStageIndex === 0 && !gameState.currentCake.shape) {
    showNotification("Wybierz kształt!", 1500);
    return;
  }
  // Validation: Can't move past batter if no batter selected
  if (gameState.currentStageIndex === 1 && !gameState.currentCake.batter) {
    showNotification("Wybierz ciasto!", 1500);
    return;
  }

  gameState.currentStageIndex++;

  if (gameState.currentStageIndex >= 4) {
    // Finished
    checkWinCondition();
    setTimeout(resetPlayerCake, 1000); // Wait a bit then reset
  } else {
    updateConveyorPosition();
  }
}

// --- Rendering ---

function updateConveyorPosition() {
  const cakeEl = document.getElementById("player-cake");
  const pos = POSITIONS[gameState.currentStageIndex];
  cakeEl.style.left = pos + "%";
}

function updateCakeVisuals() {
  renderCake(gameState.currentCake, document.getElementById("player-cake"));
}

function renderCake(data, container) {
  container.innerHTML = ''; // Clear

  // Base/Shape
  if (data.shape) {
    const base = document.createElement('div');
    base.className = `cake-base cake-shape-${data.shape}`;

    // Color based on batter
    if (data.batter) {
      if (data.batter === 'vanilla') base.style.backgroundColor = '#f3e5ab';
      if (data.batter === 'chocolate') base.style.backgroundColor = '#8b4513';
      if (data.batter === 'strawberry') base.style.backgroundColor = '#ffb6c1';
    } else {
      base.style.backgroundColor = '#ccc'; // Placeholder color
    }

    container.appendChild(base);

    // Icing
    if (data.icing) {
      const icing = document.createElement('div');
      icing.className = `layer-icing cake-shape-${data.shape}`; // Shape matches base
      if (data.icing === 'chocolate') icing.style.backgroundColor = '#5d4037';
      if (data.icing === 'vanilla') icing.style.backgroundColor = '#fff';
      if (data.icing === 'berry') icing.style.backgroundColor = '#9c27b0';
      base.appendChild(icing);
    }

    // Topping
    if (data.topping) {
      const topping = document.createElement('div');
      topping.className = 'layer-topping';
      if (data.topping === 'sprinkles') topping.innerText = '🌈';
      if (data.topping === 'cherry') topping.innerText = '🍒';
      if (data.topping === 'candy') topping.innerText = '🍬';
      container.appendChild(topping);
    }
  }
}

// --- Game Logic ---

// --- Game Logic ---

function checkWinCondition() {
  const t = gameState.target;
  const p = gameState.currentCake;

  let match = true;
  if (t.shape !== p.shape) match = false;
  if (t.batter !== p.batter) match = false;
  if (t.icing !== p.icing) match = false;
  if (t.topping !== p.topping) match = false;

  if (match) {
    showNotification("Super! Idealny tort! +10 pkt", 2000);
    gameState.score += 10;
    generateTarget(); // New order
  } else {
    showNotification("Nie pasuje do zamówienia. Spróbuj jeszcze raz.", 2000);
    // No points, strict factory!
  }
  updateScoreUI();
}

function updateScoreUI() {
  document.getElementById("score").innerText = gameState.score;
}

function endGame() {
  clearInterval(gameState.timerInterval);
  showNotification(`Koniec czasu! Twój wynik: ${gameState.score}`, 5000);
}

// --- Helpers ---
function showNotification(message, duration = 2000) {
  const notifEl = document.getElementById('notification-area');
  const msgEl = document.getElementById('notification-message');

  if (!notifEl || !msgEl) return;

  msgEl.innerText = message;
  notifEl.classList.remove('hidden');

  setTimeout(() => {
    notifEl.classList.add('hidden');
  }, duration);
}

// Start immediately
startGame();
