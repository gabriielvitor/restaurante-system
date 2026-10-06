import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, doc, onSnapshot }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const app = initializeApp({
  config do firabase
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
