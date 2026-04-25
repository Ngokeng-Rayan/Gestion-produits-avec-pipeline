# CONFIGURATION DES ALERTES GRAFANA

## ✅ Configuration SMTP terminée

Le serveur SMTP Gmail est maintenant configuré dans Grafana via les variables d'environnement :
- **Serveur** : smtp.gmail.com:587
- **Utilisateur** : naassarl98@gmail.com
- **Mot de passe** : wyjz hjnj vvvm kqqv (mot de passe d'application)
- **Expéditeur** : Laravel Monitoring <naassarl98@gmail.com>

---

## 📧 ÉTAPE 1 : Tester l'envoi d'email

### Accéder à Grafana

1. Ouvrez votre navigateur : **http://localhost:3000**
2. Connectez-vous :
   - **Utilisateur** : `admin`
   - **Mot de passe** : `admin123`

### Tester le contact point

1. Cliquez sur l'icône **☰** (menu hamburger) en haut à gauche
2. Allez dans **Alerting** → **Contact points**
3. Vous devriez voir **"Email Rayan"** (provisionné automatiquement)
4. Cliquez sur le bouton **"Edit"** (icône crayon) à droite de "Email Rayan"
5. Faites défiler vers le bas et cliquez sur **"Test"**
6. Dans la fenêtre qui s'ouvre, cliquez sur **"Send test notification"**

**Résultat attendu** :
- Message de succès dans Grafana : "Test notification sent"
- Email reçu sur **rayanngokeng1@gmail.com** dans les 10-30 secondes
- Si vous ne recevez pas l'email, vérifiez le dossier Spam

### ⚠️ IMPORTANT : Vérifier les Notification Policies

Les alertes ne seront envoyées que si les notification policies sont configurées :

1. Allez dans **Alerting** → **Notification policies**
2. Vous devriez voir la politique par défaut avec **"Email Rayan"** comme contact point
3. Si ce n'est pas le cas, cliquez sur **"Edit"** (icône crayon)
4. Sélectionnez **"Email Rayan"** dans le champ "Default contact point"
5. Cliquez sur **"Save policy"**

---

## 🚨 ÉTAPE 2 : Créer une règle d'alerte

### Créer l'alerte "API Laravel Down"

1. Dans Grafana, allez dans **Alerting** → **Alert rules**
2. Cliquez sur **"New alert rule"**

### Configuration de l'alerte

**Section 1 : Rule name**
```
Nom : API Laravel Down
```

**Section 2 : Define query and alert condition**

1. **Query A** :
   - Data source : `Prometheus`
   - Metric : `up{job="laravel-api"}`
   - Legend : `API Status`

2. **Expression B** (Reduce) :
   - Function : `Last`
   - Input : `A`
   - Mode : `Strict`

3. **Expression C** (Threshold) :
   - Input : `B`
   - IS BELOW : `1`

4. **Set as alert condition** : Cochez `C`

**Section 3 : Alert evaluation behavior**

1. **Folder** : Créez un nouveau dossier "Laravel Alerts" ou utilisez "General Alerting"
2. **Evaluation group** : Créez "Laravel API" avec :
   - **Evaluation interval** : `1m` (évalue toutes les minutes)
3. **Pending period** : `1m` (attend 1 minute avant de déclencher)

**Section 4 : Add annotations**

```
Summary : API Laravel indisponible
Description : L'API Laravel ne répond plus depuis plus de 1 minute. Vérifiez les conteneurs Docker.
```

**Section 5 : Notifications**

1. **Contact point** : Sélectionnez **"Email Rayan"**
2. Laissez les autres options par défaut

3. Cliquez sur **"Save rule and exit"**

---

## 🧪 ÉTAPE 3 : Tester l'alerte

### Déclencher l'alerte

```powershell
# Arrêter le conteneur app
docker-compose stop app
```

### Chronologie attendue

```
⏱️ T+0s   : Conteneur app arrêté
⏱️ T+60s  : Grafana détecte que up{job="laravel-api"} = 0
⏱️ T+120s : Alerte passe en état "Firing" (rouge)
⏱️ T+130s : Email envoyé à rayanngokeng1@gmail.com
```

### Vérifier l'alerte dans Grafana

1. Allez dans **Alerting** → **Alert rules**
2. Vous devriez voir **"API Laravel Down"** en rouge (Firing)
3. Cliquez dessus pour voir les détails

### Vérifier l'email

📧 **Destinataire** : rayanngokeng1@gmail.com

**Sujet** :
```
[FIRING:1] API Laravel Down
```

**Contenu** :
```
Alert: API Laravel Down
Status: Firing
Summary: API Laravel indisponible
Description: L'API Laravel ne répond plus depuis plus de 1 minute. 
             Vérifiez les conteneurs Docker.

Labels:
  alertname: API Laravel Down
  job: laravel-api

Source: http://localhost:3000/alerting/...
```

### Résoudre l'alerte

```powershell
# Redémarrer le conteneur app
docker-compose start app
```

**Résultat** :
- Après 1-2 minutes : Alerte passe en "Resolved" (vert)
- Email de résolution envoyé (optionnel selon config)

---

## 📊 ÉTAPE 4 : Créer d'autres alertes

### Alerte "CPU élevé"

**Query A** :
```
100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

**Threshold** : IS ABOVE `85`

**Pending period** : `2m`

---

### Alerte "RAM élevée"

**Query A** :
```
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100
```

**Threshold** : IS ABOVE `90`

**Pending period** : `2m`

---

### Alerte "Produits en rupture"

**Query A** :
```
laravel_products_out_of_stock
```

**Threshold** : IS ABOVE `10`

**Pending period** : `5m`

---

### Alerte "Debug Mode activé"

**Query A** :
```
laravel_debug_mode
```

**Threshold** : IS ABOVE `0`

**Pending period** : `5m`

---

## 🔔 ÉTAPE 5 : Configurer les notification policies

### Personnaliser le routage des alertes

1. Allez dans **Alerting** → **Notification policies**
2. Vous verrez la politique par défaut qui envoie tout à "Email Rayan"

### Créer des politiques spécifiques (optionnel)

**Exemple** : Alertes critiques avec répétition plus fréquente

1. Cliquez sur **"+ New nested policy"**
2. **Matching labels** :
   ```
   severity = critical
   ```
3. **Contact point** : Email Rayan
4. **Repeat interval** : `1h` (au lieu de 4h par défaut)
5. Cliquez sur **"Save policy"**

---

## 📋 AVANTAGES DE GRAFANA ALERTING

### Par rapport à Alertmanager

✅ **Interface graphique** : Création d'alertes via UI (pas de YAML)
✅ **Meilleur support Gmail** : Pas de problème de certificat TLS
✅ **Intégration native** : Directement dans Grafana, pas de service séparé
✅ **Visualisation** : Voir les alertes directement sur les dashboards
✅ **Historique** : Voir l'historique des alertes dans l'interface
✅ **Test facile** : Bouton "Test" pour chaque contact point

### Fonctionnalités supplémentaires

- **Silences** : Mettre des alertes en sourdine temporairement
- **Labels** : Organiser les alertes par catégorie
- **Templates** : Personnaliser le format des emails
- **Multi-canal** : Email + Slack + Discord + Webhook simultanément

---

## 🚨 DÉPANNAGE

### Problème : Email de test non reçu

**1. Vérifier les logs Grafana**
```powershell
docker-compose logs grafana | Select-String -Pattern "smtp"
```

**2. Vérifier la configuration SMTP**
```powershell
docker-compose exec grafana cat /etc/grafana/grafana.ini | Select-String -Pattern "smtp"
```

**3. Vérifier le mot de passe**
- Le mot de passe `wyjz hjnj vvvm kqqv` est-il correct ?
- C'est bien un mot de passe d'application Gmail (pas le mot de passe principal) ?

**4. Vérifier le dossier Spam**
- Ouvrir Gmail : rayanngokeng1@gmail.com
- Vérifier le dossier "Spam"

### Problème : Alerte ne se déclenche pas

**1. Vérifier que l'API est bien arrêtée**
```powershell
docker-compose ps app
# Status devrait être : Exited
```

**2. Vérifier la métrique dans Grafana**
1. Allez dans **Explore**
2. Sélectionnez **Prometheus**
3. Requête : `up{job="laravel-api"}`
4. Résultat devrait être : `0`

**3. Vérifier l'état de l'alerte**
1. Allez dans **Alerting** → **Alert rules**
2. Cherchez **"API Laravel Down"**
3. État devrait être : **Firing** (rouge)

---

## 📝 RÉSUMÉ

### Ce qui a été configuré

✅ **Grafana SMTP** : Configuré avec Gmail (naassarl98@gmail.com)
✅ **Contact Point** : "Email Rayan" → rayanngokeng1@gmail.com
✅ **Provisioning** : Contact point créé automatiquement au démarrage

### Prochaines étapes

1. ✅ Tester l'envoi d'email via "Test" dans Contact points
2. ✅ Créer la règle d'alerte "API Laravel Down"
3. ✅ Tester avec `docker-compose stop app`
4. ✅ Vérifier la réception de l'email
5. ✅ Créer d'autres alertes (CPU, RAM, rupture stock, etc.)

**Tout est prêt pour les alertes Grafana !** 🎉

---

## 🔗 LIENS UTILES

- **Grafana Alerting** : http://localhost:3000/alerting
- **Contact Points** : http://localhost:3000/alerting/notifications
- **Alert Rules** : http://localhost:3000/alerting/list
- **Notification Policies** : http://localhost:3000/alerting/routes
- **Silences** : http://localhost:3000/alerting/silences

---

## 💡 CONSEIL

Grafana Alerting est plus moderne et plus facile à utiliser qu'Alertmanager pour ce type de projet. Vous pouvez maintenant :

1. Créer des alertes visuellement (pas de YAML)
2. Tester facilement l'envoi d'emails
3. Voir l'historique des alertes
4. Gérer les silences via l'interface

**C'est la solution recommandée pour votre projet !** 👍
