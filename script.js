(function () {
  const clock = document.getElementById('clock');
  const startBtn = document.getElementById('startBtn');
  const resetBtn = document.getElementById('resetBtn');
  const taskInput = document.getElementById('taskInput');
  const modeButtons = document.querySelectorAll('.mode');
  const logList = document.getElementById('logList');
  const logEmpty = document.getElementById('logEmpty');
  const logCount = document.getElementById('logCount');

  let totalSeconds = 25 * 60;
  let remaining = totalSeconds;
  let timerId = null;
  let running = false;

  const STORAGE_KEY = 'focusTimerSessions';

  function formatTime(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function render() {
    clock.textContent = formatTime(remaining);
    clock.classList.toggle('running', running);
  }

  function setMode(mins) {
    if (running) return;
    totalSeconds = mins * 60;
    remaining = totalSeconds;
    modeButtons.forEach((b) => {
      const isActive = Number(b.dataset.mins) === mins;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    render();
  }

  function tick() {
    remaining -= 1;
    if (remaining <= 0) {
      remaining = 0;
      render();
      finishSession();
      return;
    }
    render();
  }

  function start() {
    running = true;
    startBtn.textContent = 'Pause';
    startBtn.classList.add('running');
    timerId = setInterval(tick, 1000);
    render();
  }

  function pause() {
    running = false;
    startBtn.textContent = 'Start';
    startBtn.classList.remove('running');
    clearInterval(timerId);
    render();
  }

  function reset() {
    pause();
    remaining = totalSeconds;
    render();
  }

  function finishSession() {
    pause();
    const task = taskInput.value.trim() || 'Untitled session';
    logSession(task, totalSeconds / 60);
    remaining = totalSeconds;
    render();
    if (Notification && Notification.permission === 'granted') {
      new Notification('Session complete', { body: task });
    }
  }

  function loadSessions() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveSessions(sessions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }

  function logSession(task, minutes) {
    const sessions = loadSessions();
    sessions.unshift({
      task,
      minutes,
      timestamp: new Date().toISOString(),
    });
    saveSessions(sessions);
    renderLog();
  }

  function isToday(isoString) {
    const d = new Date(isoString);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }

  function renderLog() {
    const sessions = loadSessions();
    logList.querySelectorAll('li:not(#logEmpty)').forEach((li) => li.remove());

    if (sessions.length === 0) {
      logEmpty.style.display = '';
    } else {
      logEmpty.style.display = 'none';
      sessions.forEach((s) => {
        const li = document.createElement('li');
        const time = new Date(s.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        li.innerHTML = `<span class="log-task">${escapeHtml(s.task)}</span><span class="log-meta">${s.minutes}m · ${time}</span>`;
        logList.appendChild(li);
      });
    }

    const todayCount = sessions.filter((s) => isToday(s.timestamp)).length;
    logCount.textContent = `${todayCount} today`;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  startBtn.addEventListener('click', () => {
    if (running) {
      pause();
    } else {
      if (Notification && Notification.permission === 'default') {
        Notification.requestPermission();
      }
      start();
    }
  });

  resetBtn.addEventListener('click', reset);

  modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => setMode(Number(btn.dataset.mins)));
  });

  render();
  renderLog();
})();
