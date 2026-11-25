import { getPersonalPlants } from '../db.js';
import { auth } from '../firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getLocalDate } from './utils.js';

function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  return element;
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat('pt-PT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date(`${dateString}T00:00:00`));
}

function daysUntil(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const scheduledDate = new Date(`${dateString}T00:00:00`);
  scheduledDate.setHours(0, 0, 0, 0);
  return Math.round((scheduledDate - today) / 86400000);
}

function getScheduleLabel(dayDifference) {
  if (dayDifference < 0) {
    const daysLate = Math.abs(dayDifference);
    return `Atrasada há ${daysLate} ${daysLate === 1 ? 'dia' : 'dias'}`;
  }
  if (dayDifference === 0) return 'Hoje';
  if (dayDifference === 1) return 'Amanhã';
  return `Daqui a ${dayDifference} dias`;
}

function createReminder(plant) {
  const interval = Number.isInteger(plant.wateringIntervalDays) ? plant.wateringIntervalDays : 7;
  const scheduledDate = plant.nextWateringDate || getLocalDate(interval);
  const dayDifference = daysUntil(scheduledDate);
  const reminder = document.createElement('article');
  reminder.className = 'agenda-reminder';
  reminder.classList.add(dayDifference < 0 ? 'is-overdue' : dayDifference === 0 ? 'is-due' : 'is-upcoming');

  const dateBlock = document.createElement('div');
  dateBlock.className = 'agenda-reminder-date';
  dateBlock.append(
    createTextElement('strong', 'agenda-reminder-label', getScheduleLabel(dayDifference)),
    createTextElement('time', 'agenda-reminder-calendar-date', formatDate(scheduledDate))
  );
  dateBlock.querySelector('time').dateTime = scheduledDate;

  const details = document.createElement('div');
  details.className = 'agenda-reminder-details';
  details.append(
    createTextElement('h2', '', plant.name),
    createTextElement('p', 'agenda-reminder-scientific-name', plant.scientificName),
    createTextElement(
      'p',
      'agenda-reminder-interval',
      `Verificar a rega a cada ${interval} ${interval === 1 ? 'dia' : 'dias'}`
    )
  );

  reminder.append(dateBlock, details);
  return reminder;
}

export function initAgenda() {
  const remindersList = document.getElementById('reminders-list');
  let renderSequence = 0;

  function showMessage(message, className) {
    const notice = createTextElement('p', className, message);
    remindersList.replaceChildren(notice);
  }

  async function renderAgenda() {
    const currentRender = ++renderSequence;
    if (!auth.currentUser) {
      showMessage('Inicia sessão para consultar as regas agendadas do teu jardim.', 'agenda-empty');
      return;
    }

    try {
      const personalPlants = await getPersonalPlants();
      if (currentRender !== renderSequence) return;

      if (personalPlants.length === 0) {
        showMessage('Adiciona plantas ao teu jardim para veres aqui as próximas regas.', 'agenda-empty');
        return;
      }

      const reminders = personalPlants
        .map((plant) => ({
          plant,
          scheduledDate: plant.nextWateringDate || getLocalDate(
            Number.isInteger(plant.wateringIntervalDays) ? plant.wateringIntervalDays : 7
          )
        }))
        .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))
        .map(({ plant }) => createReminder(plant));

      remindersList.replaceChildren(...reminders);
    } catch (error) {
      if (currentRender !== renderSequence) return;
      console.error('Erro ao carregar a agenda de rega:', error);
      showMessage('Não foi possível carregar a agenda. Atualiza a página e tenta novamente.', 'agenda-error');
    }
  }

  window.addEventListener('hashchange', () => {
    if (window.location.hash.slice(1) === 'lembretes') renderAgenda();
  });
  window.addEventListener('garden-updated', renderAgenda);

  onAuthStateChanged(auth, renderAgenda, (error) => {
    console.error('Erro ao verificar a sessão para a agenda:', error);
    showMessage('Não foi possível verificar a sessão. Atualiza a página e tenta novamente.', 'agenda-error');
  });
}
