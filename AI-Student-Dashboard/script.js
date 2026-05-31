document.addEventListener('DOMContentLoaded', () => {
  const state = {
    name: 'Samarth',
    stats: {
      coursesCompleted: 12,
      studyHours: 145,
      tasksCompletedBase: 56,
      currentStreak: 15,
    },
    quotes: [
      'Consistency beats intensity.',
      'Small habits unlock big results.',
      'Learning today builds tomorrow’s confidence.',
      'The best time to start was yesterday; the next best is now.',
    ],
    aiResponses: [
      'Great question! Keep focusing on one topic at a time.',
      'I recommend breaking your task into smaller parts.',
      'Your progress is looking strong — maintain the streak!',
      'Try pairing practice with a short review session.',
    ],
  };

  const navItems = document.querySelectorAll('.side nav li');
  const taskCheckboxes = document.querySelectorAll('.tasks input[type="checkbox"]');
  const statsCards = document.querySelectorAll('.stats .num');
  const welcomeTitle = document.querySelector('.welcome h2');
  const welcomeMessage = document.querySelector('.welcome p');
  const quoteBlock = document.querySelector('.quote blockquote');
  const chatPanel = document.querySelector('.ai .chat');
  const chatInput = document.querySelector('.chat-input input');
  const chatButton = document.querySelector('.chat-input button');
  const themeToggle = document.querySelector('.theme-toggle');

  function setActiveNav(item) {
    navItems.forEach((node) => node.classList.remove('active'));
    item.classList.add('active');
  }

  function getTimeGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  function updateStats() {
    const completedTasks = Array.from(taskCheckboxes).filter((checkbox) => checkbox.checked).length;
    const totalTasks = taskCheckboxes.length;
    const tasksCompleted = state.stats.tasksCompletedBase + completedTasks;

    statsCards[0].textContent = state.stats.coursesCompleted;
    statsCards[1].textContent = state.stats.studyHours;
    statsCards[2].textContent = tasksCompleted;
    statsCards[3].textContent = `${state.stats.currentStreak} Days`;

    welcomeMessage.innerHTML = `You studied <strong>${state.stats.studyHours}</strong> hours yesterday. Current Streak: <strong>${state.stats.currentStreak} Days</strong> 🔥`;
    const taskSummary = `You have completed <strong>${completedTasks}</strong> of <strong>${totalTasks}</strong> tasks today.`;
    if (!document.querySelector('.task-summary')) {
      const summaryElement = document.createElement('p');
      summaryElement.className = 'task-summary';
      summaryElement.innerHTML = taskSummary;
      document.querySelector('.tasks').prepend(summaryElement);
    } else {
      document.querySelector('.task-summary').innerHTML = taskSummary;
    }
  }

  function showQuote() {
    const nextQuote = state.quotes[Math.floor(Math.random() * state.quotes.length)];
    quoteBlock.textContent = nextQuote;
  }

  function appendChatMessage(message, className) {
    const bubble = document.createElement('div');
    bubble.className = `bubble ${className}`;
    bubble.textContent = message;
    chatPanel.appendChild(bubble);
    chatPanel.scrollTop = chatPanel.scrollHeight;
  }

  function setTheme(theme) {
    document.body.classList.toggle('dark', theme === 'dark');
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    localStorage.setItem('dashboardTheme', theme);
  }

  function loadTheme() {
    const savedTheme = localStorage.getItem('dashboardTheme');
    setTheme(savedTheme === 'dark' ? 'dark' : 'light');
  }

  function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    appendChatMessage(message, 'user');
    chatInput.value = '';
    chatInput.focus();

    const reply = state.aiResponses[Math.floor(Math.random() * state.aiResponses.length)];
    setTimeout(() => appendChatMessage(reply, 'assistant'), 600);
  }

  navItems.forEach((item) => {
    item.addEventListener('click', () => setActiveNav(item));
  });

  taskCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', updateStats);
  });

  themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
    setTheme(nextTheme);
  });

  chatButton.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  });

  welcomeTitle.textContent = `${getTimeGreeting()}, ${state.name}!`;
  loadTheme();
  updateStats();
  showQuote();
});
