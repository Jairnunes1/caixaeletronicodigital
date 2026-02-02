// Alert se login=sucess personalizado
function showToast(message, type = "success", ms = 2000) {
  const toast = document.querySelector("#toast");

  const icon =
    type === "success"
      ? "check_circle"
      : "error";

  toast.innerHTML = `
    <span class="material-symbols-outlined">${icon}</span>
    <span>${message}</span>
  `;

  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.className = "toast";
  }, ms);
}
// uso:



async function login(username, password) {
  const res = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  return data;
}

document.querySelector("#enviar").addEventListener("click", async () => {
  const username = document.querySelector("#user").value;
  const password = document.querySelector("#password").value;

  const result = await login(username, password);

  if (result.success) {
    localStorage.setItem("loggedUser", username);
    (showToast("Login bem-sucedido!", "success"));
    console.log("Usuário logado:", username);
    setTimeout(() => {
      window.location.href = "digital-atm/frontend/app/dashboard.html";
    }, 1500);
  } else {
    showToast("Falha no login!", "error");
      console.log("Falha no login:", result.message);
  }
});
