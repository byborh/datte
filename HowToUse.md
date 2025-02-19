# 📖 Guide d'utilisation de l'application  

## 🚀 Pré-requis  
Avant de démarrer, assure-toi d'avoir installé :  
- **Docker & Docker Compose**  
- **Node.js** (si besoin de lancer l'application en local sans Docker)  
- **Make** (pour utiliser le `Makefile`)  

---

## 🛠️ Workflow de Développement  

### 1️⃣ Configuration de l'environnement  
Renomme le fichier `.env.example` en `.env` et adapte les variables si nécessaire :  
```bash
cp .env.example .env
```
💡 Assure-toi que les valeurs des variables correspondent à ton environnement local.

### 2️⃣ Démarrer l'environnement de développement  
```bash
make dev
```
💡 Cela va :  
- Construire l'image Docker de développement  
- Lancer un conteneur avec les variables d'environnement définies dans `.env`  
- Exposer l'application sur `localhost:3000`  

### 3️⃣ Démarrer MySQL séparément (optionnel si déjà lancé)  
Si tu veux juste lancer MySQL indépendamment :  
```bash
make mysql
```

### 4️⃣ Lancer l'application en dehors de Docker  
Si tu veux exécuter le backend en local (sans Docker), utilise :  
```bash
npm run dev
```
💡 Cela lance l'application avec `ts-node` et `nodemon`.

### 5️⃣ Vérifier les logs et attacher au conteneur  
```bash
docker logs -f datte-node-dev
```
ou attacher directement :  
```bash
make attach
```

### 6️⃣ Nettoyer les conteneurs après le développement  
```bash
make clean
```
💡 Si tu veux supprimer **tous** les conteneurs liés à l'application :  
```bash
make clean-all
```

---

## 🚢 Workflow de Production  

### 1️⃣ Configuration de l'environnement  
Avant de lancer l'application en production, assure-toi d'avoir un fichier `.env` correctement configuré :  
```bash
cp .env.example .env
```

### 2️⃣ Build et exécution en production avec Docker  
```bash
make prod
```
💡 Cela va :  
- Construire l'image de production (`Dockerfile.prod`)  
- Démarrer l'application avec les variables définies dans `.env`  
- Exposer l’application sur `localhost:${PORT}`  

### 3️⃣ Lancer l'application en production avec `docker-compose`  
Si tu veux utiliser `docker-compose` directement :  
```bash
docker-compose up --build
```
💡 Ajoute `-d` pour le lancer en arrière-plan :  
```bash
docker-compose up --build -d
```

### 4️⃣ Vérifier l'état des conteneurs  
```bash
docker ps
```

### 5️⃣ Vérifier les logs  
```bash
docker logs -f datte-node
```

### 6️⃣ Mettre à jour l'application en production  
Si tu veux rebuild l'image et redémarrer :  
```bash
make push
docker-compose down && docker-compose up -d
```

### 7️⃣ Nettoyer les conteneurs après utilisation  
```bash
make clean
```

---

## 📌 Autres Commandes Utiles  

| Commande | Description |
|----------|------------|
| `make version` | Affiche la version actuelle (commit hash). |
| `make tag-latest` | Tag l'image Docker avec `latest`. |
| `make tag-version` | Tag l'image avec la version actuelle (commit hash). |
| `make push` | Build, tag et push l'image Docker vers le registre. |
| `make info` | Affiche les détails du conteneur en cours. |
