import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAqRHK4gAbIuvRPy_eqAehewDxc7vUSip0",
  authDomain: "nitinportfolio-9f2f1.firebaseapp.com",
  databaseURL: "https://nitinportfolio-9f2f1-default-rtdb.firebaseio.com",
  projectId: "nitinportfolio-9f2f1",
  storageBucket: "nitinportfolio-9f2f1.firebasestorage.app",
  messagingSenderId: "969767328023",
  appId: "1:969767328023:web:aa72ae002d9c611ef8ff52",
  measurementId: "G-KEQQCJXS0R"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const form = document.getElementById("contactForm");
const statusElement = document.getElementById("formStatus");

if (form && statusElement) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const email = document.getElementById("email").value.trim();
    const reason = document.getElementById("reason").value.trim();
    const message = document.getElementById("message").value.trim();
    const submitButton = form.querySelector('button[type="submit"]');

    if (!form.reportValidity()) return;

    if (name.length < 2 || name.length > 100) {
      statusElement.textContent = "Please enter a name between 2 and 100 characters.";
      return;
    }

    if (!/^[+0-9() -]{7,20}$/.test(mobile)) {
      statusElement.textContent = "Please enter a valid mobile number.";
      return;
    }

    if (email.length > 254 || reason.length > 100 || message.length > 5000) {
      statusElement.textContent = "One or more fields are too long.";
      return;
    }

    if (submitButton) submitButton.disabled = true;
    statusElement.textContent = "Sending your message...";

    try {
      const newMessageRef = push(ref(db, "contactMessages"));
      await set(newMessageRef, {
        name,
        mobile,
        email,
        reason,
        message,
        createdAt: serverTimestamp()
      });

      statusElement.textContent = "Thank you! Your message has been sent successfully.";
      form.reset();
    } catch (error) {
      console.error("Firebase submission error:", error);
      console.error("Firebase error code:", error?.code);
      statusElement.textContent =
        error?.code === "PERMISSION_DENIED"
          ? "Submission blocked by Firebase rules. Please check Realtime Database Rules."
          : "Unable to send your message. Please try again.";
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}
