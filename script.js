// ─────────────── STATE ───────────────
let state = null;

try {
    const saved = localStorage.getItem('quiz_state');
    if (saved) {
        state = JSON.parse(saved);
    }
} catch (e) {
    console.warn("Erreur lecture localStorage :", e);
}

// Nouvel état si pas valide
if (!state || typeof state.currentIndex !== 'number') {
    state = {
        currentIndex: 0,
        score: 0,
        selected: null
    };
} else {
    // Retour depuis feedback → question suivante
    state.currentIndex++;
    state.selected = null;
}

// Nettoyage storage
localStorage.removeItem('quiz_state');

// ─────────────── QUESTIONS ───────────────
const questions = [
    {
        id: 1,
        q: "Le Stanozolol appartient à quelle catégorie de produit ?",
        choices: ["Un stéroïde anabolisant", "Un antidouleur", "Un supplément vitaminé"],
        correctIndex: 0,
        explain: "Le Stanozolol est un stéroïde anabolisant synthétique."
    },
    {
        id: 2,
        q: "Pourquoi certains sportifs utilisent-ils illégalement le Stanozolol ?",
        choices: ["Pour augmenter la force et la masse musculaire", "Pour améliorer la vision", "Pour respirer sous l'eau"],
        correctIndex: 0,
        explain: "Il est utilisé pour améliorer la force et la masse musculaire."
    },
    {
        id: 3,
        q: "Quel est un effet à court terme du Stanozolol ?",
        choices: ["Augmentation de la puissance musculaire", "Perte totale d'appétit", "Somnolence extrême"],
        correctIndex: 0,
        explain: "Effet immédiat : augmentation de la puissance et performance."
    },
    {
        id: 4,
        q: "Quel est un risque à long terme lié au Stanozolol ?",
        choices: ["Des problèmes hépatiques", "Une meilleure mémoire", "Des os plus solides que la normale"],
        correctIndex: 0,
        explain: "Usage prolongé : risque de lésions hépatiques."
    },
    {
        id: 5,
        q: "Quelle substance Tyson Fury avait-il été accusé d'utiliser en 2015 ?",
        choices: ["Le Stanozolol", "La caféine", "La créatine"],
        correctIndex: 0,
        explain: "En 2015, le test positif portait sur le Stanozolol."
    },
    {
        id: 6,
        q: "Comment l'affaire de dopage de Tyson Fury a-t-elle commencé ?",
        choices: ["Un test positif révélé par l’agence antidopage britannique (UKAD)", "Une confession publique", "Une vidéo trouvée sur internet"],
        correctIndex: 0,
        explain: "L'affaire est liée à un test positif remonté par UKAD."
    },
    {
        id: 7,
        q: "Quelle conséquence immédiate Tyson Fury a-t-il subie après l'affaire ?",
        choices: ["Il a été suspendu temporairement", "Il a été emprisonné", "Il a été transféré dans un autre sport"],
        correctIndex: 0,
        explain: "Il a subi une suspension temporaire."
    },
    {
        id: 8,
        q: "Quel impact ce scandale a-t-il eu sur sa réputation ?",
        choices: ["Une forte controverse dans le monde de la boxe", "Une augmentation de sa popularité", "Aucun impact"],
        correctIndex: 0,
        explain: "Le scandale a suscité une forte controverse."
    },
    {
        id: 9,
        q: "Quelle a été une conséquence sportive possible de l’affaire ?",
        choices: ["Retard dans sa carrière et ses prochains combats", "Un billet gratuit pour Las Vegas", "Une augmentation automatique de son classement"],
        correctIndex: 0,
        explain: "Les combats et sa carrière ont été retardés."
    },
    {
        id: 10,
        q: "Pourquoi le Stanozolol est-il interdit dans le sport ?",
        choices: ["Car il offre un avantage physique injuste", "Car il rend trop gentil", "Car il empêche de transpirer"],
        correctIndex: 0,
        explain: "Il donne un avantage compétitif injuste."
    },
    {
        id: 11,
        q: "Le Stanozolol est-il autorisé dans la compétition sportive ?",
        choices: ["Non, il est totalement interdit", "Oui, si prescrit par un médecin", "Oui pour les boxeurs seulement"],
        correctIndex: 0,
        explain: "Il est inscrit sur la liste des substances interdites."
    },
    {
        id: 12,
        q: "Quel autre effet secondaire est associé au Stanozolol ?",
        choices: ["Des problèmes cardiaques", "Une amélioration du chant", "Une meilleure digestion"],
        correctIndex: 0,
        explain: "Il peut causer des troubles cardiovasculaires."
    }
];

// ─────────────── HELPERS ───────────────
function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// ─────────────── ELEMENTS DOM ───────────────
const elements = {
    title: document.getElementById('q-title'),
    subtitle: document.getElementById('q-sub'),
    answers: document.getElementById('answers'),
    validateBtn: document.getElementById('validateBtn'),
    progress: document.getElementById('progress')
};

// Vérification basique
if (!elements.title || !elements.subtitle || !elements.answers || !elements.validateBtn) {
    console.error("Certains éléments du DOM sont introuvables ! Vérifie les id dans ton HTML.");
}

// ─────────────── RENDER ───────────────
function render() {
    if (!elements.answers) return;

    elements.answers.innerHTML = '';

    // Fin du quiz ?
    if (state.currentIndex >= questions.length) {
        elements.title.textContent = "Quiz terminé 🎉";
        elements.subtitle.textContent = `Score final : ${state.score} / ${questions.length}`;
        elements.progress.textContent = "";
        elements.validateBtn.style.display = "none";
        return;
    }

    const current = questions[state.currentIndex];

    elements.title.textContent = `QUESTION ${state.currentIndex + 1} —`;
    elements.subtitle.textContent = current.q;
    elements.progress.textContent = `Question ${state.currentIndex + 1} / ${questions.length}`;

    // Mélange des choix
    const shuffled = shuffle(current.choices.map((text, index) => ({ text, index })));

    shuffled.forEach(({ text, index }) => {
        const btn = document.createElement('button');
        btn.className = 'answer';
        btn.textContent = text;
        
        btn.addEventListener('click', () => {
            document.querySelectorAll('.answer').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            state.selected = index;
        });
        
        elements.answers.appendChild(btn);
    });
}

// ─────────────── VALIDATION ───────────────
if (elements.validateBtn) {
    elements.validateBtn.addEventListener('click', () => {
        if (state.selected === null) {
            alert("Sélectionne une réponse avant de valider !");
            return;
        }

        const current = questions[state.currentIndex];
        const isCorrect = state.selected === current.correctIndex;

        if (isCorrect) state.score++;

        // Sauvegarde pour la page de feedback
        localStorage.setItem('quiz_state', JSON.stringify({
            currentIndex: state.currentIndex,
            score: state.score,
            explain: (isCorrect ? "Bonne réponse — " : "Mauvaise réponse — ") + current.explain
        }));

        // Redirection
        window.location.href = isCorrect ? 'correct.html' : 'incorrect.html';
    });
}

// ─────────────── LANCEMENT ───────────────
render();
