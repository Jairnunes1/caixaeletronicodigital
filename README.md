# 💳 Caixa Eletrônico Digital

Aplicação full stack que simula um sistema de caixa eletrônico, permitindo que usuários realizem operações bancárias básicas através de uma interface web integrada a um backend em Python.

---

## 🚀 Funcionalidades

* 🔐 Cadastro e login de usuários
* 💾 Persistência de sessão (localStorage)
* 💰 Depósito de valores
* 💸 Saque de valores
* 📊 Consulta de saldo em tempo real
* 📜 Histórico de transações
* 🔄 Atualização dinâmica da interface (sem reload)
* 🔔 Feedback visual com notificações (toast)

---

## 🛠️ Tecnologias utilizadas

### Backend

* Python
* Servidor HTTP nativo
* Armazenamento em JSON

### Frontend

* HTML5
* CSS3 (layout responsivo e estilização moderna)
* JavaScript (ES6+)
* Fetch API (requisições HTTP)

---

## 📂 Estrutura do projeto

```
📁 projeto/
├── digital-atm
  └── backend
    ├── main.py
    ├── users.json
  └── frontend
    └── app
      └── js
        ├── dashboard.js
      └── style
        ├── base.css
        ├── components.css
        ├── layout.css
      ├── dasboard.html
    └── imgs
    └── styles
        ├── auth.css
        ├── base.css
        ├── login.css
        ├── register.css
    ├── register.html
    ├── register.js
    ├── script.js
  ├── README.md
  ├── index.html

```

---

## ⚙️ Como executar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/Jairnunes1/caixaeletronicodigital.git
```

### 2. Execute o servidor Python

```bash
python main.py
```

### 3. Acesse no navegador

```
http://localhost:8000
```

---

## 🔄 Como funciona

* O frontend envia requisições HTTP para o backend utilizando `fetch`
* O backend processa os dados e salva as informações no arquivo `users.json`
* As respostas são retornadas em formato JSON
* A interface é atualizada dinamicamente com base nas respostas

---

## 🎯 Objetivo do projeto

Este projeto foi desenvolvido com o objetivo de praticar:

* Integração entre frontend e backend
* Manipulação de requisições HTTP
* Estruturação de aplicações full stack
* Organização de código
* Experiência do usuário (UX/UI)

---

## 📸 Preview

<p>
  <img src="https://i.ibb.co/d9jKBQw/deposit.png" width="300" border="0"/>
  <img src="https://i.ibb.co/TB3qqNFx/history.png" width="300" border="0"/>
  <img src="https://i.ibb.co/23wMVrp9/cadastro.png" alt="cadastro" border="0" width="300">
  <img src="https://i.ibb.co/pjc3Fd2S/login.png" alt="login" border="0" width="300">
</p>

## 📌 Melhorias futuras

* 🔒 Autenticação com JWT
* 🗄️ Integração com banco de dados (SQLite/PostgreSQL)
* 🌐 Deploy da aplicação
* 👤 Sistema de múltiplos usuários com isolamento de dados
* 📱 Melhorias na responsividade mobile

---

## 👨‍💻 Autor

Desenvolvido por Jair Nunes 🚀

---

## 📄 Licença

Este projeto é de uso educacional.
