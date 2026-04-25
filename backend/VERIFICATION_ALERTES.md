# ✅ VÉRIFICATION DES ALERTES - GUIDE RAPIDE

## 📊 ÉTAPE 1 : Vérifier Prometheus

### Ouvrir l'interface Prometheus

🌐 **URL** : http://localhost:9090

### Vérifier les règles d'alertes

1. Cliquez sur **"Alerts"** dans le menu du haut
2. Vous devriez voir **13 règles d'alertes** :

```
✅ system_alerts (4 règles)
   - HighCPUUsage
   - CriticalCPUUsage
   - HighMemoryUsage
   - CriticalMemoryUsage

✅ laravel_alerts (7 règles)
   - LaravelAPIDown
   - HighStockOutage
   - CriticalStockOutage
   - SlowResponseTime
   - CriticalResponseTime
   - DebugModeEnabled
   - LargeDatabaseSize

✅ prometheus_alerts (2 règles)
   - PrometheusScrapeFailing
   - PrometheusHighLoad
```

### Vérifier la connexion à Alertmanager

1. Cliquez sur **"Status"** → **"Runtime & Build Information"**
2. Cherchez la section **"Alertmanagers"**
3. Vous devriez voir :
   ```
   Endpoint: http://alertmanager:9093/api/v2/alerts
   State: UP ✅
   ```

---

## 🔔 ÉTAPE 2 : Vérifier Alertmanager

### Ouvrir l'interface Alertmanager

🌐 **URL** : http://localhost:9093

### Interface attendue

Vous devriez voir 3 onglets :
- **Alerts** : Liste des alertes actives (vide si tout va bien)
- **Silences** : Alertes mises en sourdine (vide)
- **Status** : Configuration chargée ✅

### Vérifier la configuration

1. Cliquez sur **"Status"**
2. Vous devriez voir :
   ```yaml
   Config:
     global:
       smtp_smarthost: smtp.gmail.com:587
       smtp_from: naassarl98@gmail.com
       smtp_auth_username: naassarl98@gmail.com
   
   Receivers:
     - email-rayan
     - email-rayan-critical
   ```

---

## 🧪 ÉTAPE 3 : TEST RAPIDE - Arrêter l'API

### Déclencher une alerte critique

```powershell
# Arrêter le conteneur app
docker-compose stop app
```

### Chronologie attendue

```
⏱️ T+0s   : Conteneur app arrêté
⏱️ T+10s  : Prometheus détecte que l'API ne répond plus
⏱️ T+60s  : Alerte "LaravelAPIDown" passe en état "Pending" (jaune)
⏱️ T+120s : Alerte passe en état "Firing" (rouge)
⏱️ T+130s : Email envoyé à rayanngokeng1@gmail.com
```

### Vérifier dans Prometheus (après 2 minutes)

1. Ouvrir http://localhost:9090/alerts
2. Chercher **"LaravelAPIDown"**
3. État devrait être : 🔴 **FIRING**
4. Détails :
   ```
   Alert: LaravelAPIDown
   State: FIRING
   Active Since: 2026-04-08 14:30:00
   Value: 0
   Labels: severity=critical, category=application
   ```

### Vérifier dans Alertmanager (après 2 minutes)

1. Ouvrir http://localhost:9093
2. Vous devriez voir l'alerte active :
   ```
   🔴 LaravelAPIDown
   Severity: critical
   Started: 2 minutes ago
   ```

### Vérifier l'email (après 2 minutes 10 secondes)

📧 **Destinataire** : rayanngokeng1@gmail.com

**Sujet attendu** :
```
🚨 [CRITIQUE] Laravel API - LaravelAPIDown - ACTION IMMÉDIATE REQUISE
```

**Contenu attendu** :
```html
⚠️ INTERVENTION URGENTE NÉCESSAIRE ⚠️

🔥 LaravelAPIDown
Sévérité : CRITIQUE
Catégorie : application
Description : L'API Laravel ne répond plus depuis plus de 1 minute. 
              Vérifiez les conteneurs Docker.

Actions recommandées :
• Vérifier les conteneurs Docker : docker-compose ps
• Consulter les logs : docker-compose logs -f app
• Vérifier Grafana : http://localhost:3000
• Vérifier Kibana : http://localhost:5601
```

### Résoudre l'alerte

```powershell
# Redémarrer le conteneur app
docker-compose start app
```

**Résultat** :
- Après 30 secondes : Alerte disparaît de Prometheus
- Après 1 minute : Alerte disparaît d'Alertmanager
- Email de résolution envoyé (optionnel selon config)

---

## 🔍 ÉTAPE 4 : Vérifier les logs

### Logs Alertmanager

```powershell
# Voir les 50 dernières lignes
docker-compose logs alertmanager --tail 50

# Voir en temps réel
docker-compose logs -f alertmanager
```

**Rechercher** :
- ✅ `msg="Notify success"` : Email envoyé avec succès
- ❌ `msg="Notify failed"` : Échec d'envoi (vérifier mot de passe)
- ❌ `level=error` : Erreur de configuration

### Logs Prometheus

```powershell
# Voir les 50 dernières lignes
docker-compose logs prometheus --tail 50
```

**Rechercher** :
- ✅ `msg="Loading configuration file"` : Config chargée
- ✅ `msg="Completed loading of configuration file"` : Config OK
- ❌ `level=error` : Erreur dans les règles d'alertes

---

## 📋 CHECKLIST DE VÉRIFICATION

### Conteneurs

- [ ] 11 conteneurs actifs (`docker-compose ps`)
- [ ] laravel-alertmanager : UP
- [ ] laravel-prometheus : UP
- [ ] laravel-app : UP

### Prometheus (http://localhost:9090)

- [ ] Interface accessible
- [ ] 13 règles d'alertes visibles
- [ ] Alertmanager connecté (Status → Alertmanagers : UP)
- [ ] Targets actifs (Status → Targets : 3/3 UP)

### Alertmanager (http://localhost:9093)

- [ ] Interface accessible
- [ ] Configuration chargée (Status)
- [ ] Email configuré : naassarl98@gmail.com → rayanngokeng1@gmail.com

### Test d'alerte

- [ ] `docker-compose stop app` exécuté
- [ ] Attente de 2 minutes
- [ ] Alerte visible dans Prometheus (rouge)
- [ ] Alerte visible dans Alertmanager
- [ ] Email reçu sur rayanngokeng1@gmail.com
- [ ] `docker-compose start app` exécuté
- [ ] Alerte résolue après 1 minute

---

## 🚨 DÉPANNAGE RAPIDE

### Problème : Pas d'email reçu

**1. Vérifier les logs Alertmanager**
```powershell
docker-compose logs alertmanager | Select-String "error"
```

**2. Vérifier le mot de passe Gmail**
- Mot de passe actuel : `wyjz hjnj vvvm kqqv`
- Vérifier dans `alertmanager/alertmanager.yml`

**3. Tester la connexion SMTP**
```powershell
# Entrer dans le conteneur
docker-compose exec alertmanager sh

# Tester (si telnet disponible)
telnet smtp.gmail.com 587
# Devrait afficher : 220 smtp.google.com ESMTP
```

**4. Vérifier le dossier Spam**
- Ouvrir Gmail : rayanngokeng1@gmail.com
- Vérifier le dossier "Spam"
- Marquer comme "Non spam" si trouvé

### Problème : Alerte ne se déclenche pas

**1. Vérifier que l'API est bien arrêtée**
```powershell
docker-compose ps app
# Status devrait être : Exited
```

**2. Vérifier dans Prometheus**
```powershell
# Ouvrir http://localhost:9090/graph
# Exécuter la requête :
up{job="laravel-api"}
# Résultat devrait être : 0
```

**3. Vérifier les règles d'alertes**
```powershell
# Valider la syntaxe
docker-compose exec prometheus promtool check rules /etc/prometheus/alerts/laravel-alerts.yml
```

### Problème : Alertmanager ne reçoit pas les alertes

**1. Vérifier la connexion Prometheus → Alertmanager**
```powershell
# Ouvrir http://localhost:9090/status
# Chercher "Alertmanagers"
# Doit afficher : alertmanager:9093 (UP)
```

**2. Tester manuellement**
```powershell
# Envoyer une alerte test
curl -X POST http://localhost:9093/api/v2/alerts -H "Content-Type: application/json" -d '[{"labels":{"alertname":"test","severity":"critical"},"annotations":{"summary":"Test alert"}}]'
```

---

## 📊 COMMANDES UTILES

```powershell
# Voir toutes les alertes actives
curl http://localhost:9090/api/v1/alerts | ConvertFrom-Json | Select-Object -ExpandProperty data | Select-Object -ExpandProperty alerts

# Voir les alertes dans Alertmanager
curl http://localhost:9093/api/v2/alerts | ConvertFrom-Json

# Recharger la configuration Prometheus
curl -X POST http://localhost:9090/-/reload

# Recharger la configuration Alertmanager
curl -X POST http://localhost:9093/-/reload

# Voir les métriques Laravel
curl http://localhost:8000/metrics

# Redémarrer un conteneur spécifique
docker-compose restart alertmanager
docker-compose restart prometheus
```

---

## ✅ RÉSUMÉ

Si tout fonctionne correctement :

1. ✅ Prometheus collecte les métriques toutes les 10-15 secondes
2. ✅ Prometheus évalue les règles d'alertes toutes les 15 secondes
3. ✅ Quand une condition est remplie pendant la durée `for:`, l'alerte passe en "Firing"
4. ✅ Prometheus envoie l'alerte à Alertmanager
5. ✅ Alertmanager groupe les alertes et envoie un email
6. ✅ Email reçu sur rayanngokeng1@gmail.com

**Temps total** : ~2 minutes 10 secondes entre l'arrêt de l'API et la réception de l'email.

---

## 🎯 PROCHAINES ÉTAPES

1. Tester avec `docker-compose stop app`
2. Vérifier la réception de l'email
3. Tester d'autres alertes (CPU, RAM, rupture stock)
4. Personnaliser les seuils si nécessaire
5. Configurer des silences pour les maintenances planifiées

**Tout est prêt pour le monitoring et les alertes !** 🎉
