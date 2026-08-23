/**
 * Meadow vs Bloop — K–1 reading RPG vertical slice
 * Turn-based, reading-gated. 3 Spark Strikes to open the chest.
 */

(function () {
  "use strict";

  const HITS_TO_WIN = 3;

  /** Literacy Coach bank + close CVC distractors */
  const WORD_BANK = [
    { word: "cat", distractor: "cap", wave: "early" },
    { word: "sun", distractor: "fun", wave: "early" },
    { word: "map", distractor: "mop", wave: "early" },
    { word: "dog", distractor: "dig", wave: "early" },
    { word: "pig", distractor: "pin", wave: "mid" },
    { word: "bed", distractor: "bad", wave: "mid" },
    { word: "run", distractor: "ran", wave: "mid" },
    { word: "hop", distractor: "hip", wave: "later" },
    { word: "cup", distractor: "cap", wave: "later" },
    { word: "net", distractor: "nut", wave: "later" },
  ];

  const BLOOP_FLAVOR = [
    "Bloop wiggles softly. Tickle tap!",
    "Bloop goes boop… then waits.",
    "A tiny friendly tap. Bloop smiles.",
    "Bloop scoots… still blocking the chest!",
  ];

  const el = {
    modeConfirm: document.getElementById("mode-confirm"),
    modeMatch: document.getElementById("mode-match"),
    cvcWord: document.getElementById("cvc-word"),
    cvcWrap: document.getElementById("cvc-wrap"),
    controlsConfirm: document.getElementById("controls-confirm"),
    controlsMatch: document.getElementById("controls-match"),
    btnConfirm: document.getElementById("btn-confirm"),
    choiceA: document.getElementById("choice-a"),
    choiceB: document.getElementById("choice-b"),
    feedback: document.getElementById("feedback"),
    flavor: document.getElementById("flavor"),
    prompt: document.getElementById("prompt"),
    hero: document.getElementById("hero"),
    bloop: document.getElementById("bloop"),
    chest: document.getElementById("chest"),
    fx: document.getElementById("fx"),
    hitPips: document.getElementById("hit-pips"),
    winOverlay: document.getElementById("win-overlay"),
    btnReplay: document.getElementById("btn-replay"),
    readPanel: document.getElementById("read-panel"),
  };

  const state = {
    mode: "confirm", // "confirm" | "match"
    hits: 0,
    queue: [],
    current: null,
    busy: false,
    won: false,
  };

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function buildQueue() {
    const early = WORD_BANK.filter((w) => w.wave === "early");
    const mid = WORD_BANK.filter((w) => w.wave === "mid");
    const later = WORD_BANK.filter((w) => w.wave === "later");
    // First playtest order: familiar first, hold later hits for after early
    return shuffle(early).concat(shuffle(mid), shuffle(later));
  }

  function setMode(mode) {
    if (state.busy || state.won) return;
    state.mode = mode;
    el.modeConfirm.classList.toggle("active", mode === "confirm");
    el.modeMatch.classList.toggle("active", mode === "match");
    el.modeConfirm.setAttribute("aria-selected", mode === "confirm" ? "true" : "false");
    el.modeMatch.setAttribute("aria-selected", mode === "match" ? "true" : "false");
    el.controlsConfirm.classList.toggle("hidden", mode !== "confirm");
    el.controlsMatch.classList.toggle("hidden", mode !== "match");
    el.prompt.textContent =
      mode === "confirm" ? "Sound it out! Parent taps Confirm." : "Sound it out! Pick the matching word.";
    renderChoices();
  }

  function updatePips() {
    const pips = el.hitPips.querySelectorAll(".pip");
    pips.forEach((pip, i) => {
      pip.classList.toggle("filled", i < state.hits);
    });
  }

  function setFeedback(text, kind) {
    el.feedback.textContent = text;
    el.feedback.className = "feedback" + (kind ? " " + kind : "");
  }

  function setFlavor(text) {
    el.flavor.textContent = text || "";
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function showCurrentWord() {
    if (!state.current) return;
    el.cvcWord.textContent = state.current.word.toUpperCase();
    el.cvcWord.classList.remove("pop");
    el.cvcWrap.classList.remove("miss-shake");
    renderChoices();
  }

  function renderChoices() {
    if (state.mode !== "match" || !state.current) return;
    const target = state.current.word.toUpperCase();
    const distractor = state.current.distractor.toUpperCase();
    const leftFirst = Math.random() < 0.5;
    const left = leftFirst ? target : distractor;
    const right = leftFirst ? distractor : target;
    el.choiceA.textContent = left;
    el.choiceB.textContent = right;
    el.choiceA.dataset.word = left.toLowerCase();
    el.choiceB.dataset.word = right.toLowerCase();
  }

  function setControlsEnabled(on) {
    el.btnConfirm.disabled = !on;
    el.choiceA.disabled = !on;
    el.choiceB.disabled = !on;
  }

  async function onSuccess() {
    state.busy = true;
    setControlsEnabled(false);
    setFeedback("Yes! Spark Strike!", "good");

    el.cvcWord.classList.add("pop");
    el.fx.classList.remove("flash");
    void el.fx.offsetWidth;
    el.fx.classList.add("flash");

    const spark = document.createElement("div");
    spark.className = "spark";
    el.fx.appendChild(spark);

    el.hero.classList.add("strike");
    await wait(180);
    el.bloop.classList.remove("hit");
    void el.bloop.offsetWidth;
    el.bloop.classList.add("hit");
    await wait(320);
    el.hero.classList.remove("strike");
    spark.remove();

    state.hits += 1;
    updatePips();
    setFlavor("Spark Strike hits Bloop! (" + state.hits + "/" + HITS_TO_WIN + ")");

    if (state.hits >= HITS_TO_WIN) {
      await winSequence();
      return;
    }

    // Bloop turn — soft, never scary
    await wait(280);
    el.bloop.classList.remove("wiggle");
    void el.bloop.offsetWidth;
    el.bloop.classList.add("wiggle");
    const line = BLOOP_FLAVOR[Math.floor(Math.random() * BLOOP_FLAVOR.length)];
    setFlavor(line);
    setFeedback("Bloop's turn… soft wiggle!", "soft");
    await wait(900);

    // Next word
    advanceWord();
    setFeedback("");
    setFlavor("Your turn — read the word!");
    state.busy = false;
    setControlsEnabled(true);
  }

  async function onMiss() {
    if (state.busy || state.won) return;
    state.busy = true;
    setControlsEnabled(false);
    setFeedback("Almost! Try again", "soft");
    el.cvcWrap.classList.remove("miss-shake");
    void el.cvcWrap.offsetWidth;
    el.cvcWrap.classList.add("miss-shake");
    // Same word — no HP loss; Bloop waits
    setFlavor("Bloop waits patiently.");
    await wait(650);
    el.cvcWrap.classList.remove("miss-shake");
    setFeedback("");
    state.busy = false;
    setControlsEnabled(true);
  }

  function advanceWord() {
    if (state.queue.length === 0) {
      state.queue = buildQueue();
    }
    state.current = state.queue.shift();
    showCurrentWord();
  }

  async function winSequence() {
    state.won = true;
    el.bloop.classList.add("gone");
    el.chest.classList.add("open");
    setFlavor("The chest opens!");
    setFeedback("You win!", "good");
    await wait(500);
    el.winOverlay.classList.remove("hidden");
    state.busy = false;
  }

  function resetGame() {
    state.hits = 0;
    state.won = false;
    state.busy = false;
    state.queue = buildQueue();
    state.current = state.queue.shift();
    el.bloop.classList.remove("gone", "hit", "wiggle");
    el.chest.classList.remove("open");
    el.winOverlay.classList.add("hidden");
    el.fx.classList.remove("flash");
    el.fx.innerHTML = "";
    updatePips();
    showCurrentWord();
    setFeedback("");
    setFlavor("Bloop blocks the chest. Read to Spark Strike!");
    setControlsEnabled(true);
    setMode(state.mode);
  }

  // Events
  el.modeConfirm.addEventListener("click", () => setMode("confirm"));
  el.modeMatch.addEventListener("click", () => setMode("match"));

  el.btnConfirm.addEventListener("click", () => {
    if (state.busy || state.won || state.mode !== "confirm") return;
    onSuccess();
  });

  function onChoiceClick(btn) {
    if (state.busy || state.won || state.mode !== "match") return;
    const picked = btn.dataset.word;
    if (picked === state.current.word) {
      onSuccess();
    } else {
      onMiss();
    }
  }

  el.choiceA.addEventListener("click", () => onChoiceClick(el.choiceA));
  el.choiceB.addEventListener("click", () => onChoiceClick(el.choiceB));
  el.btnReplay.addEventListener("click", resetGame);

  resetGame();
})();
