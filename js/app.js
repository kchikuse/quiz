const LOADER = $("loader");
const GAME_SCREEN = $("main");
const QUESTION = $("main content");
const ERROR_SCREEN = $("on-error");
const ERROR_BUTTON = $("on-error button");
const GAMEOVER_SCREEN = $("game-over");
const GAMEOVER_SCORE = $("game-over score");
const GAMEOVER_STARS = $("game-over stars");
const SHARE_BUTTON = $("game-over button[share]");
const REPLAY_BUTTON = $("game-over button[replay]");
const GAMEOVER_TEXT = $("game-over score-text");
const ABOUTUS_BUTTON = $("main header button");
const BUTTONS = document.querySelectorAll("main footer button");

const CACHE = "game-state";

const game = new Game();

addEventListener("online", online);
addEventListener("offline", online);
addEventListener("beforeunload", saveGame);
addEventListener("DOMContentLoaded", onclick);
addEventListener("load", async () => {
    loadGame();
    play();
    //await navigator.serviceWorker.register("sw.js");
});

function play() {
    if (game.over) {
        game.reset();
    }

    download().then(state => {
        game.seed = state.seed;
        game.index = state.index;
        game.qs = state.questions;
        saveGame();
        draw();
    })
    .catch(() => {
        hide(LOADER);
        show(ERROR_SCREEN);
    });
}

function gameover() {
    const win = game.addWin();

    saveGame();
    hide(GAME_SCREEN);
    show(GAMEOVER_SCREEN);

    GAMEOVER_SCREEN.dataset.win = win;
    GAMEOVER_TEXT.textContent = `YOU ${win ? "WIN" : "LOSE"}`;
    GAMEOVER_SCORE.textContent = `${game.score} / ${game.total}`;

    if (game.wins) {
        show(GAMEOVER_STARS)
            .textContent = game.wins;
    }
}

async function download() {
    loading(true);
    const response = await fetch(`https://quizapi.tiiny.io?seed=${game.seed}&index=${game.index}`);
    loading(false);

    if (response.ok) {
        return response.json();
    }

    throw response;
}

function replay() {
    show(GAME_SCREEN);
    hide(ERROR_SCREEN);
    hide(GAMEOVER_SCREEN);
    delete GAMEOVER_SCREEN.dataset.win;
    play();
}

function draw() {
    const q = game.q;
    QUESTION.textContent = q.text;
    q.answers.forEach((answer, i) => {
        BUTTONS[i].disabled = false;
        BUTTONS[i].dataset.q = q.id;
        BUTTONS[i].dataset.answer = answer.id;
        BUTTONS[i].textContent = answer.text;
        delete BUTTONS[i].dataset.correct;
    });
}

function select() {
    const ds = this.dataset;

    ds.correct = game.answer(ds.q, ds.answer);

    BUTTONS.forEach(e => e.disabled = true);

    animate(() => {
        game.next();

        if (game.over) {
            return gameover();
        }

        draw();
    });
}

function onclick() {
    ERROR_BUTTON.onclick = replay;
    REPLAY_BUTTON.onclick = replay;

    BUTTONS.forEach(b => {
        b.onclick = select;
    });

    if (navigator.share) {
        show(SHARE_BUTTON)
            .onclick = async () => {
                await navigator.share({
                    title: 'Bible Quiz',
                    text: 'Super tough Bible quiz',
                    url: 'https://q.chikuse.co.za',
                });
            };
    }
}

function saveGame() {
    localStorage.setItem(CACHE, JSON.stringify(game));
}

function loadGame() {
    const json = localStorage.getItem(CACHE);
    if (json) {
        const state = JSON.parse(json);
        Object.assign(game, state);
    }
}

function show(e) {
    e.removeAttribute("cloak");
    return e;
}

function hide(e) {
    e.setAttribute("cloak", "");
    return e;
}

function loading(busy) {
    if (busy)
        show(LOADER);

    else
        hide(LOADER);
}

function online() {
    if (navigator.onLine) {
        REPLAY_BUTTON.disabled = false;
        REPLAY_BUTTON.textContent = 'PLAY AGAIN';
    }
    else {
        REPLAY_BUTTON.disabled = true;
        REPLAY_BUTTON.textContent = 'GO ONLINE TO PLAY';
    }
}

function animate(callback) {
    requestAnimationFrame(() => {
        setTimeout(() => {
            callback.apply(this);
        }, 500);
    });
}

function $(e) {
    return document.querySelector(e);
}
