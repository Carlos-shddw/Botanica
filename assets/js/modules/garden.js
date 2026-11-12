import { deletePersonalPlant, getPersonalPlants, savePersonalPlant, updatePersonalPlant } from '../db.js';
import { normalize, plants } from './catalog.js';

function getLocalDate(daysFromNow = 0) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + daysFromNow);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat('pt-PT', { dateStyle: 'long' }).format(date);
}

function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  return element;
}

function createGardenCard(plant) {
  const article = document.createElement('article');
  article.className = 'plant-card garden-plant-card';

  const imageWrap = document.createElement('div');
  imageWrap.className = 'plant-card-img-wrapper';
  const image = document.createElement('img');
  image.className = 'plant-card-img';
  image.src = plant.image;
  image.alt = `Planta ${plant.name}`;
  image.loading = 'lazy';
  image.addEventListener('error', () => image.remove(), { once: true });
  imageWrap.append(image);

  const content = document.createElement('div');
  content.className = 'plant-card-content';
  content.append(
    createTextElement('p', 'plant-scientific-name', plant.scientificName),
    createTextElement('h2', 'plant-common-name', plant.name),
    createTextElement('p', 'plant-description', plant.description)
  );

  const care = document.createElement('div');
  care.className = 'plant-card-care';
  [
    ['light_mode', plant.lightLabel],
    ['water_drop', plant.water]
  ].forEach(([iconName, label]) => {
    const item = document.createElement('span');
    const icon = createTextElement('span', 'material-symbols-outlined', iconName);
    icon.setAttribute('aria-hidden', 'true');
    item.append(icon, document.createTextNode(label));
    care.append(item);
  });

  const interval = Number.isInteger(plant.wateringIntervalDays) ? plant.wateringIntervalDays : 7;
  const nextWateringDate = plant.nextWateringDate || getLocalDate(interval);
  const watering = document.createElement('div');
  watering.className = 'garden-watering';
  const isDue = nextWateringDate <= getLocalDate();
  watering.append(
    createTextElement('strong', 'garden-watering-title', isDue ? 'Verificar a rega hoje' : 'Próxima rega'),
    createTextElement('p', 'garden-watering-date', formatDate(nextWateringDate)),
    createTextElement('p', 'garden-watering-interval', `Verificar a cada ${interval} ${interval === 1 ? 'dia' : 'dias'}`),
    createTextElement('p', 'garden-watering-help', 'Data estimada; confirma a humidade do substrato.')
  );
  if (plant.lastWateredAt) {
    watering.append(createTextElement('p', 'garden-last-watered', `Última rega: ${formatDate(plant.lastWateredAt)}`));
  }

  const careDetails = document.createElement('details');
  careDetails.className = 'garden-care-details';
  careDetails.append(createTextElement('summary', '', 'Dicas de cuidado'));
  const tips = document.createElement('ul');
  plant.care.forEach((tip) => tips.append(createTextElement('li', '', tip)));
  careDetails.append(tips);

  const wateredButton = createTextElement('button', 'btn-primary garden-watered-button', 'Reguei hoje');
  wateredButton.type = 'button';
  wateredButton.dataset.wateredPlant = String(plant.id);
  const removeButton = createTextElement('button', 'garden-remove-button', 'Remover planta');
  removeButton.type = 'button';
  removeButton.dataset.deletePlant = String(plant.id);
  removeButton.setAttribute('aria-label', `Remover ${plant.name} do jardim`);
  content.append(care, watering, careDetails, wateredButton, removeButton);
  article.append(imageWrap, content);
  return article;
}

export function initGarden() {
  const gardenList = document.getElementById('my-plants-list');
  const addButton = document.getElementById('btn-add-plant');
  const dialog = document.getElementById('add-plant-dialog');
  const search = document.getElementById('garden-search');
  const searchCount = document.getElementById('garden-search-count');
  const searchResults = document.getElementById('garden-search-results');
  const preview = document.getElementById('garden-plant-preview');
  const closeButton = dialog.querySelector('.plant-dialog-close');
  let selectedPlant = null;

  async function renderGarden() {
    try {
      const personalPlants = await getPersonalPlants();
      gardenList.classList.toggle('garden-has-multiple-plants', personalPlants.length >= 2);
      if (personalPlants.length === 0) {
        gardenList.replaceChildren(createTextElement(
          'p',
          'garden-empty',
          'Ainda não tens plantas no teu jardim. Usa “+ Adicionar Planta” para começar.'
        ));
        return;
      }

      gardenList.replaceChildren(...personalPlants.map(createGardenCard));
    } catch (error) {
      console.error('Erro ao carregar as plantas do jardim:', error);
      gardenList.classList.remove('garden-has-multiple-plants');
      gardenList.replaceChildren(createTextElement(
        'p',
        'garden-empty',
        'Não foi possível carregar o jardim. Atualiza a página e tenta novamente.'
      ));
      gardenList.lastElementChild.setAttribute('role', 'alert');
    }
  }

  function renderSearchResults() {
    const query = normalize(search.value);
    const filteredPlants = plants.filter((plant) => (
      normalize(`${plant.name} ${plant.scientificName} ${plant.description}`).includes(query)
    ));

    searchCount.textContent = `${filteredPlants.length} ${filteredPlants.length === 1 ? 'planta encontrada' : 'plantas encontradas'}`;
    if (filteredPlants.length === 0) {
      searchResults.replaceChildren(createTextElement('p', 'garden-no-results', 'Não encontrámos plantas com esse nome.'));
      return;
    }

    searchResults.replaceChildren(...filteredPlants.map((plant) => {
      const button = document.createElement('button');
      button.className = 'garden-search-result';
      button.type = 'button';
      button.dataset.selectPlant = plant.id;
      button.setAttribute('aria-pressed', String(selectedPlant?.id === plant.id));

      const image = document.createElement('img');
      image.src = plant.image;
      image.alt = '';
      image.loading = 'lazy';
      image.addEventListener('error', () => image.remove(), { once: true });

      const details = document.createElement('span');
      details.className = 'garden-search-result-details';
      details.append(
        createTextElement('strong', '', plant.name),
        createTextElement('span', '', plant.scientificName),
        createTextElement('span', 'garden-search-water', `Rega: ${plant.water}`)
      );
      const selectLabel = createTextElement('span', 'garden-search-select', selectedPlant?.id === plant.id ? 'Selecionada' : 'Escolher');
      button.append(image, details, selectLabel);
      return button;
    }));
  }

  function renderPreview(plant) {
    preview.replaceChildren();
    preview.classList.remove('hidden');

    const eyebrow = createTextElement('p', 'plant-dialog-eyebrow', plant.scientificName);
    const title = createTextElement('h3', 'garden-preview-title', plant.name);
    const description = createTextElement('p', 'plant-dialog-description', plant.description);
    const facts = document.createElement('div');
    facts.className = 'plant-dialog-facts';
    [
      ['Luz', plant.lightLabel],
      ['Rega recomendada', plant.water],
      ['Dificuldade', plant.difficulty],
      ['Animais', plant.petSafe ? 'Segura para animais' : 'Tóxica para animais']
    ].forEach(([label, value]) => {
      const fact = document.createElement('div');
      fact.className = 'plant-dialog-fact';
      fact.append(
        createTextElement('span', '', label),
        createTextElement('strong', '', value)
      );
      facts.append(fact);
    });

    const careHeading = createTextElement('h3', 'garden-tips-heading', 'Dicas de cuidado');
    const tips = document.createElement('ul');
    plant.care.forEach((tip) => tips.append(createTextElement('li', '', tip)));

    const wateringLabel = document.createElement('label');
    wateringLabel.className = 'garden-interval-label';
    wateringLabel.htmlFor = 'garden-watering-interval';
    wateringLabel.textContent = 'Lembrar-me de verificar a rega a cada (dias)';
    const intervalInput = document.createElement('input');
    intervalInput.id = 'garden-watering-interval';
    intervalInput.className = 'garden-interval-input';
    intervalInput.type = 'number';
    intervalInput.min = '1';
    intervalInput.max = '60';
    intervalInput.step = '1';
    intervalInput.required = true;
    intervalInput.value = String(plant.wateringIntervalDays);
    wateringLabel.append(intervalInput);

    const datePreview = createTextElement(
      'p',
      'garden-next-watering-preview',
      `Primeira verificação da rega: ${formatDate(getLocalDate(plant.wateringIntervalDays))}`
    );
    const intervalHelp = createTextElement(
      'p',
      'garden-interval-help',
      'A data é uma estimativa. Confirma sempre a humidade do substrato antes de regar.'
    );
    const feedback = createTextElement('p', 'garden-add-feedback', '');
    feedback.setAttribute('role', 'alert');
    const saveButton = createTextElement('button', 'btn-primary garden-save-button', 'Adicionar ao meu jardim');
    saveButton.type = 'button';

    intervalInput.addEventListener('input', () => {
      if (intervalInput.value && intervalInput.checkValidity()) {
        datePreview.textContent = `Primeira verificação da rega: ${formatDate(getLocalDate(Number(intervalInput.value)))}`;
      }
    });

    saveButton.addEventListener('click', async () => {
      if (!intervalInput.reportValidity()) return;

      const intervalDays = Number(intervalInput.value);
      saveButton.disabled = true;
      saveButton.textContent = 'A adicionar...';
      feedback.textContent = '';
      try {
        const { id: plantId, ...plantDetails } = plant;
        await savePersonalPlant({
          ...plantDetails,
          plantId,
          wateringIntervalDays: intervalDays,
          nextWateringDate: getLocalDate(intervalDays),
          lastWateredAt: null
        });
        dialog.close();
        selectedPlant = null;
        search.value = '';
        preview.classList.add('hidden');
        await renderGarden();
        addButton.focus();
      } catch (error) {
        console.error('Erro ao adicionar planta ao jardim:', error);
        feedback.textContent = 'Não foi possível adicionar a planta. Tenta novamente.';
      } finally {
        saveButton.disabled = false;
        saveButton.textContent = 'Adicionar ao meu jardim';
      }
    });

    preview.append(eyebrow, title, description, facts, careHeading, tips, wateringLabel, datePreview, intervalHelp, feedback, saveButton);
  }

  addButton.addEventListener('click', () => {
    selectedPlant = null;
    search.value = '';
    preview.replaceChildren();
    preview.classList.add('hidden');
    renderSearchResults();
    dialog.showModal();
    search.focus();
  });

  search.addEventListener('input', renderSearchResults);
  searchResults.addEventListener('click', (event) => {
    const button = event.target.closest('[data-select-plant]');
    if (!button) return;

    selectedPlant = plants.find((plant) => plant.id === button.dataset.selectPlant);
    if (!selectedPlant) return;
    renderSearchResults();
    renderPreview(selectedPlant);
  });

  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  gardenList.addEventListener('click', async (event) => {
    const removeButton = event.target.closest('[data-delete-plant]');
    if (removeButton) {
      const plantId = Number(removeButton.dataset.deletePlant);
      if (!Number.isInteger(plantId)) return;

      const plantName = removeButton.closest('.garden-plant-card').querySelector('.plant-common-name').textContent;
      if (!window.confirm(`Queres remover ${plantName} do teu jardim?`)) return;

      removeButton.disabled = true;
      try {
        await deletePersonalPlant(plantId);
        await renderGarden();
      } catch (error) {
        console.error('Erro ao remover planta do jardim:', error);
        removeButton.disabled = false;
        gardenList.prepend(createTextElement(
          'p',
          'garden-error',
          'Não foi possível remover a planta. Tenta novamente.'
        ));
      }
      return;
    }

    const button = event.target.closest('[data-watered-plant]');
    if (!button) return;

    const plantId = button.dataset.wateredPlant;
    try {
      const personalPlants = await getPersonalPlants();
      const plant = personalPlants.find((item) => String(item.id) === plantId);
      if (!plant) throw new Error('A planta selecionada já não existe no jardim.');

      const interval = Number.isInteger(plant.wateringIntervalDays) ? plant.wateringIntervalDays : 7;
      await updatePersonalPlant({
        ...plant,
        lastWateredAt: getLocalDate(),
        nextWateringDate: getLocalDate(interval)
      });
      await renderGarden();
    } catch (error) {
      console.error('Erro ao atualizar a data de rega:', error);
      gardenList.prepend(createTextElement(
        'p',
        'garden-error',
        'Não foi possível atualizar a rega. Tenta novamente.'
      ));
    }
  });

  renderGarden();
}
