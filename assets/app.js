// ===== GLOBAL HEARTS =====
let hearts = parseInt(localStorage.getItem('loveHearts')) || 0;

function updateHearts() {
    const hc = document.getElementById('heartsCount');
    if (hc) hc.textContent = hearts;

    const ch = document.getElementById('currentHearts');
    if (ch) ch.textContent = hearts;

    localStorage.setItem('loveHearts', hearts);
}

// ===== FLOATING HEARTS BACKGROUND =====
function createHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '💖';
    heart.style.position = 'fixed';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.top = '100vh';
    heart.style.fontSize = (10 + Math.random() * 20) + 'px';
    heart.style.animation = `float ${3 + Math.random() * 3}s linear forwards`;
    const container = document.getElementById('heartsContainer');
    if (container) {
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 7000);
    }
}
setInterval(createHeart, 300);

// ===== LOVE MAP =====
function showLoveMap() {
    const canvas = document.getElementById('loveMap');
    if (!canvas) return;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#ff69b4';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.shadowColor = '#ff1493';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.moveTo(100, 200);
    ctx.quadraticCurveTo(300, 50, 500, 200);
    ctx.quadraticCurveTo(700, 350, 800, 200);
    ctx.stroke();

    const milestones = [
        {x: 100, y: 200, text: 'We Met 💕'},
        {x: 300, y: 50,  text: 'First Kiss 😘'},
        {x: 500, y: 200, text: 'Forever ❤️'},
        {x: 800, y: 200, text: 'Future Together 💍'}
    ];
    milestones.forEach(m => {
        ctx.fillStyle = '#ff1493';
        ctx.beginPath();
        ctx.arc(m.x, m.y, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 18px "Dancing Script", cursive';
        ctx.textAlign = 'center';
        ctx.fillText(m.text, m.x, m.y + 60);
    });

    canvas.onclick = () => {
        const popup = document.getElementById('shayariPopup');
        if (popup) popup.style.display = 'flex';
    };
}

function closeShayari() {
    const popup = document.getElementById('shayariPopup');
    const canvas = document.getElementById('loveMap');
    if (popup) popup.style.display = 'none';
    if (canvas) canvas.style.display = 'none';
}

// ===== QUIZ =====
let currentQuestion = 0;
let score = 0;

const questions = [
    { q: "My favourite way to call you?", options: ["Meri Jaan 💕", "Baby 😘", "Cutie 🥰", "All of above ❤️"], correct: 3 },
    { q: "What makes my heart freeze?", options: ["Your smile 😍", "First kiss memory 💋", "Thinking of you 💖", "All true ❤️"], correct: 3 },
    { q: "Which birthday with me is this?", options: ["1st 🎂", "2nd 🎉", "3rd 💕", "Forever 🥰"], correct: 1 },
    { q: "My love language for you?", options: ["Hugs 🤗", "Kisses 😘", "Surprises 🎁", "All daily 💕"], correct: 3 },
    { q: "Where I want to take you?", options: ["Movie date 🎬", "Adventure trip 🏞️", "Life together 💍", "Everywhere with you ❤️"], correct: 3 },
    { q: "My favourite moment with you?", options: ["First meeting 💕", "Café date ☕", "All moments 🥰", "Future dreams 🌟"], correct: 2 },
    { q: "What do I call you in Hindi?", options: ["Meri jaan 💝", "Baby doll 🎀", "Both true 😘", "Special name ❤️"], correct: 2 },
    { q: "Your effect on me?", options: ["Heart races 💓", "Mind freezes 🧠", "Both happen 😍", "Magic ✨"], correct: 2 },
    { q: "My dream with you?", options: ["Travel world 🌍", "Build home 🏠", "Forever love 💍", "All dreams ❤️"], correct: 3 },
    { q: "Best gift I gave you?", options: ["This website 🎁", "My heart 💖", "Both priceless 🥰", "Daily love 😘"], correct: 2 },
    { q: "My favourite thing about you?", options: ["Smile 😊", "Eyes ✨", "Everything perfect 💕", "Your love ❤️"], correct: 2 },
    { q: "When do I miss you most?", options: ["Every second ⏳", "Night time 🌙", "Always true 💖", "When apart 😢"], correct: 2 },
    { q: "My promise to you?", options: ["Forever love 💍", "Daily happiness 😊", "Both eternal ❤️", "Life together 🥰"], correct: 2 },
    { q: "Your special power over me?", options: ["One smile wins 😍", "One word melts 💕", "Your existence 🥰", "All magic ✨"], correct: 3 },
    { q: "My ultimate dream date?", options: ["Candlelight dinner 🕯️", "Stargazing 🌌", "With you anywhere ❤️", "All perfect 💕"], correct: 2 },
    { q: "What I love in mornings?", options: ["Your texts 📱", "Good morning baby 😘", "Both daily 💖", "Your voice call 📞"], correct: 2 },
    { q: "My favourite memory place?", options: ["First meeting spot 💕", "Favourite café ☕", "Wherever with you ❤️", "All special 🥰"], correct: 2 },
    { q: "Your name in my phone?", options: ["Meri Jaan 💝", "My Love 😘", "Something cute 🥰", "Heart emoji ❤️"], correct: 0 },
    { q: "My reaction to your laugh?", options: ["Melt instantly 💕", "Smile bigger 😊", "Both true 🥰", "Heart races 💓"], correct: 2 },
    { q: "Will you spend life with me?", options: ["Yes forever 💍", "Absolutely baby 😘", "My jaan only you ❤️", "All answers true 🥰"], correct: 3 }
];

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    const box = document.getElementById('questionBox');
    const active = document.getElementById('quizActive');
    if (box && active) {
        box.style.display = 'none';
        active.style.display = 'block';
        showQuestion();
    }
}

function showQuestion() {
    const q = questions[currentQuestion];
    const qDiv = document.getElementById('question');
    const optionsDiv = document.getElementById('options');
    if (!qDiv || !optionsDiv) return;

    qDiv.innerHTML = `<h2>Q${currentQuestion + 1}/20: ${q.q}</h2>`;
    optionsDiv.innerHTML = '';
    q.options.forEach((option, index) => {
        const btn = document.createElement('div');
        btn.className = 'option';
        btn.innerHTML = option;
        btn.onclick = () => selectAnswer(index);
        optionsDiv.appendChild(btn);
    });

    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) nextBtn.style.display = 'none';

    const progress = document.getElementById('progress');
    if (progress) progress.style.width = ((currentQuestion / questions.length) * 100) + '%';
}

function selectAnswer(selected) {
    const q = questions[currentQuestion];
    const options = document.querySelectorAll('.option');
    options.forEach((opt, i) => {
        if (i === q.correct) opt.classList.add('correct');
        else if (i === selected && i !== q.correct) opt.classList.add('wrong');
    });

    if (selected === q.correct) {
        score++;
        hearts++;
        updateHearts();
        if (typeof launchHearts === 'function') launchHearts(20);
    }

    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) nextBtn.style.display = 'block';
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        const active = document.getElementById('quizActive');
        const done = document.getElementById('quizComplete');
        if (active && done) {
            active.style.display = 'none';
            done.style.display = 'block';
            const fs = document.getElementById('finalScore');
            if (fs) fs.textContent = hearts;
            if (typeof launchHearts === 'function') launchHearts(50);
        }
    }
}

// ===== SHOP WITH NOTHING + LIFE WITH ME =====

// hearts variable + updateHearts already defined above

let originalHearts = null;   // hearts when she first opens shop
let lifeMode = false;        // attachments for life mode
let lifeVisible = false;     // whether Life with me card is shown

const shopItems = [
    { id: 'kiss',   name: '10 Kisses 😘',       cost: 8,  popup: 'kissPopup' },
    { id: 'hug',    name: '5 Warm Hugs 🤗',     cost: 5,  popup: 'hugPopup' },
    { id: 'bang',   name: 'Bang Bang 🔥',       cost: 12, popup: 'bangPopup' },
    { id: 'ride',   name: 'Ride Date 👑',      cost: 15, popup: 'bangPopup' },
    { id: 'movie',  name: 'Movie Night 🎬',     cost: 10, popup: 'bangPopup' },
    { id: 'adv',    name: 'Adventure Date 🏞️', cost: 18, popup: 'bangPopup' },
    // visible "Nothing" item
    { id: 'nothing', name: 'Nothing 🙄',        cost: 0,  popup: null },
    // hidden Life with me item (shown only after clicking Nothing)
    { id: 'life',   name: 'Life with me 💍',    cost: 'ALL', popup: null }
];

function initShop() {
    if (originalHearts === null) {
        originalHearts = hearts;   // save hearts when she first opens shop
    }
    updateHearts();

    const container = document.getElementById('shopItems');
    if (!container) return;
    container.innerHTML = '';

    const subtitle = document.querySelector('.shop-subtitle');
    if (subtitle) {
        subtitle.textContent = lifeMode
            ? 'Buy attachments for life – sab kuch free, sirf tumhare liye 💕'
            : 'Spend your hearts to unlock my love for you 💕';
    }

    shopItems.forEach(item => {
        // hide Life with me until Nothing is clicked
        if (item.id === 'life' && !lifeVisible) return;

        const div = document.createElement('div');
        div.className = 'shop-item';

        let costText;
        if (lifeMode) {
            costText = 'FREE 💖';
        } else if (item.cost === 'ALL') {
            costText = 'ALL HEARTS 💖';
        } else {
            costText = `${item.cost} 💖`;
        }

        div.innerHTML = `
            <h3>${item.name}</h3>
            <div class="shop-cost">${costText}</div>
            <p>${item.id === 'nothing'
                    ? 'Click if you want nothing 😒'
                    : (lifeMode ? 'Free attachment for life' : 'Click to buy')}
            </p>
        `;

        div.onclick = () => buyItem(item);
        container.appendChild(div);
    });
}

function buyItem(item) {
    // If we are in attachments-for-life mode: everything is free
    if (lifeMode && item.id !== 'nothing') {
        showPopup('lifeFreePopup');
        if (typeof launchHearts === 'function') launchHearts(20);
        return;
    }

    // Handle "Nothing" click – reveal Life with me option
    if (item.id === 'nothing') {
        lifeVisible = true;
        showPopup('nothingPopup');
        initShop(); // re-render to show Life with me card
        return;
    }

    // Handle Life with me selection
    if (item.id === 'life') {
        if (hearts === originalHearts && hearts > 0) {
            // She saved all hearts -> success flow
            showPopup('lifeLovePopup');
        } else {
            // She already spent something
            showPopup('retryPopup');
        }
        return;
    }

    // Normal items (kisses, hugs, etc.) before lifeMode
    if (hearts >= item.cost) {
        hearts -= item.cost;
        updateHearts();
        if (item.popup) showPopup(item.popup);
        if (typeof launchHearts === 'function') launchHearts(30);
    } else {
        alert('Need more hearts! Play quiz or memory game 💖');
    }
}

function showPopup(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'flex';
}

function closePopup(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
}

// Called from popup buttons
function proceedLifeMode() {
    // switch to attachments for life: everything free, hearts no longer used
    lifeMode = true;
    lifeVisible = false;  // hide Life with me card, she already chose it
    const lp = document.getElementById('lifeLovePopup');
    if (lp) lp.style.display = 'none';
    initShop();
}

function retryReshop() {
    const rp = document.getElementById('retryPopup');
    if (rp) rp.style.display = 'none';
    // optional: reset hearts to 0 so she can replay games
    // hearts = 0; updateHearts();
    // or just close popup and let her earn more hearts
}

// initialize shop only on shop page (keep your existing DOMContentLoaded hook)


function initShop() {
    updateHearts();
    const container = document.getElementById('shopItems');
    if (!container) return;
    container.innerHTML = '';

    shopItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'shop-item';
        div.innerHTML = `
            <h3>${item.name}</h3>
            <div class="shop-cost">${item.cost} 💖</div>
            <p>Click to buy</p>
        `;
        div.onclick = () => buyItem(item);
        container.appendChild(div);
    });
}

function buyItem(item) {
    if (hearts >= item.cost) {
        hearts -= item.cost;
        updateHearts();
        if (item.popup) showPopup(item.popup);
        if (typeof launchHearts === 'function') launchHearts(30);
    } else {
        alert('Need more hearts! Play quiz or memory game 💖');
    }
}

function showPopup(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'flex';
}

function closePopup(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
}

// ===== MEMORY GAME =====
let flippedCards = [];
let lockBoard = false;
let matchesFound = 0;
let moves = 0;
let time = 0;
let timerInterval;

const memoryPhotos = [
    'assets/images/photo1.jpg', 'assets/images/photo1.jpg',
    'assets/images/photo2.jpg', 'assets/images/photo2.jpg',
    'assets/images/photo3.jpg', 'assets/images/photo3.jpg',
    'assets/images/photo4.jpg', 'assets/images/photo4.jpg',
    'assets/images/photo5.jpg', 'assets/images/photo5.jpg',
    'assets/images/photo6.jpg', 'assets/images/photo6.jpg',
    'assets/images/photo7.jpg', 'assets/images/photo7.jpg',
    'assets/images/photo8.jpg', 'assets/images/photo8.jpg'
];

function initMemoryGame() {
    updateHearts();
    newGame();
}

function newGame() {
    lockBoard = false;
    flippedCards = [];
    matchesFound = 0;
    moves = 0;
    time = 0;
    clearInterval(timerInterval);

    const t  = document.getElementById('timer');
    const mv = document.getElementById('moves');
    const mt = document.getElementById('matches');
    if (t)  t.textContent = '0';
    if (mv) mv.textContent = '0';
    if (mt) mt.textContent = '0/8';

    const grid = document.getElementById('cardsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const shuffled = [...memoryPhotos].sort(() => Math.random() - 0.5);

    shuffled.forEach(photo => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.photo = photo;
        card.innerHTML = '❓';
        card.onclick = () => flipCard(card);
        grid.appendChild(card);
    });

    timerInterval = setInterval(() => {
        time++;
        if (t) t.textContent = String(time);
    }, 1000);
}

function flipCard(card) {
    if (lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    card.innerHTML = `<img src="${card.dataset.photo}" onerror="this.outerHTML='💕'">`;
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        lockBoard = true;
        moves++;
        const mv = document.getElementById('moves');
        if (mv) mv.textContent = String(moves);
        checkMatch();
    }
}

function checkMatch() {
    const [c1, c2] = flippedCards;
    const mt = document.getElementById('matches');
    const eh = document.getElementById('earnedHearts');

    if (c1.dataset.photo === c2.dataset.photo) {
        c1.classList.add('matched');
        c2.classList.add('matched');
        matchesFound++;
        hearts++;
        updateHearts();
        if (mt) mt.textContent = `${matchesFound}/8`;
        if (eh) eh.textContent = String(hearts);
        if (typeof launchHearts === 'function') launchHearts(10);

        if (matchesFound === 8) {
            clearInterval(timerInterval);
            setTimeout(() => {
                alert(`Perfect memory! 🎉 ${time}s, ${moves} moves, ${hearts} hearts total!`);
            }, 400);
        }

        flippedCards = [];
        lockBoard = false;
    } else {
        setTimeout(() => {
            c1.classList.remove('flipped');
            c2.classList.remove('flipped');
            c1.innerHTML = '❓';
            c2.innerHTML = '❓';
            flippedCards = [];
            lockBoard = false;
        }, 900);
    }
}

// ===== PAGE INIT =====
document.addEventListener('DOMContentLoaded', () => {
    updateHearts();

    const path = window.location.pathname;
    if (path.includes('quiz.html')) {
        // quiz page – nothing extra, buttons call startQuiz()
    } else if (path.includes('shop.html')) {
        initShop();
    } else if (path.includes('memory-game.html')) {
        initMemoryGame();
    }
});

