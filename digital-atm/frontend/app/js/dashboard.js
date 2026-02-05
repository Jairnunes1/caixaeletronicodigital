const panels = document.querySelectorAll('.panel');
const buttons = document.querySelectorAll('nav button');
const dashboardActions = document.querySelector('.dashboard-actions');
// Previne o reload ao submeter formulários

document.addEventListener("submit", (e) => {
  console.log("🚨 SUBMIT disparado por:", e.target);
  e.preventDefault();
  e.stopPropagation();
}, true);

// document.addEventListener("click", (e) => {
//   const btn = e.target.closest("button");
//   if (!btn) return;
//   console.log("Clique em botão:", btn.id || btn.textContent.trim(), "type=", btn.getAttribute("type"), "form=", btn.closest("form")?.className);
// }, true);
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
    window.location.href = "../../../index.html";
    return;
  }

  // Atualiza o nome no H1
  const userNameElement = document.getElementById("user-name");
  if (userNameElement) {
    userNameElement.textContent = `Bem-vindo, ${loggedUser}`;
  }

  // Busca saldo e histórico no backend
  try {
    const data = await getBalance(loggedUser);

    if (data.success) {
      const saldoEl = document.querySelector("#saldo");
      if (saldoEl) saldoEl.textContent = formatBRL(Number(data.balance));
    } else {
      alert(data.message);
    }

    const hist = await getHistory(loggedUser);
    if (hist && hist.success) {
      renderHistory(hist.transactions || []);
    }
  } catch (err) {
    console.error("Erro ao buscar dados do backend:", err);
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
async function getHistory(username) {
  const res = await fetch(`http://localhost:3000/history?username=${encodeURIComponent(username)}`);
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
      // alert(`Saldo atualizado com sucesso! Novo saldo: ${formatBRL(data.balance)}`);
      inputEl.value = ""; // opcional: limpa o campo
      console.log(data)
 
        addHistoryEntry(
          endpoint === "deposit" ? "Depósito" : "Saque",
          amount,
          data.balance,          // ✅ saldo atualizado vindo do backend
          new Date()
        );
    } else {
      alert(`Falha ao atualizar saldo: ${data.message}`);
    }
  } catch (error) {
    console.error("Erro ao conectar ao backend:", error);
    alert("Não consegui conectar ao backend (porta 3000). Confere se o Python está rodando.");
  }
}

if (confirmWithdraw) {
  confirmWithdraw.addEventListener("click", () => {
    sendTransaction("withdraw", inputSaque);
  });
}

if (confirmDeposit) {
  confirmDeposit.addEventListener("click", () => {
    sendTransaction("deposit", inputDeposito);
  });
}

function addHistoryEntry(type, amount, balance, date) {
  const empty = document.querySelector(".history-empty");
  if (empty) empty.remove();

  const historyList = document.querySelector(".transaction-history");
  if (!historyList) return;
  
  // Ajustes de estilo para o container do histórico
  historyList.style.padding = "0px";
  historyList.style.justifyContent = "normal";
  historyList.style.textAlign = "start";

  const isDeposit = type === "Depósito";

  const entry = document.createElement("li");
  entry.style.display = "block";
  entry.className = isDeposit ? "transaction-deposit" : "transaction-withdraw";

  entry.innerHTML = `
    <div class="transaction-info">
      <div class="transaction-header">
        <span class="material-symbols-outlined transaction-icon ${isDeposit ? "deposit-icon" : "withdraw-icon"}" aria-hidden="true">
          ${isDeposit ? "arrow_circle_up" : "arrow_circle_down"}
        </span>
        <div class="transaction-details">
          <p class="transaction-type">${type}</p>
          <p>${new Date(date).toLocaleString("pt-BR")}</p>
        </div>
      </div>
      <div class="transaction-values">
        <p class="${isDeposit ? "deposit-amount" : "withdraw-amount"}">
          ${isDeposit ? "+" : "-"} ${formatBRL(amount)}
        </p>
        <p>Saldo: ${formatBRL(balance)}</p>
      </div>
    </div>
  `;

  historyList.appendChild(entry);
}

function clearHistoryUI() {
  const historyList = document.querySelector(".transaction-history");
  if (!historyList) return;
  historyList.innerHTML = "";
}

function renderHistory(transactions = []) {
  clearHistoryUI();

  const historyList = document.querySelector(".transaction-history");
  if (!historyList) return;

  if (transactions.length === 0) {
    const li = document.createElement("li");
    li.className = "history-empty";
    li.textContent = "Nenhuma transação realizada";
    historyList.appendChild(li);
    return;
  }

  // Mostra mais recente primeiro
  const ordered = transactions.slice().reverse();

  ordered.forEach(tx => {
    const label = tx.type === "deposit" ? "Depósito" : "Saque";
    addHistoryEntry(label, tx.amount, tx.balanceAfter, new Date(tx.createdAt));
  });
}
