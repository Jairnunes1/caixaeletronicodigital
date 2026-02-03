const panels = document.querySelectorAll('.panel');
const buttons = document.querySelectorAll('nav button');
const dashboardActions = document.querySelector('.dashboard-actions');

// Alert personalizado
// function showToast(message, type = "success", ms = 2000) {
//   const toast = document.querySelector("#toast");

//   const icon =
//     type === "success"
//       ? "check_circle"
//       : "error";

//   toast.innerHTML = `
//     <span class="material-symbols-outlined">${icon}</span>
//     <span>${message}</span>
//   `;

//   toast.className = `toast show ${type}`;

//   setTimeout(() => {
//     toast.className = "toast";
//   }, ms);
// }

// Manipula a navegação entre painéis
buttons.forEach(button => {
  button.addEventListener('click', panelActive);
});

document.addEventListener("DOMContentLoaded", async () => {
const loggedUser = localStorage.getItem("loggedUser");

  // Se entrou no dashboard sem login, volta pro index
  if (!loggedUser) {
    // O index.html está na raiz do projeto; subir 3 níveis até a raiz
    window.location.href = "../../../index.html";
    return;
  }

  // Atualiza o nome no H1
  const userNameElement = document.getElementById("user-name");
  if (userNameElement) {
    userNameElement.textContent = `Bem-vindo, ${loggedUser}`;
  }

  // Busca saldo no backend
  try {
    const data = await getBalance(loggedUser);

    if (data.success) {
      const saldoEl = document.querySelector("#saldo");
      if (saldoEl) saldoEl.textContent = formatBRL(Number(data.balance));
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error("Erro ao buscar saldo:", err);
    alert("Não consegui conectar ao backend (porta 3000). Confere se o Python está rodando.");
  }
});

function panelActive(event) {
  panels.forEach(panel => panel.classList.remove('active'));
  buttons.forEach(btn => btn.classList.remove('nav-active'));

  const button = event.currentTarget;
  const targetId = button.dataset.target;
  const section = document.getElementById(targetId);

  button.classList.add('nav-active');
  if (section) section.classList.add('active');
  
}

async function getBalance(username) {
  const res = await fetch(`http://localhost:3000/balance?username=${encodeURIComponent(username)}`);
  return await res.json();
}

function formatBRL(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Botão Sair: limpa sessão e volta para a tela de login
const exitButton = document.querySelector('.button.exit') || document.querySelector('.exit');
if (exitButton) {
  exitButton.addEventListener('click', () => {
    localStorage.removeItem('loggedUser');
    window.location.href = '../../../index.html';
  });
}

// Botões e input Saques rápidos:
function initQuickWithdraw() {
  const buttons = document.querySelectorAll('.quick-values button');

  if (buttons.length === 0) return;

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const targetSelector = button.dataset.target;
      const value = button.dataset.value;

      const input = document.querySelector(targetSelector);
      if (!input) return;

      input.value = value;
    });
  });
}
initQuickWithdraw();

const inputSaque = document.getElementById("withdraw-value");
const inputDeposito = document.getElementById("deposit-value");
const confirmWithdraw = document.querySelector("#confirmWithdraw");
const confirmDeposit = document.querySelector("#confirmDeposit");

async function sendTransaction(endpoint, inputEl) {
  const username = localStorage.getItem("loggedUser"); // pega sempre atual
  const amount = Number(inputEl.value);

  if (!username) {
    alert("Usuário não autenticado.");
    return;
  }

  if (!amount || amount <= 0) {
    alert("Digite um valor válido.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, amount })
    });

    const data = await response.json();

    if (data.success) {
      alert(`Saldo atualizado com sucesso! Novo saldo: ${formatBRL(data.balance)}`);
      inputEl.value = ""; // opcional: limpa o campo
    } else {
      alert(`Falha ao atualizar saldo: ${data.message}`);
    }
  } catch (error) {
    console.error("Erro ao conectar ao backend:", error);
    alert("Não consegui conectar ao backend (porta 3000). Confere se o Python está rodando.");
  }
}

confirmWithdraw.addEventListener("click", () => {
  sendTransaction("withdraw", inputSaque);
});

confirmDeposit.addEventListener("click", () => {
  sendTransaction("deposit", inputDeposito);
});