import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, doc, onSnapshot }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const app = initializeApp({
  apiKey: "AIzaSyC45qeQaDabtKcp9UwlMNJc5g8tOkjqRh0",
  authDomain: "tempero-chef.firebaseapp.com",
  projectId: "tempero-chef",
  storageBucket: "tempero-chef.firebasestorage.app",
  messagingSenderId: "239363220823",
  appId: "1:239363220823:web:0da9af46344f54a0d34a12"
});

const db = getFirestore(app);

window.salvarPedidoNoPainel = async (pedido) => {
  try {
    await addDoc(collection(db, "pedidos"), {
      ...pedido,
      status: "novo",
      criadoEm: serverTimestamp()
    });
    return true;
  } catch (e) {
    console.error("Erro ao salvar pedido:", e);
    return false;
  }
};

// Escuta a lista de itens pausados em tempo real
onSnapshot(doc(db, "config", "pausados"), snap => {
  const ids = snap.exists() ? (snap.data().ids || []) : [];
  if (window.atualizarPausados) window.atualizarPausados(ids);
}, err => console.error("Erro ao ler pausados:", err));