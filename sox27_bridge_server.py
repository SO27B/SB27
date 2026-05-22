"""
sox27_bridge_server.py
Petit serveur local pour connecter ton portfolio web à SO X27.

Installation :
    pip install flask flask-cors

Lancement :
    python sox27_bridge_server.py

Ensuite dans le portfolio :
    section "Connexion assistant vocal réel"
    clique "Test bridge"

Important :
- Un site web GitHub/Netlify ne peut pas lancer directement un programme Windows.
- Ce serveur local sert de pont sécurisé entre navigateur et ton assistant Python.
"""

from __future__ import annotations

import os
import sys
import subprocess
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS

BASE_DIR = Path(__file__).resolve().parent
MAIN_FILE =Path (r"C:\Users\sofia\so_x27\main.py")

app = Flask(__name__)
CORS(app)


@app.get("/status")
def status():
    return jsonify({
        "ok": True,
        "message": "SO X27 local bridge online",
        "main_file_exists": MAIN_FILE.exists(),
    })


@app.post("/command")
def command():
    data = request.get_json(silent=True) or {}
    cmd = str(data.get("command", "")).strip().lower()

    if not cmd:
        return jsonify({"ok": False, "message": "No command provided"}), 400

    if cmd in ("status", "ping"):
        return jsonify({"ok": True, "message": "SO X27 bridge ready"})

    if cmd in ("launch", "lance sox27", "sox27", "open_sox27"):
        if not MAIN_FILE.exists():
            return jsonify({"ok": False, "message": f"main.py not found at {MAIN_FILE}"}), 404
        subprocess.Popen([sys.executable, str(MAIN_FILE)], cwd=str(BASE_DIR))
        return jsonify({"ok": True, "message": "SO X27 launched"})

    if cmd in ("open_chrome", "ouvre chrome", "chrome"):
        if os.name == "nt":
            subprocess.Popen("start chrome", shell=True)
        else:
            subprocess.Popen(["xdg-open", "https://google.com"])
        return jsonify({"ok": True, "message": "Chrome command sent"})

    # Ici tu peux brancher ton vrai routeur de commandes SO X27.
    # Exemple futur :
    # from main import handle_text_command
    # result = handle_text_command(cmd)

    return jsonify({
        "ok": True,
        "message": f"Command received by local bridge: {cmd}",
        "note": "Connect this route to your SO X27 command router for real actions."
    })


if __name__ == "__main__":
    print("SO X27 Local Bridge running on http://127.0.0.1:8765")
    app.run(host="127.0.0.1", port=8765, debug=False)
