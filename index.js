const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const startScreen = document.getElementById('start-screen');
const mealImg = document.getElementById('meal-img');
const ingredientsList = document.getElementById('ingredients-list');
const guessSelect = document.getElementById('guess');
const feedback = document.getElementById('feedback');
const submitGuessBtn = document.getElementById('submit-guess');
const scoreSummary = document.getElementById('score-summary');
const mealSummary = document.getElementById('meal-summary');

let currentMeal = null;
let round = 0;
let score = 0;
const maxRounds = 3;
const history = [];

const categories = [
  "Beef", "Chicken", "Dessert", "Lamb", "Pasta", "Pork", "Seafood", "Vegan", "Vegetarian"
];
const cuisines = [
  "American", "British", "Canadian", "Chinese", "Dutch", "Egyptian", "French", "Greek",
  "Indian", "Irish", "Italian", "Jamaican", "Japanese", "Kenyan", "Malaysian", "Mexican",
  "Moroccan", "Russian", "Spanish", "Thai", "Tunisian", "Turkish", "Vietnamese"
];

// Start the game
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
submitGuessBtn.addEventListener('click', handleGuess);

// Populate dropdown with options
function populateDropdown() {
  guessSelect.innerHTML = '<option value="">-- Choose an option --</option>';
  [...new Set([...categories, ...cuisines])].sort().forEach(option => {
    const el = document.createElement('option');
    el.value = option;
    el.textContent = option;
    guessSelect.appendChild(el);
  });
}

// Start game logic
function startGame() {
  round = 0;
  score = 0;
  history.length = 0;

  startScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  feedback.textContent = '';

  populateDropdown();
  loadRandomMeal();
}

// Load a random meal from TheMealDB
function loadRandomMeal() {
  feedback.textContent = '';
  guessSelect.value = '';
  ingredientsList.innerHTML = '';

  fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(response => response.json())
    .then(data => {
      const meal = data.meals[0];
      currentMeal = meal;
      mealImg.src = meal.strMealThumb;

      // Extract and format ingredients
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
          const li = document.createElement('li');
          li.textContent = `${ingredient} - ${measure}`;
          ingredientsList.appendChild(li);
        }
      }
    })
    .catch(error => {
      console.error("Error fetching meal:", error);
    });
}

// Handle user's guess
function handleGuess() {
  const guess = guessSelect.value;
  if (!guess) {
    feedback.textContent = "Please make a selection!";
    return;
  }

  const isCorrect =
    currentMeal.strCategory.toLowerCase() === guess.toLowerCase() ||
    currentMeal.strArea.toLowerCase() === guess.toLowerCase();

  feedback.textContent = isCorrect
    ? "✅ Correct!"
    : `❌ Incorrect! It was ${currentMeal.strArea} / ${currentMeal.strCategory}`;

  if (isCorrect) score++;

  history.push({
    name: currentMeal.strMeal,
    area: currentMeal.strArea,
    category: currentMeal.strCategory,
    image: currentMeal.strMealThumb
  });

  round++;
  if (round < maxRounds) {
    setTimeout(loadRandomMeal, 1500);
  } else {
    setTimeout(showResults, 2000);
  }
}

// Display final score and history
function showResults() {
  gameScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');
  scoreSummary.textContent = `You got ${score} out of ${maxRounds} correct!`;

  mealSummary.innerHTML = '';
  history.forEach(meal => {
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${meal.image}" alt="${meal.name}" width="100">
      <strong>${meal.name}</strong> — ${meal.area}, ${meal.category}
    `;
    mealSummary.appendChild(li);
  });
}
