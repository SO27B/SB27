# SO X27 Portfolio — Three.js + Realtime AI + Local Bridge

## Ajouts dans cette version
- Connexion préparée avec ton assistant vocal réel via un serveur local Python
- Fichier `sox27_bridge_server.py`
- Three.js ultra avancé : réseau neuronal 3D en arrière-plan
- IA navigateur temps réel : micro + console interactive
- Terminal web interactif
- AI Command Center
- Industrial Vision AI
- Live AI Projects
- Optimisation mobile

## Test portfolio
Si HTML simple :
- Open with Live Server sur `index.html`

Si Vite/React :
```powershell
npm.cmd install
npm.cmd run dev
```

## Tester la connexion réelle SO X27
Dans le dossier du portfolio, installe :
```powershell
pip install flask flask-cors
```

Puis lance :
```powershell
python sox27_bridge_server.py
```

Ensuite ouvre ton portfolio et va dans :
`Connexion assistant vocal réel`

Clique :
`Test bridge`

Si ça affiche ONLINE, la connexion navigateur → Python marche.

## Important
Un site web ne peut pas ouvrir directement tes programmes Windows pour des raisons de sécurité.
Le serveur `sox27_bridge_server.py` sert de pont local sécurisé.
