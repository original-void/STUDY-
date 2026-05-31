// auth.js — Firebase Auth + Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const db = getFirestore(app);

window.registerUser = async (e) => {
  e.preventDefault();
  const email = document.getElementById('reg-user').value.trim();
  const password = document.getElementById('reg-pass').value;
  const msg = document.getElementById('auth-msg');
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCred.user);
    await setDoc(doc(db, "users", userCred.user.uid), {
      email: email,
      createdAt: serverTimestamp(),
      completedSections: []
    });
    msg.textContent = 'Registered! Check your email to verify, then login.';
    msg.className = 'success';
    e.target.reset();
  } catch (error) {
    msg.textContent = error.message.replace('Firebase: ', '');
    msg.className = 'error';
  }
}

window.loginUser = async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-user').value.trim();
  const password = document.getElementById('login-pass').value;
  const msg = document.getElementById('auth-msg');
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    if (!userCred.user.emailVerified) {
      msg.textContent = 'Please verify your email first. Check inbox/spam.';
      msg.className = 'error';
      await signOut(auth);
      return;
    }
    window.location.href = 'index.html';
  } catch (error) {
    msg.textContent = 'Invalid email or password';
    msg.className = 'error';
  }
}

window.resetPassword = async (e) => {
  e.preventDefault();
  const email = document.getElementById('reset-email').value.trim();
  const msg = document.getElementById('auth-msg');
  try {
    await sendPasswordResetEmail(auth, email);
    msg.textContent = 'Password reset email sent! Check your inbox.';
    msg.className = 'success';
  } catch (error) {
    msg.textContent = error.message.replace('Firebase: ', '');
    msg.className = 'error';
  }
}

window.logout = async () => {
  await signOut(auth);
  window.location.href = 'login.html';
}

window.markSectionComplete = async (sectionId) => {
  const user = auth.currentUser;
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  await updateDoc(userRef, {
    completedSections: arrayUnion(sectionId)
  });
  const btn = document.getElementById(`complete-${sectionId}`);
  if (btn) {
    btn.textContent = '✓ Completed';
    btn.disabled = true;
  }
  loadProgress();
}

window.loadProgress = async () => {
  const user = auth.currentUser;
  if (!user) return;
  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (userDoc.exists()) {
    const data = userDoc.data();
    const completed = data.completedSections || [];
    const totalSections = 14;
    completed.forEach(id => {
      const btn = document.getElementById(`complete-${id}`);
      if (btn) {
        btn.textContent = '✓ Completed';
        btn.disabled = true;
      }
    });
    const percent = (completed.length / totalSections) * 100;
    const fill = document.getElementById('progress-fill');
    const text = document.getElementById('progress-text');
    if (fill) fill.style.width = `${percent}%`;
    if (text) text.textContent = `${completed.length}/${totalSections} sections completed`;
  }
}

onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  const isAuthPage = path.includes('login.html') || 
                     path.includes('register.html') ||
                     path.includes('forgot.html');
  if (user && isAuthPage) {
    window.location.href = 'index.html';
  } else if (!user && !isAuthPage) {
    window.location.href = 'login.html';
  }
  const userDisplay = document.getElementById('user-display');
  if (userDisplay && user) {
    userDisplay.textContent = user.email;
    loadProgress();
  }
});

window.toggleTheme = () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
}
if (localStorage.getItem('theme') === 'light') document.body.classList.add('light');
