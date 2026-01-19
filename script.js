// Quiz logic — VERSION STABLE (12 questions affichées)

document.addEventListener("DOMContentLoaded", () => {

  let saved = JSON.parse(localStorage.getItem('quiz_state'));
  let state;

  if (!saved || typeof saved.currentIndex !== 'number') {
    // Nouveau quiz
    state = {
      currentIndex: 0,
      score: 0
    };
  } else {
    // Question suivante
    state = {
      currentIndex: saved.currentIndex + 1,
      score: saved.score
    };
  }

  localStorage.removeItem('quiz_state');

  const questions = [
    {
      q: "Le Stanozolol appartient à quelle catégorie de produit ?",
      choices: ["Un stéroïde anabolisant","Un antidouleur","Un supplément vitaminé"],
      correctIndex: 0,
      explain: "Le Stanozolol est un stéroïde anabolisant synthétique."
    },
    {
      q: "Pourquoi certains sportifs utilisent-ils illégalement le Stanozolol ?",
      choices: ["Pour augmenter la force et la masse musculaire","Pour améliorer la vision","Pour respirer sous l'eau"],
      correctIndex: 0,
      explain: "Il est utilisé pour améliorer la force et la masse musculaire."
    },
    {
      q: "Quel est un effet à court terme du Stanozolol ?",
      choices: ["Augmentation de la puissance musculaire","Perte totale d'appétit","Somnolence extrême"],
      correctIndex: 0,
      explain: "Effet immédiat : augmentation de la puissance."
    },
    {
      q: "Quel est un risque à long terme lié au Stanozolol ?",
      choices: ["Des problèmes hépatiques","Une meilleure mémoire","Des os plus solides que la normale"],
      correctIndex: 0,
      explain: "Usage prolongé : risque de lésions hépatiques."
    },
    {
      q: "Quelle substance Tyson Fury avait-il été accusé d'utiliser en 2015 ?",
      choices: ["Le Stanozolol","La caféine","La créatine"],
      correctIndex: 0,
      explain: "Le test positif concernait le Stanozolol."
    },
    {
      q: "Comment l'affaire de dopage de Tyson Fury a-t-elle commencé ?",
      choices: ["Un test positif révélé par l’UKAD","Une confession publique","Une vidéo sur internet"],
      correctIndex: 0,
      explain: "Affaire révélée par un test positif UKAD."
    },
    {
      q: "Quelle conséquence immédiate Tyson Fury a-t-il subie ?",
      choices: ["Suspension temporaire","Emprisonnement","Changement de sport"],
      correctIndex: 0,
      explain: "Il a été suspendu temporairement."
    },
    {
      q: "Quel impact ce scandale a-t-il eu sur sa réputation ?",
      choices: ["Forte controverse","Hausse de popularité","Aucun impact"],
      correctIndex: 0,
      explain: "Le scandale a créé une forte controverse."
    },
    {
      q: "Quelle conséquence sportive possible ?",
      choices: ["Retard de carrière","Voyage offert","Classement automatique"],
      correctIndex: 0,
      explain: "Sa carrière a été retardée."
    },
    {
      q: "Pourquoi le Stanozolol est-il interdit ?",
      choices: ["Avantage physique injuste","Rend trop gentil","Empêche de transpirer"],
      correctIndex: 0,
      explain: "Il crée un avantage injuste."
    },
    {
      q: "Le Stanozolol est-il autorisé en compétition ?",
      choices: ["Non, interdit","Oui avec ordonnance","Oui pour boxeurs"],
      correctIndex: 0,
      explain: "Il est totalement interdit."
    },
    {
      q: "Quel autre effet secondaire est associé ?",
      choices: ["Problèmes cardiaques","Meilleur chant","Meilleure digestion"],
      correctIndex: 0,
      explain: "Risque cardiovasculaire."
    }
  ];

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const qTitle = document.getElementById('q-title');
  const qSub = document.getElementById('q-sub');
  const answersWrap = document.getElementById('answers');
  const validateBtn = document.getElementById('validateBtn');
  const progress = document.getElementById('progress');

  function render() {
    answersWrap.innerHTML = '';
    state.selected = null;

    if (state.currentIndex >= questions.length) {
      qTitle.innerText = "Quiz terminé 🎉";
      qSub.innerText = `Score : ${state.score} / ${questions.length}`;
      progress.innerText = "";
      validateBtn.style.display = "none";
      return;
    }

    const current = questions[state.currentIndex];

    qTitle.innerText = `QUESTION ${state.currentIndex + 1} —`;
    qSub.innerText = current.q;
    progress.innerText = `Question ${state.currentIndex + 1} / ${questions.length}`;

    shuffle(current.choices.map((c, i) => ({ c, i }))).forEach(item => {
      const b = document.createElement('button');
      b.className = 'answer';
      b.innerText = item.c;
      b.onclick = () => {
        document.querySelectorAll('.answer').forEach(x => x.classList.remove('selected'));
        b.classList.add('selected');
        state.selected = item.i;
      };
      answersWrap.appendChild(b);
    });
  }

  validateBtn.onclick = () => {
    if (state.selected === null) {
      alert("Choisis une réponse");
      return;
    }

    const current = questions[state.currentIndex];
    const ok = state.selected === current.correctIndex;
    if (ok) state.score++;

    localStorage.setItem('quiz_state', JSON.stringify({
      currentIndex: state.currentIndex,
      score: state.score,
      explain: (ok ? "Bonne réponse — " : "Mauvaise réponse — ") + current.explain
    }));

    window.location = ok ? 'correct.html' : 'incorrect.html';
  };

  render();
});
