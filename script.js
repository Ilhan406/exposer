// Quiz logic
const questions = [
  {
    id:1,
    q: "Le Stanozolol appartient à quelle catégorie de produit ?",
    choices: ["Un stéroïde anabolisant","Un antidouleur","Un supplément vitaminé"],
    correctIndex: 0,
    explain: "Le Stanozolol est un stéroïde anabolisant synthétique."
  },
  {
    id:2,
    q: "Pourquoi certains sportifs utilisent-ils illégalement le Stanozolol ?",
    choices: ["Pour augmenter la force et la masse musculaire","Pour améliorer la vision","Pour respirer sous l'eau"],
    correctIndex: 0,
    explain: "Il est utilisé pour améliorer la force et la masse musculaire."
  },
  {
    id:3,
    q: "Quel est un effet à court terme du Stanozolol ?",
    choices: ["Augmentation de la puissance musculaire","Perte totale d'appétit","Somnolence extrême"],
    correctIndex: 0,
    explain: "Effet immédiat : augmentation de la puissance et performance."
  },
  {
    id:4,
    q: "Quel est un risque à long terme lié au Stanozolol ?",
    choices: ["Des problèmes hépatiques","Une meilleure mémoire","Des os plus solides que la normale"],
    correctIndex: 0,
    explain: "Usage prolongé : risque de lésions hépatiques."
  },
  {
    id:5,
    q: "Quelle substance Tyson Fury avait-il été accusé d'utiliser en 2015 ?",
    choices: ["Le Stanozolol","La caféine","La créatine"],
    correctIndex: 0,
    explain: "En 2015, le test positif portait sur le Stanozolol."
  },
  {
    id:6,
    q: "Comment l'affaire de dopage de Tyson Fury a-t-elle commencé ?",
    choices: ["Un test positif révélé par l’agence antidopage britannique (UKAD)","Une confession publique","Une vidéo trouvée sur internet"],
    correctIndex: 0,
    explain: "L'affaire est liée à un test positif remonté par UKAD."
  },
  {
    id:7,
    q: "Quelle conséquence immédiate Tyson Fury a-t-il subie après l'affaire ?",
    choices: ["Il a été suspendu temporairement","Il a été emprisonné","Il a été transféré dans un autre sport"],
    correctIndex: 0,
    explain: "Il a subi une suspension temporaire."
  },
  {
    id:8,
    q: "Quel impact ce scandale a-t-il eu sur sa réputation ?",
    choices: ["Une forte controverse dans le monde de la boxe","Une augmentation de sa popularité","Aucun impact"],
    correctIndex: 0,
    explain: "Le scandale a suscité une forte controverse."
  },
  {
    id:9,
    q: "Quelle a été une conséquence sportive possible de l’affaire ?",
    choices: ["Retard dans sa carrière et ses prochains combats","Un billet gratuit pour Las Vegas","Une augmentation automatique de son classement"],
    correctIndex: 0,
    explain: "Les combats et sa carrière ont été retardés."
  },
  {
    id:10,
    q: "Pourquoi le Stanozolol est-il interdit dans le sport ?",
    choices: ["Car il offre un avantage physique injuste","Car il rend trop gentil","Car il empêche de transpirer"],
    correctIndex: 0,
    explain: "Il donne un avantage compétitif injuste."
  },
  {
    id:11,
    q: "Le Stanozolol est-il autorisé dans la compétition sportive ?",
    choices: ["Non, il est totalement interdit","Oui, si prescrit par un médecin","Oui pour les boxeurs seulement"],
    correctIndex: 0,
    explain: "Il est inscrit sur la liste des substances interdites."
  },
  {
    id:12,
    q: "Quel autre effet secondaire est associé au Stanozolol ?",
    choices: ["Des problèmes cardiaques","Une amélioration du chant","Une meilleure digestion"],
    correctIndex: 0,
    explain: "Il peut causer des troubles cardiovasculaires."
  }
];

// shuffle helper
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }

// Get state or initialize
let state = JSON.parse(localStorage.getItem('quiz_state') || '{}');
if (typeof state.currentIndex !== 'number') state.currentIndex = 0;
state.total = questions.length;
localStorage.setItem('quiz_state', JSON.stringify(state));

const qTitle = document.getElementById('q-title');
const qSub = document.getElementById('q-sub');
const answersWrap = document.getElementById('answers');
const validateBtn = document.getElementById('validateBtn');
const restartBtn = document.getElementById('restartBtn');
const progress = document.getElementById('progress');

function render() {
  answersWrap.innerHTML = '';
  const idx = state.currentIndex || 0;
  if (idx >= questions.length) {
    qTitle.innerText = 'Quiz terminé';
    qSub.innerText = 'Merci d\'avoir participé !';
    progress.innerText = `Score final: ${state.score||0} / ${questions.length}`;
    validateBtn.style.display = 'none';
    restartBtn.style.display = 'inline-block';
    return;
  }
  const current = questions[idx];
  qTitle.innerText = `QUESTION ${idx+1} —`;
  qSub.innerText = current.q;
  progress.innerText = `Question ${idx+1} / ${questions.length}`;
  // randomize order of choices
  const order = current.choices.map((c,i)=>({c,i}));
  shuffle(order);
  // create answer buttons in varying positions and variants
  const positions = ['pos-top','pos-mid','pos-bottom'];
  for (let i=0;i<order.length;i++) {
    const b = document.createElement('button');
    b.className = 'answer variant-' + ((i%3)+1) + ' ' + positions[Math.floor(Math.random()*positions.length)];
    b.innerText = order[i].c;
    b.dataset.origIndex = order[i].i; // original index to check correctness
    b.addEventListener('click', () => {
      // single-select behavior
      document.querySelectorAll('.answer').forEach(x=>x.classList.remove('selected'));
      b.classList.add('selected');
      // store selected index
      state.selected = Number(b.dataset.origIndex);
      localStorage.setItem('quiz_state', JSON.stringify(state));
    });
    answersWrap.appendChild(b);
  }
  validateBtn.style.display = 'inline-block';
  restartBtn.style.display = 'none';
}

validateBtn.addEventListener('click', () => {
  const idx = state.currentIndex || 0;
  if (idx >= questions.length) return;
  const current = questions[idx];
  if (typeof state.selected !== 'number') {
    alert('Choisis d\'abord une réponse puis clique sur Valider.');
    return;
  }
  const isCorrect = (state.selected === current.correctIndex);
  // update score
  if (!state.score) state.score = 0;
  if (isCorrect) state.score++;
  // store explanation to show on feedback page
  state.explain = isCorrect ? 'Bonne réponse — ' + current.explain : 'Mauvaise réponse — ' + current.explain;
  // keep currentIndex unchanged here; feedback page will increment when clicking Suivant
  localStorage.setItem('quiz_state', JSON.stringify(state));
  // navigate to corresponding page
  window.location = isCorrect ? 'correct.html' : 'incorrect.html';
});

restartBtn.addEventListener('click', () => {
  state.currentIndex = 0; state.score = 0; state.selected = undefined; state.explain='';
  localStorage.setItem('quiz_state', JSON.stringify(state));
  render();
});

// When the page loads, render. But if we come back from feedback page, ensure selected cleared.
window.addEventListener('load', () => {
  // if we just arrived from feedback page, keep state as is but clear selected
  state = JSON.parse(localStorage.getItem('quiz_state') || '{}');
  state.selected = undefined;
  localStorage.setItem('quiz_state', JSON.stringify(state));
  render();
});