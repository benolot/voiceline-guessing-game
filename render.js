const fs = require('fs');
const Mustache = require('mustache');
const puzzles = JSON.parse(fs.readFileSync('src/puzzles.json', 'utf-8'));

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

puzzles.forEach(puzzle => {
    renderPuzzle(puzzle);
});

renderIndex();

fs.copyFileSync('src/puzzles.json', 'dist/res/puzzles.json');
fs.cpSync('res/', 'dist/res', { recursive: true});
