document.addEventListener('DOMContentLoaded', () => {
    // --- Variabel Global ---
    // Expanded and more varied word list
    const wordList = [
        // Original + User Additions + More Variety
        "CAHAYA", "TAUHID", "MANDI", "ROBLOX", "JALAN", "SIGMA", "PUASA", "LAPAR",
        "DASI", "BERENANG", "MUNGKIN", "KATAK", "LUCU", "IMUT", "KEREN", "MANIS",
        "PINK", "UNGGU", "GEMAS", // Original + Added
        // Kosakata Sedang (Menengah) - Provided by User
        "BERPIKIR", "BERBICARA", "MENDENGAR", "MENULIS", "MEMBACA", "BELAJAR",
        "MENGAJAR", "BEKERJA", "BERMAIN", "MENARI", "MENYANYI", "TERTAWA",
        "MENANGIS", "SENANG", "SEDIH", "LAPAR", "HAUS", "LELAH", "CEPAT", "LAMBAT",
        "TERANG", "GELAP", "MAHAL", "MURAH", "BARU", "LAMA", "KAYA", "MISKIN",
        "KOTA", "DESA", "HUTAN", "GUNUNG", "SUNGAI", "LAUT", "ANGIN", "HUJAN",
        "MATAHARI", "BULAN", "BINTANG", "WAKTU",
        // Additional Indonesian Words (Various Lengths & Categories)
        "RUMAH", "SEKOLAH", "PASAR", "BUKU", "PENA", "MEJA", "KURSI", "PINTU",
        "JENDELA", "MOBIL", "MOTOR", "SEPEDA", "PESAWAT", "KAPAL", "KERETA",
        "MAKAN", "MINUM", "TIDUR", "DUDUK", "BERDIRI", "LIHAT", "AMBIL", "KASIH",
        "PERGI", "DATANG", "NAIK", "TURUN", "MASUK", "KELUAR", "BUKA", "TUTUP",
        "ANJING", "KUCING", "BURUNG", "IKAN", "AYAM", "SAPI", "KAMBING", "ULAR",
        "SEMUT", "NYAMUK", "LALAT", "KUPUKUPU", "GAJAH", "HARIMAU", "SINGA",
        "MERAH", "BIRU", "HIJAU", "KUNING", "HITAM", "PUTIH", "COKLAT", "ABUABU",
        "BESAR", "KECIL", "PANJANG", "PENDEK", "TINGGI", "RENDAH", "BERAT", "RINGAN",
        "PANAS", "DINGIN", "BASAH", "KERING", "BERSIH", "KOTOR", "RAMAI", "SEPI",
        "BAGUS", "JELEK", "BAIK", "BURUK", "BENAR", "SALAH", "MUDA", "TUA",
        "CANTIK", "GANTENG", "PINTAR", "BODOH", "RAJIN", "MALAS", "BERANI", "TAKUT",
        "BAHAGIA", "KECEWA", "MARAH", "SABAR", "PEDAS", "ASIN", "ASAM", "PAHIT",
        "INDONESIA", "JAKARTA", "BANDUNG", "SURABAYA", "YOGYAKARTA", "BALI",
        "PAGI", "SIANG", "SORE", "MALAM", "HARI", "MINGGU", "TAHUN", "DETIK", "MENIT",
        "JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS",
        "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER", "SENIN", "SELASA", "RABU",
        "KAMIS", "JUMAT", "SABTU", "AIR", "API", "TANAH", "UDARA", "BATU", "PASIR",
        "POHON", "DAUN", "BUNGA", "BUAH", "SAYUR", "NASI", "ROTI", "SUSU", "KOPI", "TEH",
        "GULA", "GARAM", "UANG", "DOMPET", "TAS", "SEPATU", "BAJU", "CELANA", "TOPI",
        "KACAMATA", "JAM", "TELEPON", "KOMPUTER", "INTERNET", "MUSIK", "FILM", "LIBURAN",
        "KELUARGA", "TEMAN", "SAUDARA", "GURU", "DOKTER", "POLISI", "TENTARA", "PETANI",
        "NELAYAN", "PEDAGANG", "PRESIDEN", "MENTERI", "GUBERNUR", "BUPATI", "CAMAT", "LURAH"
    ].map(word => word.toUpperCase()); // Ensure all words are uppercase

    let targetWord = '';
    let currentRowIndex = 0;
    const maxGuesses = 7; // You can adjust this if needed
    let isGameOver = false;
    let isMusicPlaying = false;
    let wordLength = 5; // Default, will be updated by targetWord

    // --- DOM References ---
    // (Keep all existing DOM References - they are correct)
    const loadingScreen = document.getElementById('loading-screen');
    const startScreen = document.getElementById('start-screen');
    const gameContainer = document.querySelector('.game-container');
    const bubblesBackground = document.querySelector('.bubbles-background');
    const startButton = document.getElementById('start-button');
    const gameBoard = document.getElementById('game-board');
    const guessInput = document.getElementById('guess-input');
    const guessForm = document.getElementById('guess-form');
    const messageArea = document.getElementById('message-area');
    const tryAgainButton = document.getElementById('try-again-button');
    const submitButton = document.getElementById('submit-button');
    const guessesLeftSpan = document.getElementById('guesses-left');
    const menuToggleButton = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    const musicToggleMenu = document.getElementById('music-toggle-menu');
    const returnToMainMenuButton = document.getElementById('return-to-main-menu');
    const closeMenuButton = sideMenu.querySelector('.close-menu-button');
    const backgroundMusic = document.getElementById('background-music');

    // --- Bubble Creation ---
    // (Keep the createBubbles function as is)
    function createBubbles() {
        bubblesBackground.innerHTML = '';
        const numberOfBubbles = 10;
        for (let i = 0; i < numberOfBubbles; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
             const size = Math.random() * 80 + 20;
             bubble.style.width = `${size}px`;
             bubble.style.height = `${size}px`;
             bubble.style.left = `${Math.random() * 95}%`;
             bubble.style.animationDuration = `${Math.random() * 10 + 10}s`;
             bubble.style.animationDelay = `${Math.random() * 5}s`;
            bubblesBackground.appendChild(bubble);
        }
    }

    // --- Audio Functions ---
    // (Keep the audio functions as they are)
    function playMusic() {
        if (!backgroundMusic) return;
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
             playMusic();
        }
    }

    function loadMusicPreference() {
        const musicEnabled = localStorage.getItem('musicEnabled');
        musicToggleMenu.checked = (musicEnabled === 'true');
        console.log("Music preference loaded:", musicEnabled);
    }

    // --- UI Flow & Navigation ---
    // (Keep the UI flow functions as they are)
    function showScreen(screenToShow) {
        loadingScreen.classList.add('hidden');
        startScreen.classList.add('hidden');
        gameContainer.style.display = 'none';

        if (screenToShow === 'loading') {
            loadingScreen.classList.remove('hidden');
        } else if (screenToShow === 'start') {
            startScreen.classList.remove('hidden');
        } else if (screenToShow === 'game') {
            gameContainer.style.display = 'block';
        }
    }

    function navigateToStartScreen() {
        showScreen('start');
        closeSideMenu();
        // pauseMusic(); // Optional: Pause music on return to main menu
    }

    function navigateToGame() {
        showScreen('game');
        initGame();
        if (musicToggleMenu.checked) {
            playMusic(); // Attempt to play if preference is enabled
        }
    }

    // --- Menu Functions ---
    // (Keep the menu functions as they are)
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
        targetWord = getRandomWord(wordList); // Select a new random word
        wordLength = targetWord.length;        // Update word length based on the selected word
        currentRowIndex = 0;
        isGameOver = false;
        console.log("Jawaban (untuk testing):", targetWord); // For debugging

        // 2. Reset UI Elements
        gameBoard.innerHTML = '';
        messageArea.textContent = '';
        messageArea.className = 'message-area';
        guessInput.value = '';
        guessInput.maxLength = wordLength; // Set input max length dynamically
        guessInput.disabled = false;
        submitButton.disabled = false;
        tryAgainButton.style.display = 'none';
        updateGuessesLeft();

        // 3. Create New Grid (adapts to wordLength)
        createGuessGrid(wordLength);

        // 4. Focus Input
        guessInput.focus();
    }

    /**
     * Selects a random word from the provided list.
     * Uses Math.random(), which is efficient and suitable for this purpose.
     * A larger word list provides better perceived randomness.
     */
    function getRandomWord(list) {
        if (!list || list.length === 0) {
            console.error("Word list is empty!");
            return "ERROR"; // Return a default or handle error appropriately
        }
        const randomIndex = Math.floor(Math.random() * list.length);
        return list[randomIndex]; // Already ensured to be uppercase
    }

    /**
     * Creates the visual grid for guesses based on max attempts and word length.
     */
    function createGuessGrid(length) {
        // Set grid container styles based on dimensions
        gameBoard.style.gridTemplateRows = `repeat(${maxGuesses}, 1fr)`;
        // Optional: Adjust column template if needed, though 1fr usually works well
        // gameBoard.style.gridTemplateColumns = `repeat(${length}, 1fr)`;

        for (let i = 0; i < maxGuesses; i++) {
            const row = document.createElement('div');
            row.classList.add('guess-row');
            // Set columns for *this specific row* based on word length
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
        if (!/^[A-Z]+$/.test(guess)) { // Simple check for letters only
             showMessage('Hanya boleh huruf A-Z', 'error');
             shakeInput();
             return;
        }
        // Optional: Add dictionary check here if needed in the future

        // Process guess
        submitButton.disabled = true; // Prevent double submission while checking
        displayGuess(guess);
        checkGuess(guess); // This function now handles the rest of the turn flow
        // Note: updateGuessesLeft() is called *after* checkGuess finishes its async operations or immediately in endGame
    }

    /**
     * Displays the guessed letters immediately in the current row's boxes.
     */
    function displayGuess(guess) {
        const row = gameBoard.children[currentRowIndex];
        if (!row) return; // Should not happen if logic is correct
        const boxes = row.children;
        for (let i = 0; i < guess.length; i++) {
            if (boxes[i]) boxes[i].textContent = guess[i];
        }
    }

    /**
     * Checks the guess against the target word, applies animations,
     * and determines the next game state (win, lose, continue).
     */
    function checkGuess(guess) {
        const row = gameBoard.children[currentRowIndex];
        if (!row) return;
        const boxes = row.children;
        const guessLetters = guess.split('');
        const targetLetters = targetWord.split('');

        // Standard Wordle Logic: Determine letter status (correct, present, absent)
        const letterStatus = Array(wordLength).fill(null); // Stores 'correct', 'present', or 'absent' for each letter
        const targetLetterCounts = {}; // To handle duplicate letters correctly

        // Count target letters
        targetLetters.forEach(letter => {
            targetLetterCounts[letter] = (targetLetterCounts[letter] || 0) + 1;
        });

        // First pass: Check for CORRECT letters (green)
        for (let i = 0; i < wordLength; i++) {
            if (guessLetters[i] === targetLetters[i]) {
                letterStatus[i] = 'correct';
                targetLetterCounts[guessLetters[i]]--; // Decrement count for this exact match
            }
        }

        // Second pass: Check for PRESENT (yellow) and ABSENT (grey) letters
        for (let i = 0; i < wordLength; i++) {
            // Only check letters not already marked 'correct'
            if (letterStatus[i] === null) {
                // Check if the letter exists elsewhere in the target AND hasn't been fully matched yet
                if (targetLetters.includes(guessLetters[i]) && targetLetterCounts[guessLetters[i]] > 0) {
                    letterStatus[i] = 'present';
                    targetLetterCounts[guessLetters[i]]--; // Decrement count for this 'present' match
                } else {
                    letterStatus[i] = 'absent';
                }
            }
        }

        // Apply Reveal Animation and Status Classes Asynchronously
        let revealPromises = [];
        for (let i = 0; i < boxes.length; i++) {
            const box = boxes[i];
            if (!box) continue;

            const promise = new Promise(resolve => {
                 // Stagger the start of the reveal animation
                 setTimeout(() => {
                    box.classList.add('reveal'); // Trigger CSS flip animation

                    // Listen for the *end* of the animation to apply the final color state
                    box.addEventListener('animationend', function applyStateAfterReveal(event) {
                        // Ensure we're reacting to the intended animation
                        if (event.animationName === 'reveal') {
                             box.removeEventListener('animationend', applyStateAfterReveal); // Important: Clean up listener
                             box.classList.add(`${letterStatus[i]}-state`); // Add final color class (e.g., 'correct-state')
                             resolve(); // Signal that this box's animation and state update is complete
                        }
                    }, { once: true }); // Use 'once' to auto-remove listener after firing
                }, i * 120); // Stagger delay (120ms between each box)
            });
            revealPromises.push(promise);
        }

        // Wait for ALL box animations and state updates in the row to complete
        Promise.all(revealPromises).then(() => {
             // All boxes in the current row have flipped and colored
             currentRowIndex++;
             updateGuessesLeft(); // Update counter *after* row is processed

             // Check Win/Lose Condition
             if (guess === targetWord) {
                endGame(true); // Player won
            } else if (currentRowIndex >= maxGuesses) {
                endGame(false); // Player lost (out of guesses)
            } else {
                // Game continues to the next guess
                if (!isGameOver) { // Ensure game hasn't ended unexpectedly
                     guessInput.value = '';      // Clear input for next guess
                     submitButton.disabled = false; // Re-enable submit button
                     guessInput.focus();        // Focus input for convenience
                }
            }
        });
    }

    /**
     * Handles the end of the game (win or lose).
     */
    function endGame(isWin) {
        isGameOver = true;
        guessInput.disabled = true;
        submitButton.disabled = true;
        // Make sure guesses left shows 0 if max guesses were reached
        updateGuessesLeft();


        if (isWin) {
            showMessage(`Horeee! Benar! Jawabannya: ${targetWord}`, 'win');
            animateWinRow(); // Trigger win animation on the correct row
             // Delay showing 'Try Again' slightly for the win animation
             setTimeout(() => {
                 if (tryAgainButton) tryAgainButton.style.display = 'block';
             }, 1500); // Adjust timing as needed
        } else {
             showMessage(`Yaaah.. Belum berhasil :( Jawabannya: ${targetWord}`, 'lose');
             // Show 'Try Again' immediately on loss
             if (tryAgainButton) tryAgainButton.style.display = 'block';
        }
    }

    // --- UI Feedback Functions ---
    // (Keep showMessage, shakeInput, animateWinRow as they are)
    function showMessage(msg, type = 'info') {
        messageArea.textContent = msg;
        messageArea.className = 'message-area'; // Reset base class
        if (type) messageArea.classList.add(type); // Add type class (info, error, win, lose)
    }

     function shakeInput() {
        if (guessInput.classList.contains('shake-error')) return; // Prevent overlapping shakes
        guessInput.classList.add('shake-error');
        guessInput.addEventListener('animationend', () => {
            guessInput.classList.remove('shake-error');
        }, { once: true });
    }

    function animateWinRow() {
         const winRowIndex = currentRowIndex - 1; // The row where the win occurred
         if (winRowIndex < 0 || winRowIndex >= maxGuesses) return; // Safety check
         const winRow = gameBoard.children[winRowIndex];
         if (winRow) {
              const boxes = winRow.children;
              for(let i = 0; i < boxes.length; i++) {
                  const box = boxes[i];
                  if (box) {
                    // Add staggered delay via CSS custom property
                    box.style.setProperty('--bounce-delay', `${i * 80}ms`);
                    box.classList.add('win-bounce');

                    // Optional: Clean up class and property after animation if needed
                     box.addEventListener('animationend', function winBounceEnd(e) {
                          if (e.animationName === 'win-bounce') {
                               box.classList.remove('win-bounce');
                               box.style.removeProperty('--bounce-delay');
                               box.removeEventListener('animationend', winBounceEnd);
                          }
                     }, { once: true });
                  }
              }
         }
    }

    // --- Event Listeners ---
    // (Keep Event Listeners as they are)
    window.addEventListener('load', () => {
        createBubbles();
        setTimeout(() => {
            showScreen('start');
            loadMusicPreference();
        }, 4500); // Match loading animation duration
    });

    startButton.addEventListener('click', navigateToGame);
    guessForm.addEventListener('submit', handleGuessSubmit);
    tryAgainButton.addEventListener('click', initGame);

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


    // --- Initial Setup ---
    showScreen('loading'); // Start with the loading screen

})
