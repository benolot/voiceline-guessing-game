console.log('Beginning Build...');
console.log('Loading Dependencies...');
const fs = require('fs');
const Mustache = require('mustache');
const puzzles = JSON.parse(fs.readFileSync('src/puzzles.json', 'utf-8'));
const puzzleopts = JSON.parse(fs.readFileSync('src/options.json', 'utf-8'));

console.log('Creating dist folders if they dont already exist...');
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}
if (!fs.existsSync('dist/res')) {
    fs.mkdirSync('dist/res');
}

function renderOptions(options) {
    let optsStr = '<option value="">Search for a game or character or submit to skip</option>';
    options.forEach(game => {
        game.choices.forEach(choice => {
            let option = `<option value="${game.short}-${choice.short}">${game.name} - ${choice.name}</option>`;
            optsStr += option;
        })
    })

    return optsStr;
}

function renderPuzzle(data, options) {
    const template = fs.readFileSync('src/puzzle.mst', 'utf-8');
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

console.log('Generating Puzzle Choices...')
var options = renderOptions(puzzleopts)

console.log('Generating Puzzle Pages...')
puzzles.forEach(puzzle => {
    renderPuzzle(puzzle, options);
});

console.log('Generating Index Page...');
renderIndex();

console.log('Generating 404 Page...');
render404();

console.log('Copying static resources...');
fs.copyFileSync('src/puzzles.json', 'dist/res/puzzles.json');
fs.cpSync('res/', 'dist/res', { recursive: true});

console.log('Build completed')
