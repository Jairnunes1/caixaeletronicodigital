let usuarios = JSON.parse(localStorage.getItem("usuarios"))
// se não existir usuarios no localStorage, criar um array com dois usuarios
// users padrões para fins de teste
if (usuarios) {
   usuarios = [
      {
         usuario: "usuario1",
         senha: "senha123",
         saldo: "500"
      },
      {
         usuario: "usuario2",
         senha: "senha456",
         saldo: "1000"

      }
   ];
}
localStorage.setItem("usuarios", JSON.stringify(usuarios));
console.log(usuarios);
usuarios.forEach(element => {
   console.log(element.usuario);
});
const btn = document.querySelector('#enviar');

btn.addEventListener('click', function(event) {
   event.preventDefault();

   const user = document.querySelector('#user').value;
   const password = document.querySelector('#password').value;
   const balance = document.querySelector('#balance').value;

   cadastrarUsuario(user, password, balance);

   console.table({ user, password });
});


// função para cadastrar usuario
function cadastrarUsuario(usuario, senha, saldo) {

   let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

   // veriticar se existe o usuario , essa é interessante apenas para aba de registro.
   const existe = usuarios.some(u => u.usuario === usuario);
      if (existe) {
         alert("Usuário já existe. Escolha outro nome de usuário.");
      return;
  }
    const novoUsuario = {
    usuario: usuario,
    senha: senha,
    saldo: saldo
  };

  usuarios.push(novoUsuario);

  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  console.log(usuarios);
  alert("Usuário cadastrado com sucesso");
  window.location.href = "../../frontend/app/dasboard.html";
}
