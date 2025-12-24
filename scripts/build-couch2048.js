const fs = require('fs');
const path = require('path');

const couchDir = path.join(__dirname, '../assets/games/glitch2016/couch');
const outputFile = path.join(__dirname, '../assets/games/couch2048-bundle.html');

// Lire tous les fichiers nécessaires
const files = {
  css: fs.readFileSync(path.join(couchDir, 'couch.css'), 'utf8'),
  polyfill: fs.readFileSync(path.join(couchDir, 'polyfill.js'), 'utf8'),
  sound: fs.readFileSync(path.join(couchDir, 'build/sound.js'), 'utf8'),
  sonant: fs.readFileSync(path.join(couchDir, 'music/sonant.js'), 'utf8'),
  song: fs.readFileSync(path.join(couchDir, 'music/song.js'), 'utf8'),
  AAudio: fs.readFileSync(path.join(couchDir, 'AAudio.js'), 'utf8'),
  Body: fs.readFileSync(path.join(couchDir, 'Body.js'), 'utf8'),
  Constraint: fs.readFileSync(path.join(couchDir, 'Constraint.js'), 'utf8'),
  Cushion: fs.readFileSync(path.join(couchDir, 'Cushion.js'), 'utf8'),
  Piece: fs.readFileSync(path.join(couchDir, 'Piece.js'), 'utf8'),
  Point: fs.readFileSync(path.join(couchDir, 'Point.js'), 'utf8'),
  StaticPoint: fs.readFileSync(path.join(couchDir, 'StaticPoint.js'), 'utf8'),
  Vec2: fs.readFileSync(path.join(couchDir, 'Vec2.js'), 'utf8'),
  background: fs.readFileSync(path.join(couchDir, 'background.js'), 'utf8'),
  canvas: fs.readFileSync(path.join(couchDir, 'canvas.js'), 'utf8'),
  collision: fs.readFileSync(path.join(couchDir, 'collision.js'), 'utf8'),
  debounce: fs.readFileSync(path.join(couchDir, 'debounce.js'), 'utf8'),
  game: fs.readFileSync(path.join(couchDir, 'game.js'), 'utf8'),
  main: fs.readFileSync(path.join(couchDir, 'main.js'), 'utf8'),
  pointer: fs.readFileSync(path.join(couchDir, 'pointer.js'), 'utf8'),
  run: fs.readFileSync(path.join(couchDir, 'run.js'), 'utf8'),
};

// Créer le HTML complet
const html = `<!doctype html>
<html>
    <head>
        <meta charset=utf8>
        <meta name=viewport content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <title>Couch 2048</title>
        <style>
${files.css}
        </style>
    </head>
    <body>
        <div id=container>
            <canvas id=backcanvas></canvas>
            <canvas id=canvas></canvas>
            <div id=load>
                <h1>Loading</h1>
            </div>
            <div id=home>
                <h1>Couch 2048</h1>
                <p>
                    <b>How to play:</b><br>
                    ⭐️ Drag pieces around<br>
                    ⭐️ Stack those with the same number<br>
                    ⭐️ Get to 2048 to win the game<br>
                    ⭐️ REVEL IN GLORY <small>(optional but recommended)</small>
                </p>
                <div id=start>NEW GAME</div>
                <div id=menu>
                    <input type=checkbox class=opt id=m checked><label for=m> Music</label><br>
                    <input type=checkbox class=opt id=s checked><label for=s> Sound FX</label><br>
                    <input type=checkbox class=opt id=q checked><label for=q> High Quality</label>
                </div>
            </div>
            <div id=end style=display:none>
                <h1>You win</h1>
                <p>
                    <b>Let's party!</b><br>
                    <small>Success is commemorated; failure merely remembered</small><br>
                    Written for js13kGames–2016
                </p>
                <div id=reset>PLAY AGAIN</div>
            </div>
        </div>

        <script>
${files.polyfill}
        </script>
        <script>
${files.sound}
        </script>
        <script>
${files.sonant}
        </script>
        <script>
${files.song}
        </script>
        <script>
${files.AAudio}
        </script>
        <script>
${files.Body}
        </script>
        <script>
${files.Constraint}
        </script>
        <script>
${files.Cushion}
        </script>
        <script>
${files.Piece}
        </script>
        <script>
${files.Point}
        </script>
        <script>
${files.StaticPoint}
        </script>
        <script>
${files.Vec2}
        </script>
        <script>
${files.background}
        </script>
        <script>
${files.canvas}
        </script>
        <script>
${files.collision}
        </script>
        <script>
${files.debounce}
        </script>
        <script>
${files.game}
        </script>
        <script>
${files.main}
        </script>
        <script>
${files.pointer}
        </script>
        <script>
${files.run}
        </script>
    </body>
</html>`;

// Écrire le fichier
fs.writeFileSync(outputFile, html, 'utf8');
console.log('✅ Bundle HTML créé avec succès:', outputFile);

