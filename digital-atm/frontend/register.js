// register.js

const DASH_URL = `${location.origin}/digital-atm/frontend/app/dashboard.html`;

function showToast(message, type = "success", ms = 2000) {
  const toast = document.querySelector("#toast");
  if (!toast) {
    alert(message);
    return;
  }

  const icon = type === "success" ? "check_circle" : "error";

  toast.innerHTML = `
    <span class="material-symbols-outlined">${icon}</span>
    <span>${message}</span>
  `;

  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.className = "toast";
  }, ms);
}

async function registerUser(username, password, balance) {
  const res = await fetch("http://localhost:3000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, balance })
  });

  // Se o backend cair ou retornar HTML, isso evita crash
  try {
    return await res.json();
  } catch {
    return { success: false, message: "Resposta inválida do servidor." };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // ✅ Se já estiver logado, sai do registro e vai pro dashboard
  const logged = localStorage.getItem("loggedUser");
  if (logged) {
    location.replace(DASH_URL);
    return;
  }

  const form = document.querySelector(".form-content");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const username = document.querySelector("#user")?.value.trim();
    const password = document.querySelector("#password")?.value;
    const confirm  = document.querySelector("#confirm-password")?.value;
    const balance  = Number(document.querySelector("#balance")?.value);

    if (!username) return showToast("Digite um usuário válido.", "error");
    if (!password || password.length < 6) return showToast("Senha precisa ter no mínimo 6 caracteres.", "error");
    if (password !== confirm) return showToast("As senhas não conferem.", "error");
    if (!Number.isFinite(balance) || balance < 0) return showToast("Saldo inicial inválido.", "error");

    try {
      const result = await registerUser(username, password, balance);

      if (result.success) {
        // ✅ salva ANTES (se o Live Server recarregar, no próximo load já entra)
        localStorage.setItem("loggedUser", username);

        showToast("Cadastro realizado! Entrando no dashboard...", "success", 1200);

        // ✅ tenta entrar já (sem setTimeout; é mais resiliente)
        location.replace(DASH_URL);

      } else {
        showToast(result.message || "Falha ao cadastrar.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Não consegui conectar ao backend (porta 3000).", "error");
    }
  });
});
