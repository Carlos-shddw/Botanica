// Gestor de Interface e Navegação SPA
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { auth } from '../firebase.js';

export function initUI() {
  const navigateToSection = setupNavigation();
  setupAuthenticationScreen(navigateToSection);
  setupPWAInstaller();
}

function setupAuthenticationScreen(navigateToSection) {
  const welcomeScreen = document.getElementById('welcome-screen');
  const authScreen = document.getElementById('auth-screen');
  const appElements = document.querySelectorAll('.auth-gated');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const googleSignInButton = document.getElementById('btn-google-signin');
  const toast = document.getElementById('auth-toast');
  const toastMessage = document.getElementById('auth-toast-message');
  const returnButton = document.getElementById('btn-auth-return');
  let toastTimeout;
  let currentAccount = null;
  let isGuestBrowsing = false;

  function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('visible');
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove('visible'), 3200);
  }

  function showMode(mode) {
    const signingUp = mode === 'signup';
    loginForm.classList.toggle('hidden', signingUp);
    signupForm.classList.toggle('hidden', !signingUp);
    document.getElementById('login-switch').classList.toggle('hidden', signingUp);
    document.getElementById('signup-switch').classList.toggle('hidden', !signingUp);
    document.getElementById('auth-title').textContent = signingUp
      ? 'Cria o teu espaço verde'
      : 'Bem-vindo de volta, jardineiro!';
    document.getElementById('auth-description').textContent = signingUp
      ? 'Cria uma conta para começares a cuidar do teu jardim.'
      : 'Insere os teus dados para aceder ao teu jardim.';
  }

  function showAuthentication(mode = 'login') {
    welcomeScreen.classList.add('hidden');
    authScreen.classList.remove('hidden');
    showMode(mode);
    window.scrollTo({ top: 0 });
  }

  function showWelcome() {
    currentAccount = null;
    isGuestBrowsing = false;
    authScreen.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
    appElements.forEach((element) => element.classList.add('hidden'));
    loginForm.reset();
    signupForm.reset();
    showMode('login');
    returnButton.textContent = 'Acesso';
    returnButton.setAttribute('aria-label', 'Voltar ao acesso');
    window.scrollTo({ top: 0 });
  }

  function showApp(account = null) {
    currentAccount = account;
    isGuestBrowsing = !account;
    welcomeScreen.classList.add('hidden');
    authScreen.classList.add('hidden');
    appElements.forEach((element) => element.classList.remove('hidden'));
    navigateToSection(window.location.hash.slice(1), false);
    returnButton.textContent = account ? 'Terminar sessão' : 'Acesso';
    returnButton.setAttribute('aria-label', account ? `Terminar sessão de ${account.name}` : 'Voltar ao acesso');
    window.scrollTo({ top: 0 });
  }

  function getAuthErrorMessage(error) {
    switch (error?.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Email ou palavra-passe incorretos.';
      case 'auth/email-already-in-use':
        return 'Já existe uma conta com este email. Inicia sessão.';
      case 'auth/weak-password':
        return 'A palavra-passe é demasiado fraca. Escolhe outra com pelo menos 8 caracteres.';
      case 'auth/invalid-email':
        return 'O endereço de email não é válido.';
      case 'auth/too-many-requests':
        return 'Foram feitas demasiadas tentativas. Tenta novamente mais tarde.';
      case 'auth/network-request-failed':
        return 'Não foi possível contactar o Firebase. Verifica a ligação à internet.';
      case 'auth/operation-not-allowed':
        return 'Ativa este método de autenticação nas definições do projeto Firebase.';
      case 'auth/popup-blocked':
        return 'O navegador bloqueou a janela de autenticação. Permite janelas pop-up e tenta novamente.';
      case 'auth/popup-closed-by-user':
        return 'A autenticação Google foi cancelada.';
      default:
        return error instanceof Error ? error.message : 'Ocorreu um erro ao contactar o Firebase.';
    }
  }

  document.querySelectorAll('[data-auth-mode]').forEach((button) => {
    button.addEventListener('click', () => showAuthentication(button.dataset.authMode));
  });

  document.getElementById('btn-welcome-enter').addEventListener('click', () => showAuthentication('login'));
  document.getElementById('btn-welcome-signup').addEventListener('click', () => showAuthentication('signup'));

  googleSignInButton.addEventListener('click', async () => {
    googleSignInButton.disabled = true;

    try {
      const credential = await signInWithPopup(auth, new GoogleAuthProvider());
      const account = {
        name: credential.user.displayName || credential.user.email?.split('@')[0] || 'Jardineiro',
        email: credential.user.email
      };
      showApp(account);
      showToast(`Bem-vindo, ${account.name}!`);
    } catch (error) {
      console.error('Erro ao iniciar sessão com Google:', error);
      showToast(getAuthErrorMessage(error));
    } finally {
      googleSignInButton.disabled = false;
    }
  });

  document.querySelectorAll('[data-password-target]').forEach((button) => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.passwordTarget);
      const icon = button.querySelector('.material-symbols-outlined');
      const showingPassword = input.type === 'password';
      input.type = showingPassword ? 'text' : 'password';
      icon.textContent = showingPassword ? 'visibility_off' : 'visibility';
      button.setAttribute('aria-label', showingPassword ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe');
    });
  });

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = loginForm.querySelector('[type="submit"]');
    const email = loginForm.elements.email.value.trim().toLocaleLowerCase('pt-PT');
    const password = loginForm.elements.password.value;
    submitButton.disabled = true;
    submitButton.textContent = 'A validar...';

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const account = {
        name: credential.user.displayName || email.split('@')[0],
        email: credential.user.email
      };
      loginForm.reset();
      showApp(account);
      showToast(`Bem-vindo, ${account.name}!`);
    } catch (error) {
      console.error('Erro ao iniciar sessão Firebase:', error);
      showToast(getAuthErrorMessage(error));
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Entrar <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>';
    }
  });

  const signupPassword = document.getElementById('signup-password');
  const confirmPassword = document.getElementById('signup-confirm-password');

  signupForm.elements.name.addEventListener('input', () => {
    signupForm.elements.name.setCustomValidity('');
  });
  confirmPassword.addEventListener('input', () => confirmPassword.setCustomValidity(''));
  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (signupPassword.value !== confirmPassword.value) {
      confirmPassword.setCustomValidity('As palavras-passe não coincidem.');
      confirmPassword.reportValidity();
      return;
    }

    const submitButton = signupForm.querySelector('[type="submit"]');
    const name = signupForm.elements.name.value.trim();
    const email = signupForm.elements.email.value.trim().toLocaleLowerCase('pt-PT');
    const password = signupPassword.value;
    if (!name) {
      signupForm.elements.name.setCustomValidity('Introduz o teu nome.');
      signupForm.elements.name.reportValidity();
      return;
    }
    submitButton.disabled = true;
    submitButton.textContent = 'A criar conta...';

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name });
      signupForm.reset();
      showApp({ name, email: credential.user.email });
      showToast(`Conta criada. Bem-vindo, ${name}!`);
    } catch (error) {
      console.error('Erro ao criar conta Firebase:', error);
      showToast(getAuthErrorMessage(error));
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Criar conta <span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>';
    }
  });

  document.querySelectorAll('[data-auth-action="reset"]').forEach((button) => {
    button.addEventListener('click', async () => {
      const email = loginForm.elements.email.value.trim().toLocaleLowerCase('pt-PT');
      if (!email) {
        showToast('Introduz o teu email antes de pedir a recuperação da palavra-passe.');
        loginForm.elements.email.focus();
        return;
      }

      try {
        await sendPasswordResetEmail(auth, email);
        showToast('Se existir uma conta para este email, receberás uma mensagem para repor a palavra-passe.');
      } catch (error) {
        console.error('Erro ao pedir reposição da palavra-passe Firebase:', error);
        showToast(getAuthErrorMessage(error));
      }
    });
  });

  document.getElementById('btn-explore-without-account').addEventListener('click', () => showApp());
  returnButton.addEventListener('click', async () => {
    if (!currentAccount) {
      showWelcome();
      return;
    }

    try {
      isGuestBrowsing = false;
      await signOut(auth);
      showToast('Sessão terminada.');
    } catch (error) {
      console.error('Erro ao terminar sessão Firebase:', error);
      showToast(getAuthErrorMessage(error));
    }
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      showApp({
        name: user.displayName || user.email?.split('@')[0] || 'Jardineiro',
        email: user.email
      });
    } else if (!isGuestBrowsing) {
      showWelcome();
    }
  }, (error) => {
    console.error('Erro ao verificar a sessão Firebase:', error);
    showToast(getAuthErrorMessage(error));
  });
}

function setupNavigation() {
  const navButtons = document.querySelectorAll('[data-target]');
  const sections = document.querySelectorAll('.app-section');

  function navigateToSection(targetId, updateHash = true) {
    const section = document.getElementById(targetId);
    if (!section || !section.matches('.app-section')) return;

    navButtons.forEach((button) => {
      button.classList.toggle('active', button.getAttribute('data-target') === targetId);
    });
    sections.forEach((appSection) => {
      const isTarget = appSection === section;
      appSection.classList.toggle('hidden', !isTarget);
      appSection.classList.toggle('active', isTarget);
    });

    if (updateHash && window.location.hash !== `#${targetId}`) {
      window.location.hash = targetId;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      navigateToSection(targetId);
    });
  });

  window.addEventListener('hashchange', () => {
    navigateToSection(window.location.hash.slice(1), false);
  });

  navigateToSection(window.location.hash.slice(1), false);
  return navigateToSection;
}

// Gestão de Prompt de Instalação PWA
let deferredPrompt;
function setupPWAInstaller() {
  const installBtn = document.getElementById('btn-pwa-install');
  const navbarContainer = installBtn.closest('.navbar-container');
  const toast = document.getElementById('auth-toast');
  const toastMessage = document.getElementById('auth-toast-message');
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isInstalled = window.matchMedia('(display-mode: standalone)').matches
    || navigator.standalone === true;
  let toastTimeout;

  function hideInstallButton() {
    installBtn.classList.add('hidden');
    navbarContainer.classList.remove('install-available');
  }

  function showInstallMessage(message) {
    toastMessage.textContent = message;
    toast.classList.add('visible');
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove('visible'), 4500);
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.classList.remove('hidden');
    navbarContainer.classList.add('install-available');
  });

  if (isIOS && !isInstalled) {
    installBtn.classList.remove('hidden');
    navbarContainer.classList.add('install-available');
  }

  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) {
      if (isIOS && !isInstalled) {
        showInstallMessage('Para instalar no iPhone ou iPad, toca em Partilhar e escolhe «Adicionar ao ecrã principal».');
        return;
      }
      showInstallMessage('A instalação não está disponível neste browser. Abre a app através de HTTPS ou localhost num browser compatível.');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Resultado do prompt de instalação: ${outcome}`);
    deferredPrompt = null;
    hideInstallButton();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    hideInstallButton();
  });
}