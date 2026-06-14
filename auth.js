const firebaseConfig = {
  apiKey: "AIzaSyBjPfuz8DdGgEnRsD9nXeka2yN7v_oh3jk",
  authDomain: "junior-study.firebaseapp.com",
  projectId: "junior-study",
  storageBucket: "junior-study.firebasestorage.app",
  messagingSenderId: "942218434406",
  appId: "1:942218434406:web:8e95fc80fc28c79fe01aa7"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
document.body.style.display = 'none';

auth.onAuthStateChanged((user) => {
  if (!user) window.location.href = 'index.html';
  else {
    document.body.style.display = 'block';
    const userDisplay = document.getElementById('user-display');
    if (userDisplay) userDisplay.textContent = user.displayName || user.email.split('@')[0];
  }
});

window.logout = function() {
  auth.signOut().then(() => window.location.href = 'index.html');
}
