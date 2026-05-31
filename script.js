let completedSections = new Set();
const totalSections = 25;
const PROGRESS_KEY = 'structures_progress';
const THEME_KEY = 'structures_theme';
let currentUser = null;

// 1. AUTH GUARD: Redirect if not logged in
auth.onAuthStateChanged((user) => {
  if (user) {
    currentUser = user;
    const displayName = user.displayName || user.email.split('@')[0];
    document.getElementById('user-display').innerText = displayName;
    loadProgress(user.uid);
  } else {
    // Not logged in → go to login.html
    window.location.href = 'login.html';
  }
});

// 2. LOAD THEME on page load
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'dark') document.body.classList.add('dark-theme');
});

function loadProgress(uid) {
  const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY + '_' + uid) || '[]');
  completedSections = new Set(saved);
  saved.forEach(id => {
    const btn = document.getElementById('complete-' + id);
    if (btn) {
      btn.innerText = 'Completed ✓';
      btn.classList.add('completed');
    }
  });
  updateProgress();
}

function markSectionComplete(id) {
  if (completedSections.has(id) ||!currentUser) return;
  completedSections.add(id);
  const btn = document.getElementById('complete-' + id);
  btn.innerText = 'Completed ✓';
  btn.classList.add('completed');
  saveProgress();
  updateProgress();
}

function updateProgress() {
  const percent = (completedSections.size / totalSections) * 100;
  document.getElementById('progress-fill').style.width = percent + '%';
  document.getElementById('progress-text').innerText = completedSections.size + '/' + totalSections + ' sections completed';
}

function saveProgress() {
  if (!currentUser) return;
  localStorage.setItem(PROGRESS_KEY + '_' + currentUser.uid, JSON.stringify([...completedSections]));
}

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  localStorage.setItem(THEME_KEY, isDark? 'dark' : 'light');
}

// 3. REAL LOGOUT - this replaces your alert
async function logout() {
  if (!confirm('Logout? Your progress is saved.')) return;
  try {
    await auth.signOut(); // This actually logs out of Firebase
    // onAuthStateChanged will auto-redirect to login.html
  } catch (error) {
    alert('Logout failed: ' + error.message);
  }
}
