// Setup the search box
const element = document.querySelector('#choice');
const choices = new Choices(element, { renderChoiceLimit: 1 });

// Initalise Alpine
document.addEventListener('alpine:init', () => {
    Alpine.store('guessindex', 1);
    Alpine.store('guesshistory', []);
    Alpine.store('darkMode', {
        init() {
            this.on = window.matchMedia('(prefers-color-scheme: dark)').matches
        },

        on: false,

        toggle() {
            this.on = !this.on
        }
    });
    Alpine.store('currentTime', Date.now());
});

// Load the puzzle data
async function loadPuzzle() {
    const response = await fetch("res/puzzles.json");
    const puzzles = await response.json();
    const puzzlenumber = document.querySelector('#puzzlenumber').innerHTML
    return puzzles[puzzlenumber - 1];
}
loadPuzzle().then(puzzle => {
    document.getElementById('submit').addEventListener('click', (e) => {checkAnswer(puzzle)});
});

// Check answer is correct, and handle
function checkAnswer(puzzle) {
    const submmitedAnswer = document.getElementById('choice').value;
    if (submmitedAnswer == puzzle.answer) {
        Alpine.store('guessindex', 4);
        const niceName = document.querySelector(`option[value="${submmitedAnswer}"]`).textContent;
        Alpine.store('guesshistory', [...Alpine.store('guesshistory'), {niceName: '✅ ' + niceName, correct: true}]);
    } else {
        Alpine.store('guessindex', Alpine.store('guessindex') + 1);
        const niceName = document.querySelector(`option[value="${submmitedAnswer}"]`).textContent;
        Alpine.store('guesshistory', [...Alpine.store('guesshistory'), { niceName: '❌ ' + niceName, correct: false}]);
    }
}
