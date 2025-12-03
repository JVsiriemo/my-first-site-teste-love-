document.addEventListener('DOMContentLoaded', () => {
    const alertDiv = document.getElementById('orientation-alert');
    let autoHideTimer; 
    
    // Função para verificar se a altura é maior que a largura (Modo Portrait).
    function isPortraitMode() {
        return window.innerHeight > window.innerWidth;
    }

    function checkAndShowAlert() {
        // Cancela qualquer timer ativo para evitar múltiplos sumiços
        clearTimeout(autoHideTimer); 
        
        if (isPortraitMode()) {
            // Se estiver em modo portrait:
            
            // 1. FORÇA O DISPLAY
            alertDiv.style.display = 'flex'; 

            // 2. Transição da opacidade para aparecer suavemente
            setTimeout(() => {
                alertDiv.style.opacity = '1';
            }, 10); 
            
            
            // 3. 🚨 NOVO TIMER DE 4 SEGUNDOS PARA FORÇAR O SUMIÇO
            autoHideTimer = setTimeout(() => {
                // Faz o alerta sumir suavemente
                alertDiv.style.opacity = '0'; 
                
                // Esconde completamente após a transição de 0.5s
                setTimeout(() => {
                    alertDiv.style.display = 'none';
                }, 500); 
                
            }, 5000); // 🚨 MUDANÇA: 4 segundos
            
        } else {
            // Se a tela estiver mais larga que alta (Landscape):
            alertDiv.style.display = 'none';
            alertDiv.style.opacity = '0';
        }
    }

    // --- EXECUÇÃO ---
    checkAndShowAlert();
    window.addEventListener('resize', checkAndShowAlert);
    window.addEventListener('orientationchange', checkAndShowAlert);
});
document.addEventListener('DOMContentLoaded', () => {
/* ========================================================= */
    /* PARTE 1: LOVE METER E EXPLOSÃO (CORRIGIDO E UNIFICADO)    */
    /* ========================================================= */
    const leftHeart = document.getElementById('leftHeart'); 
    const rightHeart = document.getElementById('rightHeart'); 
    const progressBarFill = document.querySelector('.progress-bar-fill'); 
    const lovePercentageSpan = document.getElementById('lovePercentage'); 
    
    let currentLove = 0;
    const maxLove = 100;
    const stepAmount = 10; 

    function updateLoveDisplay() {
        if(progressBarFill) progressBarFill.style.width = `${currentLove}%`; 
        if(lovePercentageSpan) lovePercentageSpan.textContent = currentLove; 
    }

// --- FUNÇÃO DE EXPLOSÃO (CORREÇÃO DE COORDENADAS) ---
function triggerExplosion(startX, startY) {
    let overlay = document.getElementById('celebration-overlay');
    
    // Garante overlay
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'celebration-overlay';
        document.body.appendChild(overlay);
    }
    
    overlay.style.display = 'block';
    overlay.style.zIndex = '99999'; // Força z-index alto

    let burstCount = window.innerWidth < 480 ? 80 : 150; // Quantidade de corações
    const colors = ['#ff3b8d', '#ffffff', '#e95592', '#c442a3', '#bb1669']; 

    for (let i = 0; i < burstCount; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart-confetti');
        
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        heart.style.backgroundColor = randomColor;
        if (randomColor === '#ffffff') heart.classList.add('white-heart');
        
    const overlayRect = overlay.getBoundingClientRect();

       heart.style.left = (startX - overlayRect.left) + 'px';
       heart.style.top = (startY - overlayRect.top) + 'px';
        
        // Define direção aleatória
        const angle = Math.random() * Math.PI * 2;
        const velocity = 150 + Math.random() * 400; // Distância da explosão
        
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        // Define variáveis CSS
        heart.style.setProperty('--tx', `${tx}px`);
        heart.style.setProperty('--ty', `${ty}px`);
        
        // Atraso aleatório para parecer mais natural
        heart.style.animationDelay = `${Math.random() * 0.2}s`;
        
        overlay.appendChild(heart);
    }

    // Limpa overlay após 2.5s
    setTimeout(() => {
    overlay.innerHTML = '';
        overlay.style.display = 'none';
    }, 2500);
}

    // --- ATUALIZAÇÃO DA FUNÇÃO DO CORAÇÃO GIGANTE ---
    function spawnFinalHeart() {
    if (document.getElementById('final-heart')) return;
    
    const bigHeart = document.createElement('div');
    bigHeart.id = 'final-heart';
    bigHeart.style.fontSize = '120px';
    bigHeart.style.width = '150px';
    bigHeart.style.height = '150px';
    bigHeart.style.display = 'flex';
    bigHeart.style.alignItems = 'center';
    bigHeart.style.justifyContent = 'center';
    bigHeart.innerHTML = '💘'; 
    document.body.appendChild(bigHeart);

    setTimeout(() => bigHeart.classList.add('show-big-heart'), 100);

    const explode = (e) => {
        // Previne comportamentos padrão que podem interferir no clique/toque
        if (e.cancelable) e.preventDefault(); 
        
        const rect = bigHeart.getBoundingClientRect();
        const centerX = rect.left + (rect.width / 2);
        const centerY = rect.top + (rect.height / 2);
        
        triggerExplosion(centerX, centerY);
        bigHeart.remove();
    };

    // Adiciona listeners para clique e toque
    bigHeart.addEventListener('click', explode);
    bigHeart.addEventListener('touchstart', explode, { passive: false });
}

    function incrementLove() {
        if (currentLove >= maxLove) return;
        currentLove += stepAmount;
        if (currentLove > maxLove) currentLove = maxLove; 
        updateLoveDisplay();
        if (currentLove === maxLove) { spawnFinalHeart(); }
    }
    
    function decrementLove() {
        if (currentLove <= 0) return;
        currentLove -= stepAmount;
        if (currentLove < 0) currentLove = 0; 
        updateLoveDisplay();
    }

    if(rightHeart) {
        rightHeart.addEventListener('pointerdown', incrementLove);
    }
    if(leftHeart) {
        leftHeart.addEventListener('pointerdown', decrementLove);
    }
    updateLoveDisplay();


    /* ========================================================= */
    /* PARTE 2: LÓGICA DO QUIZ                                   */
    /* ========================================================= */
const quizData = [
    { 
        question: "Onde foi nosso primeiro encontro de verdade?", 
        options: ["No shopping", "No restaurante", "No parque", "No cinema"], 
        answer: 1, 
        correctMessage: "Boa! Aquele dia na Rota V8 tava muito bom. 😜", 
        wrongMessage: "Errou, to até com medo do qual você clicou ao invés de restaurante. 😐"
    },
    { 
        question: "Qual foi a primeira coisa que eu te dei?", 
        options: ["Uma flor", "Chocolate", "Uma cartinha", "A aliança"], 
        answer: 1, 
        correctMessage: "Aí sim, lembrou do meu querido Ferreiro Rocher. 🍫", 
        wrongMessage: "Esqueceu do chocolate? Só comprando outro pra resolver isso aí. 🚨"
    },
    { 
        question: "Qual é o filme que mais gostamos de assistir juntos?", 
        options: ["Esposa de Mentirinha", "Como se fosse a primeira vez", "O Halloween de Hubie", "Misterio no Mediterrâneo"], 
        answer: 0, 
        correctMessage: "Acertouu, eu amei esse filme amor. 🎥", 
        wrongMessage: "Você errouu, to até em dúvida no qual você escolheu. 😅"
    },
    { 
        question: "Qual é a data oficial do nosso namoro?", 
        options: ["25/12", "29/02", "04/12", "01/01"], 
        answer: 2, 
        correctMessage: "Parabénsss, você lembrou do NOSSO dia. 👏", 
        wrongMessage: "Ai não dá né, as opções que eu coloquei também e você errouuu. 😭"
    },
    { 
        question: "Quem é mais ciumento da relação?", 
        options: ["Eu", "Você", "Os dois iguais", "Ninguém"], 
        answer: 1, 
        correctMessage: "Exatamente. Ser sincera é uma coisa bem dificil KKKKKKKK. 👀", 
        wrongMessage: "Relaxa amorrr, como eu dizia \"A verdade doi mais que a mentira.\" 😂"
    },
    { 
        question: "Qual a demonstração de amor que a gente mais gosta?", 
        options: ["Atos de serviço", "Tempo de qualidade", "Toque físico", "Presentes"], 
        answer: 2, 
        correctMessage: "Aêêê, óbvio que é toque físico, amo você minha carrapatinha. 🤗", 
        wrongMessage: "Errou, nós adoramos ficar grudados igual chiclete. 😭"
    },
    { 
        question: "O que eu mais amo em você?", 
        options: ["Seu sorriso", "Seu abraço", "Seu cheiro", "Tudo!"], 
        answer: 3, 
        correctMessage: "É claro que era tudo. Fica difícil escolher só uma coisa em você. 😘", 
        wrongMessage: "Era tudo! Como assim escolher só uma coisa em VOCÊ?🥲"
    }
];


    let currentQuestionIndex = 0;
    let score = 0;
    const questionEl = document.getElementById('quiz-question');
    const optionsEl = document.getElementById('quiz-options');
    const feedbackEl = document.getElementById('quiz-feedback');
    const nextBtn = document.getElementById('next-question-btn');
    const qNumberEl = document.getElementById('question-number');
    const scoreValEl = document.getElementById('score-val');
    const quizCard = document.querySelector('.quiz-card');
    const resultCard = document.getElementById('quiz-result');
    const finalScoreEl = document.getElementById('final-score');
    const totalQuestionsEl = document.getElementById('total-questions');
    const restartBtn = document.getElementById('restart-btn');
    const finalMessageEl = document.getElementById('final-message');

    function loadQuestion() {
        if(!questionEl) return;
        nextBtn.style.display = 'none';
        nextBtn.innerText = "Próxima Pergunta ➡️";
        feedbackEl.innerText = '';
        while (optionsEl.firstChild) optionsEl.removeChild(optionsEl.firstChild);
        
        const current = quizData[currentQuestionIndex];
        questionEl.innerText = current.question;
        qNumberEl.innerText = `Pergunta ${currentQuestionIndex + 1} de ${quizData.length}`;

        current.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.innerText = option;
            button.classList.add('quiz-btn');
            button.dataset.index = index; 
            button.addEventListener('click', selectAnswer);
            optionsEl.appendChild(button);
        });
    }

    function selectAnswer(e) {
        const selectedBtn = e.target;
        const correctIndex = quizData[currentQuestionIndex].answer;
        Array.from(optionsEl.children).forEach(btn => {
            btn.disabled = true;
            if (parseInt(btn.dataset.index) === correctIndex) btn.classList.add('correct');
        });
        if (parseInt(selectedBtn.dataset.index) === correctIndex) {
            score++; scoreValEl.innerText = score;
            feedbackEl.innerText = quizData[currentQuestionIndex].correctMessage;
            feedbackEl.style.color = "#28a745";
        } else {
            selectedBtn.classList.add('wrong');
            feedbackEl.innerText = quizData[currentQuestionIndex].wrongMessage;
            feedbackEl.style.color = "#dc3545";
        }
        nextBtn.style.display = 'block';
    }

    if (nextBtn) nextBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) loadQuestion();
        else {
            quizCard.style.display = 'none';
            resultCard.style.display = 'block';
            finalScoreEl.innerText = score;
            totalQuestionsEl.innerText = quizData.length;
            if (score === quizData.length) finalMessageEl.innerText = "ACERTOU TUDO EMMM! Eu sabia que vc ia conseguir! 😝";
            else if (score > quizData.length / 2) finalMessageEl.innerText = "Foi bem, mas podia melhorar... 🥲";
            else finalMessageEl.innerText = "Poxa, esqueceu muita coisa... 😭";
        }
    });

    if (restartBtn) restartBtn.addEventListener('click', () => {
        currentQuestionIndex = 0; score = 0; scoreValEl.innerText = score;
        resultCard.style.display = 'none'; quizCard.style.display = 'block';
        loadQuestion();
    });

    if (questionEl) loadQuestion();


    /* ========================================================= */
    /* PARTE 3: QUEBRA-CABEÇA (SEÇÃO 8)                          */
    /* ========================================================= */
    const puzzlePieces = document.querySelectorAll('.puzzle-piece');
    const gameArea = document.getElementById('game-area');
    const finalPromiseBox = document.getElementById('finalPromiseBox');

    if(puzzlePieces.length > 0) {
        const totalPieces = puzzlePieces.length;
        let piecesClicked = 0;
        const feedbackMessage = document.createElement('div');
        feedbackMessage.id = 'feedback-message';
        document.body.appendChild(feedbackMessage);

        puzzlePieces.forEach(piece => {
            piece.addEventListener('click', function() {
                if (this.classList.contains('clicked')) return; 
                const message = this.getAttribute('data-message');
                this.classList.add('clicked');
                piecesClicked++;
                
                feedbackMessage.innerText = message;
                feedbackMessage.classList.add('show-message'); 
                
                setTimeout(() => feedbackMessage.classList.remove('show-message'), 4000); 

                if (piecesClicked === totalPieces) {
                    setTimeout(() => {
                        gameArea.style.display = 'none';
                        finalPromiseBox.style.display = 'block';
                        setTimeout(() => finalPromiseBox.classList.add('visible'), 50);
                    }, 3600); 
                }
            });
        });
    }

    // Scroll Observer
    const animatedItems = document.querySelectorAll('.timeline-item, .reveal-on-scroll'); 
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
    }, { threshold: 0.1 }); 
    animatedItems.forEach(item => observer.observe(item));

});

/* ========================================================= */
    /* PARTE 4: MÚSICA AUTOMÁTICA AO INTERAGIR                   */
    /* ========================================================= */
    const audioPlayer = document.getElementById('bgMusic');
    
    // Tenta tocar assim que carrega (vai falhar na maioria dos celulares, mas funciona em alguns PCs)
    if(audioPlayer) {
        audioPlayer.volume = 0.5; // Começa com volume 50%
        const playPromise = audioPlayer.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay bloqueado pelo navegador. Aguardando clique.");
                // Se falhar, adiciona um evento de clique em qualquer lugar da tela para iniciar
                document.body.addEventListener('click', () => {
                    audioPlayer.play();
                }, { once: true }); // {once: true} garante que só execute na primeira vez
            });
        }
    }

