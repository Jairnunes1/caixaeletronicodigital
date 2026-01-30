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
    (alert("Login bem-sucedido!"));
    console.log("Usuário logado:", username);
    window.location.href = "digital-atm/frontend/app/dashboard.html";
  } else {
    alert(result.message);
      console.log("Falha no login:", result.message);
  }
});
