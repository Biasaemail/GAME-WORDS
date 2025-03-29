document.addEventListener('DOMContentLoaded', () => {
    // --- Variabel Global ---
    const wordList = ["CAHAYA", "TAUHID", "MANDI", "ROBLOX", "JALAN", "SIGMA", "PUASA", "LAPAR", "DASI", "BERENANG", "MUNGKIN", "KATAK", "LUCU", "IMUT", "KEREN"]; // Added more words
    let targetWord = '';
    let currentGuess = '';
    let currentRowIndex = 0;
    const maxGuesses = 7; // Consistent with CSS grid rows
    let isGameOver = false;
    let isMusicPlaying = false; // Track music state
    let wordLength = 5; // Default, will be set by targetWord

    // --- Referensi Elemen DOM ---
    const loadingScreen = document.getElementById('loading-screen');
    const startScreen = document.getElementById('start-screen');
    const gameContainer = document.querySelector('.game-container');
    const startButton = document.getElementById('start-button');
    const settingsButton = document.getElementById('settings-button');
    const settingsModal = document.getElementById('settings-modal');
    const closeModalButton = settingsModal.querySelector('.close-button');
    const musicToggle = document.getElementById('music-toggle');
    const backgroundMusic = document.getElementById('background-music');

    const gameBoard = document.getElementById('game-board');
    const guessInput = document.getElementById('guess-input');
    const guessForm = document.getElementById('guess-form');
    const messageArea = document.getElementById('message-area');
    const tryAgainButton = document.getElementById('try-again-button');
    const submitButton = document.getElementById('submit-button');

    // --- Fungsi Audio ---
    function playMusic() {
        backgroundMusic.play().then(() => {
            isMusicPlaying = true;
            musicToggle.checked = true; // Sync toggle state
            localStorage.setItem('musicEnabled', 'true'); // Save preference
        }).catch(error => {
            // Autoplay might be blocked, user interaction needed
            console.warn("Music autoplay blocked:", error);
            isMusicPlaying = false;
            musicToggle.checked = false;
             localStorage.setItem('musicEnabled', 'false');
            // Optionally show a message to the user to enable sound manually
        });
    }

    function pauseMusic() {
        backgroundMusic.pause();
        isMusicPlaying = false;
        musicToggle.checked = false; // Sync toggle state
        localStorage.setItem('musicEnabled', 'false'); // Save preference
    }

    function toggleMusic() {
        if (isMusicPlaying) {
            pauseMusic();
        } else {
             // Try playing immediately when toggled on
             backgroundMusic.play().then(() => {
                isMusicPlaying = true;
                localStorage.setItem('musicEnabled', 'true');
            }).catch(error => {
                console.warn("Music play failed on toggle:", error);
                isMusicPlaying = false;
                musicToggle.checked = false; // Revert toggle if play fails
                localStorage.setItem('musicEnabled', 'false');
                showMessage("Klik di mana saja untuk mengaktifkan musik", "info"); // Prompt user
            });
        }
    }

    // Load music preference from localStorage
    function loadMusicPreference() {
        const musicEnabled = localStorage.getItem('musicEnabled');
        if (musicEnabled === 'true') {
             // Don't autoplay immediately, wait for start button or toggle
             musicToggle.checked = true;
             // isMusicPlaying will be set correctly when playMusic is called
        } else {
            musicToggle.checked = false;
            isMusicPlaying = false; // Ensure it's false if not enabled
        }
    }


    // --- Fungsi Inisialisasi & UI Flow ---

    function showLoadingScreen() {
        loadingScreen.classList.remove('hidden');
    }

    function hideLoadingScreen() {
        loadingScreen.classList.add('hidden');
    }

    function showStartScreen() {
        startScreen.classList.remove('hidden');
        gameContainer.style.display = 'none'; // Ensure game is hidden
    }

    function hideStartScreen() {
        startScreen.classList.add('hidden');
        gameContainer.style.display = 'block'; // Show game
    }

    function showSettingsModal() {
        settingsModal.style.display = 'flex'; // Use flex to enable centering
         setTimeout(() => settingsModal.classList.add('visible'), 10); // Allow display change before transition
    }

    function hideSettingsModal() {
         settingsModal.classList.remove('visible');
         // Wait for transition before setting display none
         setTimeout(() => settingsModal.style.display = 'none', 300); // Match CSS transition duration
    }


    // Inisialisasi Permainan Baru (Called AFTER start button)
    function initGame() {
        // 1. Reset Variabel
        targetWord = getRandomWord(wordList);
        wordLength = targetWord.length; // Update word length
        currentGuess = '';
        currentRowIndex = 0;
        isGameOver = false;
        console.log("Jawaban (untuk testing):", targetWord);

        // 2. Reset Tampilan
        gameBoard.innerHTML = ''; // Kosongkan papan
        messageArea.textContent = '';
        messageArea.className = ''; // Reset class
        guessInput.value = '';
        guessInput.maxLength = wordLength; // Set correct max length
        guessInput.disabled = false; // Enable input
        submitButton.disabled = false; // Enable button
        tryAgainButton.style.display = 'none';

        // 3. Buat Grid Tebakan
        createGuessGrid(wordLength);

        // 4. Fokus ke input
        guessInput.focus();
    }

    // Memilih Kata Acak
    function getRandomWord(list) {
        const randomIndex = Math.floor(Math.random() * list.length);
        return list[randomIndex].toUpperCase();
    }

    // Membuat Grid Kotak Tebakan
    function createGuessGrid(length) {
        gameBoard.style.gridTemplateRows = `repeat(${maxGuesses}, 1fr)`; // Ensure row count is correct

        for (let i = 0; i < maxGuesses; i++) {
            const row = document.createElement('div');
            row.classList.add('guess-row');
            row.style.gridTemplateColumns = `repeat(${length}, 1fr)`; // Set column count

            for (let j = 0; j < length; j++) {
                const box = document.createElement('div');
                box.classList.add('letter-box');
                // Store row/col for potential future use, though not strictly needed now
                box.setAttribute('data-row', i);
                box.setAttribute('data-col', j);
                row.appendChild(box);
            }
            gameBoard.appendChild(row);
        }
    }

    // --- Fungsi Gameplay ---

    // Menangani Pengiriman Tebakan
    function handleGuessSubmit(event) {
        event.preventDefault();
        if (isGameOver || submitButton.disabled) return; // Extra check for disabled state

        const guess = guessInput.value.toUpperCase().trim();

        // --- Validasi Input ---
        if (guess.length !== wordLength) {
            showMessage(`Tebakan harus ${wordLength} huruf!`, 'error');
            shakeInput();
            return;
        }
        if (!/^[A-Z]+$/.test(guess)) {
             showMessage('Hanya huruf yang diperbolehkan!', 'error');
             shakeInput();
             return;
        }
        // TODO: Add dictionary check if available

        // --- Proses Tebakan ---
        submitButton.disabled = true; // Disable button during processing/animation
        displayGuess(guess); // Show letters immediately (before reveal)
        checkGuess(guess); // Start the reveal and coloring process

        // Re-enable button after animations (adjust timing if needed)
        // setTimeout(() => {
        //     if (!isGameOver) submitButton.disabled = false;
        // }, wordLength * 150 + 600); // Wait for letter reveal + animation time
    }


    // Menampilkan Tebakan di Grid (Just the letters initially)
    function displayGuess(guess) {
        const row = gameBoard.children[currentRowIndex];
        if (!row) return; // Safety check
        const boxes = row.children;
        for (let i = 0; i < guess.length; i++) {
             if (boxes[i]) {
                 boxes[i].textContent = guess[i];
             }
        }
    }

    // Memeriksa Tebakan, Menerapkan Reveal dan Warna
    function checkGuess(guess) {
        const row = gameBoard.children[currentRowIndex];
        if (!row) return; // Safety check
        const boxes = row.children;
        const guessLetters = guess.split('');
        const targetLetters = targetWord.split('');

        // --- Status Calculation (Same logic as before) ---
        const letterStatus = Array(wordLength).fill(null);
        const targetLetterCounts = {};
        targetLetters.forEach(letter => {
            targetLetterCounts[letter] = (targetLetterCounts[letter] || 0) + 1;
        });

        // 1. Check Correct (Green)
        for (let i = 0; i < wordLength; i++) {
            if (guessLetters[i] === targetLetters[i]) {
                letterStatus[i] = 'correct';
                targetLetterCounts[guessLetters[i]]--;
            }
        }

        // 2. Check Present (Yellow) & Absent (Red/Grey)
        for (let i = 0; i < wordLength; i++) {
            if (letterStatus[i] === null) { // Only check if not already 'correct'
                if (targetLetters.includes(guessLetters[i]) && targetLetterCounts[guessLetters[i]] > 0) {
                    letterStatus[i] = 'present';
                    targetLetterCounts[guessLetters[i]]--;
                } else {
                    letterStatus[i] = 'absent';
                }
            }
        }

        // --- Apply Reveal and Status Classes with Delay ---
        let animationPromises = []; // Track animations

        for (let i = 0; i < boxes.length; i++) {
            const box = boxes[i];
            if (!box) continue; // Safety

            const promise = new Promise(resolve => {
                setTimeout(() => {
                    box.classList.add('reveal'); // Trigger reveal animation
                    box.classList.add(letterStatus[i]); // Add status class (used by CSS variable in reveal)

                    // Listen for animation end to resolve the promise
                    box.addEventListener('animationend', function handler(e) {
                         // Make sure it's the reveal animation ending
                         if (e.animationName === 'reveal') {
                            box.removeEventListener('animationend', handler); // Clean up listener
                            resolve(); // Signal this box's animation is done
                         }
                    }, { once: true }); // Use once for automatic cleanup alternative
                }, i * 150); // Stagger the start of reveal animation
            });
            animationPromises.push(promise);
        }

        // --- After all animations complete ---
        Promise.all(animationPromises).then(() => {
            currentRowIndex++; // Move to next row *after* animations

             // Check win/lose condition
             if (guess === targetWord) {
                endGame(true);
            } else if (currentRowIndex >= maxGuesses) {
                endGame(false);
            } else {
                // Game continues: Re-enable input and button
                if (!isGameOver) {
                     guessInput.value = ''; // Clear input for next guess
                     submitButton.disabled = false;
                     guessInput.focus();
                }
            }
        });
    }


    // Mengakhiri Permainan
    function endGame(isWin) {
        isGameOver = true;
        guessInput.disabled = true;
        submitButton.disabled = true; // Ensure it remains disabled

        if (isWin) {
            showMessage(`Selamat! Kamu berhasil menebak: ${targetWord}`, 'win');
            animateWinRow(); // Trigger win animation
        } else {
            showMessage(`Yah, kesempatan habis! Jawabannya: ${targetWord}`, 'lose');
        }

        tryAgainButton.style.display = 'block'; // Tampilkan tombol Coba Lagi
    }

    // Menampilkan Pesan Status
    function showMessage(msg, type = 'info') {
        messageArea.textContent = msg;
        // Clear previous types before adding the new one
        messageArea.classList.remove('win', 'lose', 'error', 'info');
        if (type) {
            messageArea.classList.add(type);
        }
    }

    // Animasi Goyang untuk Input Salah
    function shakeInput() {
        guessInput.classList.add('shake-error');
        guessInput.addEventListener('animationend', () => {
            guessInput.classList.remove('shake-error');
        }, { once: true }); // Remove class after animation ends
    }

    // Animasi baris kemenangan (Refactored to use CSS classes)
    function animateWinRow() {
         // The winning row is the one just completed
         const winRowIndex = currentRowIndex - 1;
         if (winRowIndex < 0) return; // Should not happen, but safety first

         const winRow = gameBoard.children[winRowIndex];
         if (winRow) {
              const boxes = winRow.children;
              for(let i = 0; i < boxes.length; i++) {
                  if (boxes[i]) {
                    // Set custom property for staggered delay
                    boxes[i].style.setProperty('--bounce-delay', `${i * 80}ms`);
                    boxes[i].classList.add('win-bounce');
                    // Clean up class after animation (optional, but good practice)
                    boxes[i].addEventListener('animationend', function handler(e) {
                         if (e.animationName === 'win-bounce') {
                             boxes[i].classList.remove('win-bounce');
                             boxes[i].style.removeProperty('--bounce-delay');
                             boxes[i].removeEventListener('animationend', handler);
                         }
                    }, { once: true });
                  }
              }
         }
    }


    // --- Event Listeners ---

    // Loading -> Start Screen Transition
    window.addEventListener('load', () => {
         // Simulate loading time or wait for assets
         setTimeout(() => {
             hideLoadingScreen();
             showStartScreen();
             loadMusicPreference(); // Load setting after UI is ready
         }, 5000); // Adjust delay (5 seconds) to match loader animation
    });

    // Start Button
    startButton.addEventListener('click', () => {
        hideStartScreen();
        initGame();
        // Try to play music if it was enabled
        if (musicToggle.checked) {
            playMusic();
        }
    });

    // Settings Button
    settingsButton.addEventListener('click', showSettingsModal);
    closeModalButton.addEventListener('click', hideSettingsModal);
    // Close modal if clicking outside the content
    settingsModal.addEventListener('click', (event) => {
        if (event.target === settingsModal) {
            hideSettingsModal();
        }
    });

    // Music Toggle
    musicToggle.addEventListener('change', toggleMusic);

    // Game Actions
    guessForm.addEventListener('submit', handleGuessSubmit);
    tryAgainButton.addEventListener('click', () => {
        initGame(); // Re-initialize the game
        if (musicToggle.checked && !isMusicPlaying) {
             // If music should be on but isn't (e.g., after page reload)
             playMusic();
        }
    });

    // Initial Setup - Don't call initGame here, wait for Start button
    showLoadingScreen(); // Show loader immediately

});
