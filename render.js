console.log('Beginning Build...');
console.log('Loading Dependencies...');
const fs = require('fs');
const Mustache = require('mustache');
const puzzles = JSON.parse(fs.readFileSync('src/puzzles.json', 'utf-8'));

// Get the args after `node render.js`
const args = process.argv.slice(2);
if (args[0] == 'clean') {
    console.log('Clean build requested, removing dist folder if it exists')
    if (fs.existsSync('dist')) {
        fs.rmSync('dist', { recursive: true });
    }
}

console.log('Creating dist folders if they dont already exist...');
if (!fs.existsSync('dist/res')) {
    fs.mkdirSync('dist/res', { recursive: true });
}

function renderPuzzle(data) {
    const template = fs.readFileSync('src/puzzle.mst', 'utf-8');
    const options = fs.readFileSync('src/partials/options.mst', 'utf-8');
    const rendered = Mustache.render(template, data, { options });
    const number = data.puzzlenumber
    let stream = fs.createWriteStream(`dist/${number}.html`);
    stream.once('open', function (fd) {
        stream.end(rendered);
    });
}

function renderIndex() {
    const template = fs.readFileSync('src/index.mst', 'utf-8');
    const data = { puzzles };
    const rendered = Mustache.render(template, data);
    let stream = fs.createWriteStream('dist/index.html');
    stream.once('open', function (fd) {
        stream.end(rendered);
    });
}

function render404() {
    const template = fs.readFileSync('src/404.mst', 'utf-8');
    const rendered = Mustache.render(template);
    let stream = fs.createWriteStream('dist/404.html');
    stream.once('open', function (fd) {
        stream.end(rendered);
    });
}

console.log('Generating Puzzle Pages...')
puzzles.forEach(puzzle => {
    renderPuzzle(puzzle);
});

console.log('Generating Index Page...');
renderIndex();

console.log('Generating 404 Page...');
render404();

console.log('Copying static resources...');
fs.copyFileSync('src/puzzles.json', 'dist/res/puzzles.json');
fs.cpSync('res/', 'dist/res', { recursive: true});

console.log('Build completed')
