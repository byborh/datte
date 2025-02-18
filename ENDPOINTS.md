Voici la liste des endpoints de votre projet Datte, regroupée par ressource :  

### **1. Authentification (AuthToken)**  
- **POST** `/login` — Connexion (public)  
- **POST** `/logout` — Déconnexion (ADMIN, MANAGER, USER)  
- **GET** `/tokens/user/:userId` — Obtenir les tokens d’un utilisateur (ADMIN, MANAGER)  
- **DELETE** `/tokens/user/:userId` — Supprimer les tokens d’un utilisateur (ADMIN, MANAGER)  
- **GET** `/tokens` — Obtenir tous les tokens (ADMIN)  
- **DELETE** `/tokens/:authTokenId` — Supprimer un token spécifique (ADMIN)  

---

### **2. Utilisateurs (Users)**  
- **GET** `/:id` — Obtenir un utilisateur par ID (ADMIN, MANAGER, USER)  
- **GET** `/` — Obtenir tous les utilisateurs (ADMIN, MANAGER)  
- **POST** `/` — Créer un utilisateur (public)  
- **PATCH** `/:id` — Modifier un utilisateur (ADMIN, MANAGER, USER)  
- **DELETE** `/:id` — Supprimer un utilisateur (ADMIN, MANAGER, USER)  

---

### **3. Rôles (Roles)**  
- **GET** `/:id` — Obtenir un rôle par ID (ADMIN, MANAGER)  
- **GET** `/` — Obtenir tous les rôles (ADMIN, MANAGER)  
- **POST** `/` — Créer un rôle (ADMIN)  
- **PATCH** `/:id` — Modifier un rôle (ADMIN)  
- **DELETE** `/:id` — Supprimer un rôle (ADMIN)  

---

### **4. Permissions**  
- **GET** `/:id` — Obtenir une permission par ID (ADMIN, MANAGER)  
- **GET** `/` — Obtenir toutes les permissions (ADMIN, MANAGER)  
- **POST** `/` — Créer une permission (ADMIN)  
- **PATCH** `/:id` — Modifier une permission (ADMIN)  
- **DELETE** `/:id` — Supprimer une permission (ADMIN)  

---

### **5. Associations Rôles-Permissions (RolePermissions)**  
- **GET** `/:role_id/:permission_id` — Obtenir une permission spécifique d’un rôle (ADMIN)  
- **GET** `/` — Obtenir toutes les associations rôle-permission (ADMIN)  
- **POST** `/` — Créer une association rôle-permission (ADMIN)  

---

### **6. Associations Utilisateurs-Rôles (UserRoles)**  
- **GET** `/:user_id/:role_id` — Obtenir un rôle spécifique d’un utilisateur (ADMIN, MANAGER)  
- **GET** `/` — Obtenir toutes les associations utilisateur-rôle (ADMIN, MANAGER)  
- **POST** `/` — Créer une association utilisateur-rôle (ADMIN, MANAGER)  

---

Chaque endpoint est protégé par des rôles spécifiques via `authMiddleware`, garantissant un contrôle d'accès précis.