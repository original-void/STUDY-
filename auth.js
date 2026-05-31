import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjPfuz8DdGgEnRsD9nXeka2yN7v_oh3jk",
  authDomain: "junior-study.firebaseapp.com",
  projectId: "junior-study",
  storageBucket: "junior-study.firebasestorage.app",
  messagingSenderId: "942218434406",
  appId: "1:942218434406:web:8e95fc80fc28c79fe01aa7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Auth guard - runs on every page load
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // Not logged in, redirect to login
    window.location.href = 'login.html';
  } else {
    // Logged in, show the page
    document.body.style.display = 'block';
    const userDisplay = document.getElementById('user-display');
    if (userDisplay) userDisplay.textContent = user.email || 'Student';
  }
});

// Global logout function for the button
window.logout = function() {
  signOut(auth).then(() => {
    window.location.href = 'login.html';
  });
}
