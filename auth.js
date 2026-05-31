// Firebase v10 compat - works with your index.html
const firebaseConfig = {
  apiKey: "AIzaSyBjPfuz8DdGgEnRsD9nXeka2yN7v_oh3jk",
  authDomain: "junior-study.firebaseapp.com",
  projectId: "junior-study",
  storageBucket: "junior-study.firebasestorage.app",
  messagingSenderId: "942218434406",
  appId: "1:942218434406:web:8e95fc80fc28c79fe01aa7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export auth globally so index.html can use it
const auth = firebase.auth();
window.auth = auth;
