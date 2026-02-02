from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
import json
import os


DATA_PATH = os.path.join(os.path.dirname(__file__), 'users.json')

def load_users():
    with open(DATA_PATH, 'r') as file:
        return json.load(file)

def save_users(users):
    with open(DATA_PATH, 'w') as file:
        json.dump(users, file,ensure_ascii=False, indent=2)


class Handler(BaseHTTPRequestHandler):
    def _send_json(self, status_code, data):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        # CORS (pra permitir o frontend chamar o backend)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode("utf-8"))

    def do_OPTIONS(self):
        # Preflight do CORS
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def _read_body_json(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length).decode("utf-8")
        if not body:
            return {}
        return json.loads(body)

    def do_POST(self):
        path = self.path
        data = self._read_body_json()
        users = load_users()

        if path == "/login":
            username = data.get("username")
            password = data.get("password")

            if username not in users:
                return self._send_json(401, {"success": False, "message": "Usuário não existe."})

            if users[username]["password"] != password:
                return self._send_json(401, {"success": False, "message": "Senha incorreta."})

            balance = users[username]["balance"]
            return self._send_json(200, {"success": True, "message": "Login OK", "balance": balance})

        if path == "/deposit":
            username = data.get("username")
            amount = float(data.get("amount", 0))

            if username not in users:
                return self._send_json(404, {"success": False, "message": "Usuário não encontrado."})

            if amount <= 0:
                return self._send_json(400, {"success": False, "message": "Valor inválido."})

            users[username]["balance"] += amount
            save_users(users)
            return self._send_json(200, {"success": True, "balance": users[username]["balance"]})

        if path == "/withdraw":
            username = data.get("username")
            amount = float(data.get("amount", 0))

            if username not in users:
                return self._send_json(404, {"success": False, "message": "Usuário não encontrado."})

            if amount <= 0:
                return self._send_json(400, {"success": False, "message": "Valor inválido."})

            if users[username]["balance"] < amount:
                return self._send_json(400, {"success": False, "message": "Saldo insuficiente."})

            users[username]["balance"] -= amount
            save_users(users)
            return self._send_json(200, {"success": True, "balance": users[username]["balance"]})

        return self._send_json(404, {"success": False, "message": "Rota não encontrada."})
    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        params = parse_qs(parsed.query)

        if path == "/balance":
            users = load_users()

            username = params.get("username", [None])[0]
            if not username:
                return self._send_json(400, {"success": False, "message": "Faltou username."})

            if username not in users:
                return self._send_json(404, {"success": False, "message": "Usuário não encontrado."})

            balance = users[username]["balance"]
            return self._send_json(200, {"success": True, "balance": balance})

        return self._send_json(404, {"success": False, "message": "Rota não encontrada."})
def run():
    server = HTTPServer(("localhost", 3000), Handler)
    print("Servidor rodando em http://localhost:3000")
    server.serve_forever()

if __name__ == "__main__":
    run()