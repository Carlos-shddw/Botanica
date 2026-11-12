export const plants = [
  {
    id: 'monstera',
    name: 'Costela-de-adão',
    scientificName: 'Monstera deliciosa',
    image: './assets/images/plants/monstera.jpg',
    light: 'indireta',
    lightLabel: 'Luz indireta',
    water: 'Quando a camada superior do substrato estiver seca',
    wateringIntervalDays: 7,
    difficulty: 'Fácil',
    petSafe: false,
    description: 'Folhas recortadas e exuberantes que dão um toque tropical a qualquer divisão luminosa.',
    care: ['Prefere luz indireta brilhante.', 'Deixa o substrato secar ligeiramente entre regas.', 'Limpa as folhas e oferece um tutor para crescer.']
  },
  {
    id: 'zamioculca',
    name: 'Zamioculca',
    scientificName: 'Zamioculcas zamiifolia',
    image: './assets/images/plants/zamioculca.jpg',
    light: 'sombra',
    lightLabel: 'Luz baixa a indireta',
    water: 'Só quando o substrato estiver completamente seco',
    wateringIntervalDays: 21,
    difficulty: 'Muito fácil',
    petSafe: false,
    description: 'Resistente e elegante, é uma excelente escolha para quem está a começar.',
    care: ['Adapta-se a espaços com pouca luz.', 'Armazena água nos rizomas: evita regar em excesso.', 'Gosta de um vaso com boa drenagem.']
  },
  {
    id: 'sansevieria',
    name: 'Espada-de-são-jorge',
    scientificName: 'Dracaena trifasciata',
    image: './assets/images/plants/sansevieria.jpg',
    light: 'indireta',
    lightLabel: 'Luz indireta',
    water: 'Deixa o substrato secar totalmente entre regas',
    wateringIntervalDays: 21,
    difficulty: 'Muito fácil',
    petSafe: false,
    description: 'Uma planta escultural e muito tolerante, ideal para rotinas de cuidados simples.',
    care: ['Tolera desde luz indireta até algumas horas de sol suave.', 'Rega pouco, sobretudo no inverno.', 'Evita deixar água acumulada no prato.']
  },
  {
    id: 'calathea',
    name: 'Maranta-pena-de-pavão',
    scientificName: 'Goeppertia makoyana',
    image: './assets/images/plants/calathea.jpg',
    light: 'sombra',
    lightLabel: 'Luz indireta suave',
    water: 'Mantém o substrato ligeiramente húmido',
    wateringIntervalDays: 4,
    difficulty: 'Exigente',
    petSafe: true,
    description: 'Folhas desenhadas em tons de verde e púrpura, perfeitas para dar vida a cantos protegidos.',
    care: ['Evita sol direto, que pode queimar as folhas.', 'Prefere humidade elevada e água pouco calcária.', 'Não deixes o substrato secar por completo.']
  },
  {
    id: 'pothos',
    name: 'Jiboia',
    scientificName: 'Epipremnum aureum',
    image: './assets/images/plants/jiboia.jpg',
    light: 'indireta',
    lightLabel: 'Luz indireta',
    water: 'Quando os primeiros centímetros de terra secarem',
    wateringIntervalDays: 7,
    difficulty: 'Fácil',
    petSafe: false,
    description: 'Trepadeira versátil e de crescimento rápido, fica bonita em vasos suspensos ou com tutor.',
    care: ['Cresce bem com luz indireta, sem sol forte.', 'Poda as pontas para estimular um crescimento mais cheio.', 'Deixa o substrato secar ligeiramente entre regas.']
  },
  {
    id: 'chlorophytum',
    name: 'Planta-aranha',
    scientificName: 'Chlorophytum comosum',
    image: './assets/images/plants/planta-aranha.jpg',
    light: 'indireta',
    lightLabel: 'Luz indireta',
    water: 'Quando a superfície da terra começar a secar',
    wateringIntervalDays: 7,
    difficulty: 'Muito fácil',
    petSafe: true,
    description: 'Resistente, fácil de propagar e segura para animais; adapta-se a muitos ambientes.',
    care: ['Prefere luz abundante sem sol direto intenso.', 'Regar moderadamente e reduzir no inverno.', 'Os rebentos podem ser usados para criar novas plantas.']
  },
  {
    id: 'ficus',
    name: 'Figueira-lira',
    scientificName: 'Ficus lyrata',
    image: './assets/images/plants/ficus-lira.jpg',
    light: 'indireta',
    lightLabel: 'Luz indireta brilhante',
    water: 'Quando a camada superior do substrato secar',
    wateringIntervalDays: 7,
    difficulty: 'Exigente',
    petSafe: false,
    description: 'Uma árvore de interior marcante, conhecida pelas folhas grandes em forma de lira.',
    care: ['Escolhe um local luminoso e evita mudá-la frequentemente.', 'Roda o vaso para um crescimento equilibrado.', 'Limpa o pó das folhas e evita encharcar o substrato.']
  },
  {
    id: 'chamaedorea',
    name: 'Palmeira-de-sala',
    scientificName: 'Chamaedorea elegans',
    image: './assets/images/plants/palmeira-sala.jpg',
    light: 'sombra',
    lightLabel: 'Luz indireta suave',
    water: 'Mantém a terra ligeiramente húmida, sem encharcar',
    wateringIntervalDays: 7,
    difficulty: 'Fácil',
    petSafe: true,
    description: 'Palmeira compacta e segura para animais, adequada a divisões com luz moderada.',
    care: ['Evita sol direto nas folhas.', 'Rega quando a superfície do substrato começar a secar.', 'Afasta-a de correntes de ar frio.']
  },
  {
    id: 'aloe',
    name: 'Aloe-vera',
    scientificName: 'Aloe vera',
    image: './assets/images/plants/aloe-vera.jpg',
    light: 'direta',
    lightLabel: 'Sol direto suave',
    water: 'Deixa o substrato secar completamente entre regas',
    wateringIntervalDays: 21,
    difficulty: 'Fácil',
    petSafe: false,
    description: 'Suculenta prática para locais soalheiros, com folhas carnudas que armazenam água.',
    care: ['Precisa de bastante luz e algumas horas de sol.', 'Usa substrato drenante próprio para suculentas.', 'Rega pouco e nunca deixes água no centro da roseta.']
  }
];

const difficultyOrder = { 'Muito fácil': 0, 'Fácil': 1, 'Exigente': 2 };

export function normalize(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-PT').trim();
}

function createPlantCard(plant) {
  const article = document.createElement('article');
  article.className = 'plant-card';
  article.dataset.plantId = plant.id;

  const imageWrap = document.createElement('div');
  imageWrap.className = 'plant-card-img-wrapper';
  const fallback = document.createElement('span');
  fallback.className = 'plant-image-fallback material-symbols-outlined';
  fallback.setAttribute('aria-hidden', 'true');
  fallback.textContent = 'psychiatry';
  const image = document.createElement('img');
  image.className = 'plant-card-img';
  image.src = plant.image;
  image.alt = `Planta ${plant.name}`;
  image.loading = 'lazy';
  image.decoding = 'async';
  image.addEventListener('error', () => image.remove(), { once: true });
  imageWrap.append(fallback, image);

  const tags = document.createElement('div');
  tags.className = 'plant-image-tags';
  const petTag = document.createElement('span');
  petTag.className = `plant-status ${plant.petSafe ? 'is-safe' : 'is-toxic'}`;
  petTag.textContent = plant.petSafe ? 'Pet-friendly' : 'Tóxica para animais';
  tags.append(petTag);
  imageWrap.append(tags);

  const content = document.createElement('div');
  content.className = 'plant-card-content';
  const scientific = document.createElement('p');
  scientific.className = 'plant-scientific-name';
  scientific.textContent = plant.scientificName;
  const name = document.createElement('h3');
  name.className = 'plant-common-name';
  name.textContent = plant.name;
  const description = document.createElement('p');
  description.className = 'plant-description';
  description.textContent = plant.description;

  const care = document.createElement('div');
  care.className = 'plant-card-care';
  const light = document.createElement('span');
  light.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">light_mode</span>';
  light.append(document.createTextNode(plant.lightLabel));
  const difficulty = document.createElement('span');
  difficulty.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">spa</span>';
  difficulty.append(document.createTextNode(plant.difficulty));
  care.append(light, difficulty);

  const details = document.createElement('button');
  details.className = 'plant-card-details';
  details.type = 'button';
  details.dataset.plantDetails = plant.id;
  details.setAttribute('aria-label', `Ver cuidados de ${plant.name}`);
  details.innerHTML = 'Ver cuidados <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>';
  content.append(scientific, name, description, care, details);
  article.append(imageWrap, content);
  return article;
}

function renderDetails(plant, dialogContent) {
  dialogContent.replaceChildren();
  const eyebrow = document.createElement('p');
  eyebrow.className = 'plant-dialog-eyebrow';
  eyebrow.textContent = plant.scientificName;
  const title = document.createElement('h2');
  title.id = 'plant-dialog-title';
  title.textContent = plant.name;
  const description = document.createElement('p');
  description.className = 'plant-dialog-description';
  description.textContent = plant.description;
  const facts = document.createElement('div');
  facts.className = 'plant-dialog-facts';
  [
    ['light_mode', 'Luz', plant.lightLabel],
    ['water_drop', 'Rega', plant.water],
    ['spa', 'Dificuldade', plant.difficulty],
    ['pets', 'Animais', plant.petSafe ? 'Segura para animais' : 'Tóxica para animais']
  ].forEach(([icon, label, value]) => {
    const fact = document.createElement('div');
    fact.className = 'plant-dialog-fact';
    const factLabel = document.createElement('span');
    factLabel.innerHTML = `<span class="material-symbols-outlined" aria-hidden="true">${icon}</span>${label}`;
    const factValue = document.createElement('strong');
    factValue.textContent = value;
    fact.append(factLabel, factValue);
    facts.append(fact);
  });
  const careHeading = document.createElement('h3');
  careHeading.textContent = 'Dicas de cuidado';
  const list = document.createElement('ul');
  plant.care.forEach((tip) => {
    const item = document.createElement('li');
    item.textContent = tip;
    list.append(item);
  });
  dialogContent.append(eyebrow, title, description, facts, careHeading, list);
}

export function initCatalog() {
  const list = document.getElementById('plant-list');
  const search = document.getElementById('search-input');
  const lightFilter = document.getElementById('filter-light');
  const petFilter = document.getElementById('filter-pets');
  const sortSelect = document.getElementById('catalog-sort');
  const emptyState = document.getElementById('catalog-empty');
  const resultCount = document.getElementById('catalog-result-count');
  const dialog = document.getElementById('plant-details');
  const dialogContent = document.getElementById('plant-dialog-content');

  document.getElementById('catalog-total').textContent = String(plants.length);

  function render() {
    const query = normalize(search.value);
    const filtered = plants.filter((plant) => {
      const matchesSearch = normalize(`${plant.name} ${plant.scientificName} ${plant.description}`).includes(query);
      const matchesLight = !lightFilter.value || plant.light === lightFilter.value;
      const matchesPets = !petFilter.value || (petFilter.value === 'safe' ? plant.petSafe : !plant.petSafe);
      return matchesSearch && matchesLight && matchesPets;
    });

    filtered.sort((a, b) => sortSelect.value === 'easy'
      ? difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty] || a.name.localeCompare(b.name, 'pt')
      : a.name.localeCompare(b.name, 'pt'));

    list.replaceChildren(...filtered.map(createPlantCard));
    emptyState.classList.toggle('hidden', filtered.length > 0);
    resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'planta' : 'plantas'}`;
    document.getElementById('clear-search').classList.toggle('hidden', search.value.length === 0);
  }

  [search, lightFilter, petFilter, sortSelect].forEach((control) => {
    control.addEventListener(control === search ? 'input' : 'change', render);
  });

  document.getElementById('clear-search').addEventListener('click', () => {
    search.value = '';
    search.focus();
    render();
  });

  document.getElementById('reset-catalog').addEventListener('click', () => {
    search.value = '';
    lightFilter.value = '';
    petFilter.value = '';
    sortSelect.value = 'name';
    render();
  });

  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-plant-details]');
    if (!button) return;
    const plant = plants.find((item) => item.id === button.dataset.plantDetails);
    if (!plant) return;
    renderDetails(plant, dialogContent);
    dialog.showModal();
  });

  dialog.querySelector('.plant-dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  render();
}
