# 🚀 Guide de Déploiement Manuel - Laravel sur o2switch

## 📋 Informations de Déploiement

**Hébergeur** : o2switch  
**Dossier** : `ngokeng`  
**Sous-domaine** : `ngokeng.cdwfs.net`  
**Base de données** : `cdiu8226_ngokeng`  
**Utilisateur MySQL** : `cdiu8226_ngokeng`  
**Mot de passe MySQL** : `ngokeng1@`  
**Dépôt GitHub** : `https://github.com/Ngokeng-Rayan/Gestion-produits-avec-pipeline`  

**Stack Technique** :
- PHP 8.2
- Laravel 12
- MySQL 8.0
- Composer 2.x

---

## 📋 Table des Matières
1. [Accès au Terminal o2switch](#1-accès-au-terminal-o2switch)
2. [Architecture du Déploiement](#2-architecture-du-déploiement)
3. [Localiser ton Dossier](#3-localiser-ton-dossier)
4. [Vérifier les Dépendances](#4-vérifier-les-dépendances)
5. [Cloner le Projet depuis GitHub](#5-cloner-le-projet-depuis-github)
6. [Configuration de l'Application](#6-configuration-de-lapplication)
7. [Configuration de la Base de Données](#7-configuration-de-la-base-de-données)
8. [Permissions et Sécurité](#8-permissions-et-sécurité)
9. [Optimisations Production](#9-optimisations-production)
10. [Tests et Vérification](#10-tests-et-vérification)
11. [Maintenance et Mises à Jour](#11-maintenance-et-mises-à-jour)
12. [Dépannage](#12-dépannage)

---

## 1. Accès au Terminal o2switch

### Ouvrir le Terminal Web

1. Connecte-toi à ton **cPanel o2switch**
2. Cherche l'icône **"Terminal"** dans la section "Avancé"
3. Clique dessus pour ouvrir le terminal web

Tu devrais voir quelque chose comme :
```
[cdiu8226@server ~]$
```

### Vérifier où tu es

```bash
# Afficher le répertoire actuel
pwd
# Devrait afficher : /home/cdiu8226

# Lister les fichiers
ls -la
```

---

## 2. Architecture du Déploiement

### Structure o2switch

```
/home/cdiu8226/
├── public_html/                ← Dossier racine web partagé
│   ├── etudiant1/
│   ├── etudiant2/
│   └── ngokeng/                ← TON DOSSIER
│       ├── app/
│       ├── bootstrap/
│       ├── config/
│       ├── database/
│       ├── public/             ← Point d'entrée web (index.php)
│       ├── routes/
│       ├── storage/
│       ├── .env
│       ├── composer.json
│       └── ...
│
├── MySQL
│   └── cdiu8226_ngokeng        ← Ta base de données
│
└── Apache
    └── ngokeng.cdwfs.net → /home/cdiu8226/public_html/ngokeng/public
```

**Important** : Le sous-domaine `ngokeng.cdwfs.net` doit pointer vers le dossier `public/` de ton projet Laravel.

---

## 3. Localiser ton Dossier

### Trouver le Chemin Exact

```bash
# Afficher où tu es
pwd
# Devrait afficher : /home/cdiu8226

# Aller dans public_html
cd public_html

# Lister les dossiers
ls -la

# Aller dans ton dossier
cd ngokeng

# Vérifier le chemin complet
pwd
# Devrait afficher : /home/cdiu8226/public_html/ngokeng
```

### Vérifier le Contenu

```bash
# Voir ce qu'il y a dans ton dossier
ls -la

# Si le dossier est vide ou contient juste un index.html, c'est parfait !
```

---

## 4. Vérifier les Dépendances

### Vérifier les Versions Installées

```bash
# Vérifier PHP (o2switch a généralement PHP 8.2+)
php -v

# Vérifier Composer
composer --version

# Vérifier Git
git --version

# Vérifier MySQL
mysql --version
```

**Sur o2switch, tout est normalement déjà installé !** ✅

---

## 5. Cloner le Projet depuis GitHub

### Étape 1 : Aller dans ton Dossier

```bash
# Depuis le terminal o2switch
cd ~/public_html/ngokeng

# Vérifier où tu es
pwd
# Devrait afficher : /home/cdiu8226/public_html/ngokeng
```

### Étape 2 : Cloner le Projet

**Cas A : Le dossier est vide**

```bash
# Cloner directement dans le dossier actuel
git clone https://github.com/Ngokeng-Rayan/Gestion-produits-avec-pipeline.git

# Le point (.) signifie "cloner dans le dossier actuel"
```

**Cas B : Le dossier contient déjà des fichiers (index.html, etc.)**

```bash
# Sauvegarder les fichiers existants
mkdir ../backup_ngokeng
mv * ../backup_ngokeng/ 2>/dev/null

# Cloner le projet
git clone https://github.com/Ngokeng-Rayan/Gestion-produits-avec-pipeline.git .
```

### Étape 3 : Vérifier le Clonage

```bash
# Lister les fichiers
ls -la

# Tu devrais voir :
# app/
# bootstrap/
# config/
# database/
# public/
# routes/
# storage/
# composer.json
# .env.example
# etc.
```

---

## 6. Configuration de l'Application

### Installer les Dépendances Composer

```bash
# Tu es dans /home/cdiu8226/public_html/ngokeng
cd ~/public_html/ngokeng

# Installer les dépendances (production uniquement)
composer install --no-dev --optimize-autoloader

# Si erreur de mémoire
php -d memory_limit=-1 $(which composer) install --no-dev --optimize-autoloader
```

### Créer le Fichier .env

```bash
# Copier le fichier exemple
cp .env.example .env

# Éditer le fichier .env
nano .env
```

**Configuration du .env :**

```env
APP_NAME="Gestion Produit API"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://ngokeng.cdwfs.net

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=cdiu8226_ngokeng
DB_USERNAME=cdiu8226_ngokeng
DB_PASSWORD=ngokeng1@

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MAIL_MAILER=log
```

**Sauvegarder et quitter :**
- `Ctrl + O` (sauvegarder)
- `Entrée` (confirmer)
- `Ctrl + X` (quitter)

### Générer la Clé d'Application

```bash
php artisan key:generate

# Vérifier que APP_KEY est maintenant rempli dans .env
cat .env | grep APP_KEY
```

---

## 7. Configuration de la Base de Données

### Se Connecter à MySQL

```bash
# Connexion avec ton utilisateur
mysql -u cdiu8226_ngokeng -p

# Entrer le mot de passe : ngokeng1@
```

### Vérifier la Base de Données

```sql
-- Voir les bases de données disponibles
SHOW DATABASES;

-- Utiliser ta base
USE cdiu8226_ngokeng;

-- Voir les tables (devrait être vide)
SHOW TABLES;

-- Quitter MySQL
EXIT;
```

### Exécuter les Migrations

```bash
# Aller dans ton projet
cd ~/public_html/ngokeng

# Exécuter les migrations
php artisan migrate --force

# Vérifier que les tables sont créées
mysql -u cdiu8226_ngokeng -p cdiu8226_ngokeng -e "SHOW TABLES;"
# Entrer le mot de passe : ngokeng1@
```

### Peupler la Base de Données (Optionnel)

```bash
# Exécuter les seeders
php artisan db:seed --force

# Ou tout réinitialiser et peupler
php artisan migrate:fresh --seed --force
```

---

## 8. Permissions et Sécurité

### Définir les Permissions Correctes

```bash
# Aller dans ton projet
cd ~/public_html/ngokeng

# Permissions pour storage et bootstrap/cache
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Vérifier les permissions
ls -la storage/
ls -la bootstrap/cache/
```

### Sécuriser le Fichier .env

```bash
# Le .env ne doit JAMAIS être accessible depuis le web
chmod 600 .env

# Vérifier
ls -la .env
```

### Vérifier le Fichier .htaccess

Le fichier devrait déjà exister dans `public/` :

```bash
cat public/.htaccess
```

**Contenu attendu :**

```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

---

## 9. Optimisations Production

### Mettre en Cache les Configurations

```bash
cd ~/public_html/ngokeng

# Mettre en cache la configuration
php artisan config:cache

# Mettre en cache les routes
php artisan route:cache

# Mettre en cache les vues
php artisan view:cache

# Optimiser l'autoloader
composer dump-autoload --optimize
```

---

## 10. Tests et Vérification

### Vérifier la Connexion à la Base de Données

```bash
php artisan tinker
```

```php
// Dans tinker
DB::connection()->getPdo();
// Si pas d'erreur, c'est bon !

exit
```

### Tester l'Application

**1. Tester depuis le navigateur :**

```
https://ngokeng.cdwfs.net
```

Tu devrais voir la page d'accueil Laravel.

**2. Tester l'API :**

```
https://ngokeng.cdwfs.net/api/products
```

Devrait retourner une erreur 401 (Unauthenticated) - c'est normal, l'API nécessite une authentification !

### Créer un Utilisateur de Test

```bash
php artisan tinker
```

```php
// Dans tinker
$user = new \App\Models\User();
$user->name = 'Ngokeng Rayan';
$user->email = 'test@ngokeng.com';
$user->password = bcrypt('password123');
$user->save();

// Créer un token
$token = $user->createToken('test-token')->plainTextToken;
echo $token;
// Copier le token affiché

exit
```

### Tester l'Authentification

Depuis ton navigateur ou Postman :

```
GET https://ngokeng.cdwfs.net/api/me
Header: Authorization: Bearer TON_TOKEN
```

---

## 11. Maintenance et Mises à Jour

### Mettre à Jour l'Application

```bash
cd ~/public_html/ngokeng

# 1. Mettre l'application en maintenance
php artisan down

# 2. Récupérer les dernières modifications depuis GitHub
git pull origin main

# 3. Mettre à jour les dépendances
composer install --no-dev --optimize-autoloader

# 4. Exécuter les nouvelles migrations
php artisan migrate --force

# 5. Nettoyer et reconstruire les caches
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 6. Remettre l'application en ligne
php artisan up
```

### Voir les Logs

```bash
# Logs Laravel
tail -f ~/public_html/ngokeng/storage/logs/laravel.log

# Ou voir les 50 dernières lignes
tail -50 ~/public_html/ngokeng/storage/logs/laravel.log
```

---

## 12. Dépannage

### Problème 1 : Page Blanche

**Cause :** Erreur PHP non affichée

**Solution :**

```bash
# Vérifier les logs
tail -50 ~/public_html/ngokeng/storage/logs/laravel.log

# Vérifier les permissions
ls -la ~/public_html/ngokeng/storage/

# Recréer les permissions
cd ~/public_html/ngokeng
chmod -R 775 storage bootstrap/cache
```

---

### Problème 2 : Erreur 500

**Causes possibles :**
- .env mal configuré
- APP_KEY manquante
- Permissions incorrectes

**Solutions :**

```bash
cd ~/public_html/ngokeng

# Régénérer la clé
php artisan key:generate

# Vérifier .env
cat .env | grep APP_KEY

# Nettoyer les caches
php artisan config:clear
php artisan cache:clear
```

---

### Problème 3 : Erreur de Base de Données

**Erreur :** `SQLSTATE[HY000] [1045] Access denied`

**Solution :**

```bash
# Tester la connexion MySQL
mysql -u cdiu8226_ngokeng -p cdiu8226_ngokeng
# Mot de passe : ngokeng1@

# Si ça ne fonctionne pas, vérifier les credentials dans .env
nano ~/public_html/ngokeng/.env

# Vérifier :
# DB_DATABASE=cdiu8226_ngokeng
# DB_USERNAME=cdiu8226_ngokeng
# DB_PASSWORD=ngokeng1@
```

---

### Problème 4 : 404 sur les Routes

**Cause :** .htaccess ignoré ou mod_rewrite non activé

**Solution :**

```bash
# Vérifier que .htaccess existe
cat ~/public_html/ngokeng/public/.htaccess

# Sur o2switch, mod_rewrite est normalement activé par défaut
# Si problème persiste, contacter le support o2switch
```

---

### Problème 5 : Le Sous-domaine ne Pointe pas vers le Bon Dossier

**Solution :**

1. Aller dans **cPanel o2switch**
2. Chercher **"Domaines"** ou **"Sous-domaines"**
3. Vérifier que `ngokeng.cdwfs.net` pointe vers :
   ```
   /home/cdiu8226/public_html/ngokeng/public
   ```
4. **IMPORTANT** : Le chemin doit pointer vers le dossier `public/`, pas juste `ngokeng/`

---

## 📋 Checklist Finale

- [ ] Terminal o2switch accessible
- [ ] Dossier `ngokeng` localisé
- [ ] PHP 8.2+ disponible
- [ ] Composer disponible
- [ ] Projet cloné depuis GitHub
- [ ] Dépendances Composer installées
- [ ] Fichier .env configuré avec les bonnes informations
- [ ] APP_KEY générée
- [ ] Base de données `cdiu8226_ngokeng` accessible
- [ ] Migrations exécutées
- [ ] Permissions correctes (775 storage/)
- [ ] Caches générés
- [ ] Site accessible depuis `https://ngokeng.cdwfs.net`
- [ ] API testée et fonctionnelle

---

## 🎯 Commandes Rapides de Référence

```bash
# Aller dans le projet
cd ~/public_html/ngokeng

# Mettre à jour depuis GitHub
git pull origin main

# Installer les dépendances
composer install --no-dev --optimize-autoloader

# Migrations
php artisan migrate --force

# Nettoyer les caches
php artisan config:clear && php artisan cache:clear

# Reconstruire les caches
php artisan config:cache && php artisan route:cache

# Voir les logs
tail -f storage/logs/laravel.log

# Tester la connexion MySQL
mysql -u cdiu8226_ngokeng -p cdiu8226_ngokeng
```

---

**Bon déploiement ! 🚀**

Si tu rencontres un problème, consulte la section Dépannage ou vérifie les logs.

