const btn = document.querySelector('#enviar');
btn.addEventListener('click', function(event) {
   event.preventDefault();
   const user = document.querySelector('#user').value;
   const password = document.querySelector('#password').value;
   console.table({ user, password });

});