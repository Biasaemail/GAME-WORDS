document.addEventListener('DOMContentLoaded', () => {
    // --- Variabel Global ---
    const wordList = ["CAHAYA", "TAUHID", "MANDI", "ROBLOX", "JALAN", "SIGMA", "PUASA", "LAPAR", "DASI", "BERENANG", "MUNGKIN", "KATAK", "LUCU", "IMUT", "KEREN", "MANIS", "PINK", "UNGGU", "GEMAS"]; // Added more words
    let targetWord = '';
    // let currentGuess = ''; // Not strictly needed as we read from input directly
    let currentRowIndex = 0;
    const maxGuesses = 7;
    let isGameOver = false;
    let isMusicPlaying = false;
    let wordLength = 5; // Default, updated by targetWord

    // --- DOM References ---
    // Screens & Containers
    const loadingScreen = document.getElementById('loading-screen');
    const startScreen = document.getElementById('start-screen');
    const gameContainer = document.querySelector('.game-container');
    const bubblesBackground = document.querySelector('.bubbles-background'); // Ref for bubbles

    // Start Screen Elements
    const startButton = document.getElementById('start-button');

    // Game Elements
    const gameBoard = document.getElementById('game-board');
    const guessInput = document.getElementById('guess-input');
    const guessForm = document.getElementById('guess-form');
    const messageArea = document.getElementById('message-area');
    const tryAgainButton = document.getElementById('try-again-button');
    const submitButton = document.getElementById('submit-button');
    const guessesLeftSpan = document.getElementById('guesses-left'); // Span for guesses left

    // Menu Elements
    const menuToggleButton = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    const musicToggleMenu = document.getElementById('music-toggle-menu');
    const returnToMainMenuButton = document.getElementById('return-to-main-menu');
    const closeMenuButton = sideMenu.querySelector('.close-menu-button');

    // Audio
    const backgroundMusic = document.getElementById('background-music');

    // --- Bubble Creation ---
    function createBubbles() {
        bubblesBackground.innerHTML = ''; // Clear existing bubbles if any
        const numberOfBubbles = 10; // Match CSS approx
        for (let i = 0; i < numberOfBubbles; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            // Set random size, position, duration - can override CSS slightly
             const size = Math.random() * 80 + 20; // 20px to 100px
             bubble.style.width = `${size}px`;
             bubble.style.height = `${size}px`;
             bubble.style.left = `${Math.random() * 95}%`; // Position across width
             bubble.style.animationDuration = `${Math.random() * 10 + 10}s`; // 10s to 20s
             bubble.style.animationDelay = `${Math.random() * 5}s`; // 0s to 5s delay
            bubblesBackground.appendChild(bubble);
        }
    }

    // --- Audio Functions ---
    function playMusic() {
        if (!backgroundMusic) return; // Safety check
        backgroundMusic.play().then(() => {
            isMusicPlaying = true;
            musicToggleMenu.checked = true;
            localStorage.setItem('musicEnabled', 'true');
            console.log("Music playing.");
        }).catch(error => {
            console.warn("Music autoplay blocked or failed:", error);
            isMusicPlaying = false;
            musicToggleMenu.checked = false;
            localStorage.setItem('musicEnabled', 'false');
            // Can't reliably show message here as it might be before game starts
        });
    }

    function pauseMusic() {
         if (!backgroundMusic) return;
        backgroundMusic.pause();
        isMusicPlaying = false;
        musicToggleMenu.checked = false;
        localStorage.setItem('musicEnabled', 'false');
        console.log("Music paused.");
    }

    function toggleMusic() {
        if (isMusicPlaying) {
            pauseMusic();
        } else {
             // Try playing - user interaction via toggle counts
             playMusic();
        }
    }

    function loadMusicPreference() {
        const musicEnabled = localStorage.getItem('musicEnabled');
        // Set the toggle state based on preference
        musicToggleMenu.checked = (musicEnabled === 'true');
        // We will attempt to play only after the start button is clicked if enabled
        console.log("Music preference loaded:", musicEnabled);
    }

    // --- UI Flow & Navigation ---
    function showScreen(screenToShow) {
        loadingScreen.classList.add('hidden');
        startScreen.classList.add('hidden');
        gameContainer.style.display = 'none'; // Hide game container

        if (screenToShow === 'loading') {
            loadingScreen.classList.remove('hidden');
        } else if (screenToShow === 'start') {
            startScreen.classList.remove('hidden');
        } else if (screenToShow === 'game') {
            gameContainer.style.display = 'block'; // Show game container
        }
    }

    function navigateToStartScreen() {
        showScreen('start');
        closeSideMenu(); // Close menu if open
        // Optionally pause music when returning to start
        // pauseMusic();
    }

    function navigateToGame() {
        showScreen('game');
        initGame(); // Initialize or re-initialize the game
        // Attempt to play music if preference is set to true
        if (musicToggleMenu.checked) {
            playMusic();
        }
    }

    // --- Menu Functions ---
    function openSideMenu() {
        sideMenu.classList.add('open');
        menuToggleButton.classList.add('open');
    }

    function closeSideMenu() {
        sideMenu.classList.remove('open');
        menuToggleButton.classList.remove('open');
    }

    // --- Game Initialization ---
    function initGame() {
        // 1. Reset Variables
        targetWord = getRandomWord(wordList);
        wordLength = targetWord.length;
        currentRowIndex = 0;
        isGameOver = false;
        console.log("Jawaban (untuk testing):", targetWord);

        // 2. Reset UI Elements
        gameBoard.innerHTML = ''; // Clear previous board
        messageArea.textContent = '';
        messageArea.className = 'message-area'; // Reset classes
        guessInput.value = '';
        guessInput.maxLength = wordLength;
        guessInput.disabled = false;
        submitButton.disabled = false;
        tryAgainButton.style.display = 'none';
        updateGuessesLeft(); // Update guesses display

        // 3. Create New Grid
        createGuessGrid(wordLength);

        // 4. Focus Input
        guessInput.focus();
    }

    function getRandomWord(list) {
        const randomIndex = Math.floor(Math.random() * list.length);
        return list[randomIndex].toUpperCase();
    }

    function createGuessGrid(length) {
        gameBoard.style.gridTemplateRows = `repeat(${maxGuesses}, 1fr)`;
        for (let i = 0; i < maxGuesses; i++) {
            const row = document.createElement('div');
            row.classList.add('guess-row');
            row.style.gridTemplateColumns = `repeat(${length}, 1fr)`;
            for (let j = 0; j < length; j++) {
                const box = document.createElement('div');
                box.classList.add('letter-box');
                row.appendChild(box);
            }
            gameBoard.appendChild(row);
        }
    }

     function updateGuessesLeft() {
        const remaining = maxGuesses - currentRowIndex;
        guessesLeftSpan.textContent = remaining >= 0 ? remaining : 0;
    }

    // --- Gameplay Functions ---
    function handleGuessSubmit(event) {
        event.preventDefault();
        if (isGameOver || submitButton.disabled) return;

        const guess = guessInput.value.toUpperCase().trim();

        // Validation
        if (guess.length !== wordLength) {
            showMessage(`Harus ${wordLength} huruf ya!`, 'error');
            shakeInput();
            return;
        }
        if (!/^[A-Z]+$/.test(guess)) {
             showMessage('Hanya boleh huruf A-Z', 'error');
             shakeInput();
             return;
        }

        // Process guess
        submitButton.disabled = true; // Disable during check
        displayGuess(guess); // Show letters immediately
        checkGuess(guess); // Start animation and logic
        updateGuessesLeft(); // Update remaining guesses count visually
    }

    function displayGuess(guess) {
        const row = gameBoard.children[currentRowIndex];
        if (!row) return;
        const boxes = row.children;
        for (let i = 0; i < guess.length; i++) {
            if (boxes[i]) boxes[i].textContent = guess[i];
        }
    }

    function checkGuess(guess) {
        const row = gameBoard.children[currentRowIndex];
        if (!row) return;
        const boxes = row.children;
        const guessLetters = guess.split('');
        const targetLetters = targetWord.split('');

        // Calculate Status (Correct, Present, Absent) - Logic remains the same
        const letterStatus = Array(wordLength).fill(null);
        const targetLetterCounts = {};
        targetLetters.forEach(letter => { targetLetterCounts[letter] = (targetLetterCounts[letter] || 0) + 1; });

        // 1. Check Correct (Green)
        for (let i = 0; i < wordLength; i++) {
            if (guessLetters[i] === targetLetters[i]) {
                letterStatus[i] = 'correct';
                targetLetterCounts[guessLetters[i]]--;
            }
        }
        // 2. Check Present (Yellow) & Absent (Grey)
        for (let i = 0; i < wordLength; i++) {
            if (letterStatus[i] === null) {
                if (targetLetters.includes(guessLetters[i]) && targetLetterCounts[guessLetters[i]] > 0) {
                    letterStatus[i] = 'present';
                    targetLetterCounts[guessLetters[i]]--;
                } else {
                    letterStatus[i] = 'absent';
                }
            }
        }

        // Apply Reveal Animation and THEN Status Classes
        let revealPromises = [];
        for (let i = 0; i < boxes.length; i++) {
            const box = boxes[i];
            if (!box) continue;

            const promise = new Promise(resolve => {
                 setTimeout(() => {
                    box.classList.add('reveal'); // Start reveal animation
                    // Add event listener to apply final state *after* reveal animation ends
                    box.addEventListener('animationend', function applyState(event) {
                        if (event.animationName === 'reveal') {
                             box.removeEventListener('animationend', applyState); // Clean up listener
                             box.classList.add(`${letterStatus[i]}-state`); // Add final color class
                             resolve(); // Resolve promise after state applied
                        }
                    }, { once: true }); // Ensure listener fires only once
                }, i * 120); // Stagger reveal start (slightly faster)
            });
            revealPromises.push(promise);
        }


        // After all reveal animations and state applications are done
        Promise.all(revealPromises).then(() => {
             currentRowIndex++;

             // Check Win/Lose Condition
             if (guess === targetWord) {
                endGame(true);
            } else if (currentRowIndex >= maxGuesses) {
                endGame(false);
            } else {
                // Game continues
                if (!isGameOver) {
                     guessInput.value = '';
                     submitButton.disabled = false;
                     guessInput.focus();
                }
            }
        });
    }

    function endGame(isWin) {
        isGameOver = true;
        guessInput.disabled = true;
        submitButton.disabled = true;

        if (isWin) {
            showMessage(`Horeee! Benar! Jawabannya: ${targetWord}`, 'win');
            animateWinRow();
             setTimeout(() => tryAgainButton.style.display = 'block', 1500); // Show button after celebration
        } else {
             showMessage(`Yaaah.. Belum berhasil :( Jawabannya: ${targetWord}`, 'lose');
             tryAgainButton.style.display = 'block'; // Show button immediately on loss
        }
         updateGuessesLeft(); // Ensure count shows 0 if max guesses reached
    }

    function showMessage(msg, type = 'info') {
        messageArea.textContent = msg;
        messageArea.className = 'message-area'; // Reset base class
        if (type) messageArea.classList.add(type);
    }

    function shakeInput() {
        guessInput.classList.add('shake-error');
        guessInput.addEventListener('animationend', () => {
            guessInput.classList.remove('shake-error');
        }, { once: true });
    }

    function animateWinRow() {
         const winRowIndex = currentRowIndex - 1;
         if (winRowIndex < 0) return;
         const winRow = gameBoard.children[winRowIndex];
         if (winRow) {
              const boxes = winRow.children;
              for(let i = 0; i < boxes.length; i++) {
                  if (boxes[i]) {
                    boxes[i].style.setProperty('--bounce-delay', `${i * 80}ms`);
                    boxes[i].classList.add('win-bounce');
                    // Optional: clean up class after animation
                     boxes[i].addEventListener('animationend', function winBounceEnd(e) {
                          if (e.animationName === 'win-bounce') {
                               boxes[i].classList.remove('win-bounce');
                               boxes[i].style.removeProperty('--bounce-delay');
                               boxes[i].removeEventListener('animationend', winBounceEnd);
                          }
                     }, { once: true });
                  }
              }
         }
    }

    // --- Event Listeners ---
    window.addEventListener('load', () => {
        createBubbles(); // Create background bubbles
        // Loading -> Start transition
        setTimeout(() => {
            showScreen('start');
            loadMusicPreference(); // Load setting when UI ready
        }, 4500); // Adjust loading time if needed (matches loader animation)
    });

    // Start Game
    startButton.addEventListener('click', navigateToGame);

    // In-Game Actions
    guessForm.addEventListener('submit', handleGuessSubmit);
    tryAgainButton.addEventListener('click', initGame); // Restart game logic

    // Menu Interactions
    menuToggleButton.addEventListener('click', () => {
        if (sideMenu.classList.contains('open')) {
            closeSideMenu();
        } else {
            openSideMenu();
        }
    });
    closeMenuButton.addEventListener('click', closeSideMenu);
    musicToggleMenu.addEventListener('change', toggleMusic);
    returnToMainMenuButton.addEventListener('click', navigateToStartScreen);


    // Initial Setup
    showScreen('loading'); // Start with loading screen

});
