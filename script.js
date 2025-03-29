document.addEventListener('DOMContentLoaded', () => {
    // --- Variabel Global ---
    const wordList = ["CAHAYA", "TAUHID", "MANDI", "ROBLOX", "JALAN", "SIGMA", "PUASA", "LAPAR", "DASI" ,"BERENANG" ,"MUNGKIN"];
    let targetWord = '';
    let currentGuess = '';
    let currentRowIndex = 0;
    const maxGuesses = 7;
    let isGameOver = false;

    // --- Referensi Elemen DOM ---
    const gameBoard = document.getElementById('game-board');
    const guessInput = document.getElementById('guess-input');
    const guessForm = document.getElementById('guess-form');
    const messageArea = document.getElementById('message-area');
    const tryAgainButton = document.getElementById('try-again-button');
    const submitButton = document.getElementById('submit-button');

    // --- Fungsi Utama ---

    // Inisialisasi Permainan Baru
    function initGame() {
        // 1. Reset Variabel
        targetWord = getRandomWord(wordList);
        currentGuess = '';
        currentRowIndex = 0;
        isGameOver = false;
        console.log("Jawaban (untuk testing):", targetWord); // Hapus atau jadikan komentar saat deploy

        // 2. Reset Tampilan
        gameBoard.innerHTML = ''; // Kosongkan papan
        messageArea.textContent = ''; // Kosongkan pesan
        messageArea.className = ''; // Reset kelas warna pesan
        guessInput.value = ''; // Kosongkan input
        guessInput.maxLength = targetWord.length; // Sesuaikan max length
        guessInput.disabled = false; // Aktifkan input
        submitButton.disabled = false; // Aktifkan tombol submit
        tryAgainButton.style.display = 'none'; // Sembunyikan tombol coba lagi

        // 3. Buat Grid Tebakan
        createGuessGrid(targetWord.length);

        // 4. Fokus ke input
        guessInput.focus();
    }

    // Memilih Kata Acak
    function getRandomWord(list) {
        const randomIndex = Math.floor(Math.random() * list.length);
        return list[randomIndex].toUpperCase(); // Pastikan uppercase
    }

    // Membuat Grid Kotak Tebakan
    function createGuessGrid(wordLength) {
        for (let i = 0; i < maxGuesses; i++) {
            const row = document.createElement('div');
            row.classList.add('guess-row');
            // Set jumlah kolom sesuai panjang kata
            row.style.gridTemplateColumns = `repeat(${wordLength}, 1fr)`;

            for (let j = 0; j < wordLength; j++) {
                const box = document.createElement('div');
                box.classList.add('letter-box');
                box.setAttribute('data-row', i);
                box.setAttribute('data-col', j);
                row.appendChild(box);
            }
            gameBoard.appendChild(row);
        }
    }

    // Menangani Pengiriman Tebakan
    function handleGuessSubmit(event) {
        event.preventDefault(); // Mencegah refresh halaman form
        if (isGameOver) return; // Jangan proses jika game sudah selesai

        const guess = guessInput.value.toUpperCase().trim();

        // --- Validasi Input ---
        if (guess.length !== targetWord.length) {
            showMessage(`Tebakan harus ${targetWord.length} huruf!`, 'error');
            shakeInput();
            return;
        }
        if (!/^[A-Z]+$/.test(guess)) {
             showMessage('Hanya huruf yang diperbolehkan!', 'error');
             shakeInput();
             return;
        }
        // Bisa ditambahkan validasi cek kamus jika punya daftar kata lengkap

        // --- Proses Tebakan ---
        displayGuess(guess);
        checkGuess(guess);

        // --- Pindah ke Baris Berikutnya atau Akhiri Game ---
        currentRowIndex++;
        guessInput.value = ''; // Kosongkan input setelah tebak

        if (guess === targetWord) {
            endGame(true);
        } else if (currentRowIndex >= maxGuesses) {
            endGame(false);
        } else {
            guessInput.focus(); // Fokus kembali ke input
        }
    }

    // Menampilkan Tebakan di Grid
    function displayGuess(guess) {
        const row = gameBoard.children[currentRowIndex];
        const boxes = row.children;
        for (let i = 0; i < guess.length; i++) {
            boxes[i].textContent = guess[i];
        }
    }

    // Memeriksa Tebakan dan Memberi Warna
    function checkGuess(guess) {
        const row = gameBoard.children[currentRowIndex];
        const boxes = row.children;
        const guessLetters = guess.split('');
        const targetLetters = targetWord.split('');
        const letterStatus = Array(targetWord.length).fill(null); // correct, present, absent

        // Salinan untuk melacak huruf yang sudah 'dipakai' untuk status kuning
        const targetLetterCounts = {};
        targetLetters.forEach(letter => {
            targetLetterCounts[letter] = (targetLetterCounts[letter] || 0) + 1;
        });


        // Langkah 1: Cek Hijau (Benar Posisi & Huruf)
        for (let i = 0; i < targetWord.length; i++) {
            if (guessLetters[i] === targetLetters[i]) {
                letterStatus[i] = 'correct';
                targetLetterCounts[guessLetters[i]]--; // Kurangi hitungan huruf yg sudah pas
            }
        }

        // Langkah 2: Cek Kuning (Huruf Benar, Posisi Salah) & Merah (Salah)
        for (let i = 0; i < targetWord.length; i++) {
             // Hanya cek jika belum ditandai hijau
            if (letterStatus[i] !== 'correct') {
                // Cek apakah huruf ada di kata target DAN masih ada sisa (belum dipakai hijau/kuning lain)
                if (targetLetters.includes(guessLetters[i]) && targetLetterCounts[guessLetters[i]] > 0) {
                    letterStatus[i] = 'present';
                    targetLetterCounts[guessLetters[i]]--; // Kurangi hitungan huruf yg dipakai kuning
                } else {
                    letterStatus[i] = 'absent';
                }
            }
        }

        // Terapkan warna dan animasi dengan sedikit delay antar huruf
        for (let i = 0; i < boxes.length; i++) {
            setTimeout(() => {
                boxes[i].classList.add(letterStatus[i]);
                // Tambahkan class reveal untuk animasi flip (opsional)
                // boxes[i].classList.add('reveal');
                // Hapus class reveal setelah animasi selesai agar bisa diulang
                // setTimeout(() => boxes[i].classList.remove('reveal'), 600);
            }, i * 150); // Delay 150ms per huruf
        }
    }


    // Mengakhiri Permainan
    function endGame(isWin) {
        isGameOver = true;
        guessInput.disabled = true; // Matikan input
        submitButton.disabled = true; // Matikan tombol submit

        if (isWin) {
            showMessage(`Selamat! Kamu berhasil menebak: ${targetWord}`, 'win');
            // Tambahkan animasi kemenangan jika diinginkan
            animateWinRow();
        } else {
            showMessage(`Yah, kesempatan habis! Jawabannya: ${targetWord}`, 'lose');
        }

        tryAgainButton.style.display = 'block'; // Tampilkan tombol Coba Lagi
    }

    // Menampilkan Pesan Status
    function showMessage(msg, type = 'info') {
        messageArea.textContent = msg;
        messageArea.className = type; // 'win', 'lose', 'error', atau default ('info')
    }

    // Animasi Goyang untuk Input Salah
    function shakeInput() {
        guessInput.classList.add('shake-error');
        setTimeout(() => {
            guessInput.classList.remove('shake-error');
        }, 500); // Durasi animasi shake
    }
     // CSS untuk animasi shake (tambahkan di style.css jika belum ada)
    /*
    @keyframes shake {
      10%, 90% { transform: translateX(-1px); }
      20%, 80% { transform: translateX(2px); }
      30%, 50%, 70% { transform: translateX(-4px); }
      40%, 60% { transform: translateX(4px); }
    }
    .shake-error {
        animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        border-color: #d9534f !important; // Highlight border merah saat error
    }
    */

    // Animasi baris kemenangan (opsional)
    function animateWinRow() {
         const winRow = gameBoard.children[currentRowIndex-1]; // Baris terakhir yg ditebak
         if (winRow) {
              const boxes = winRow.children;
              for(let i = 0; i < boxes.length; i++) {
                   setTimeout(() => {
                        boxes[i].style.transform = 'scale(1.1) translateY(-5px)';
                        setTimeout(() => boxes[i].style.transform = '', 200); // Kembali normal
                   }, i * 80); // Sedikit delay antar huruf
              }
         }
    }


    // --- Event Listeners ---
    guessForm.addEventListener('submit', handleGuessSubmit);
    tryAgainButton.addEventListener('click', initGame);

    // --- Mulai Permainan Saat Halaman Dimuat ---
    initGame();
});
