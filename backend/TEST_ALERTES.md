# TEST DES ALERTES EMAIL

## Configuration actuelle

✅ **Email expéditeur** : naassarl98@gmail.com
✅ **Email destinataire** : rayanngokeng1@gmail.com
✅ **Mot de passe d'application** : Configuré (wyjz hjnj vvvm kqqv)

---

## ÉTAPE 1 : Démarrer Alertmanager

```bash
# Arrêter tous les conteneurs
docker-compose down

# Redémarrer avec Alertmanager
docker-compose up -d

# Vérifier que les 11 conteneurs sont actifs
docker-compose ps
```

**Conteneurs attendus** :
- laravel-app
- laravel-nginx
- laravel-db
- laravel-phpmyadmin
- laravel-prometheus
- laravel-grafana
- laravel-node-exporter
- laravel-elasticsearch
- laravel-logstash
- laravel-kibana
- **laravel-alertmanager** ← NOUVEAU

---

## ÉTAPE 2 : Vérifier Alertmanager

### Interface Web

Ouvrez votre navigateur : `http://localhost:9093`

Vous devriez voir :
- **Alerts** : Aucune alerte active (si tout va bien)
- **Silences** : Aucune alerte en sourdine
- **Status** : Configuration chargée

### Vérifier les logs

```bash
# Voir les logs Alertmanager
docker-compose logs alertmanager

# Vérifier qu'il n'y a pas d'erreurs SMTP
docker-compose logs alertmanager | grep -i error
```

**Sortie attendue** :
```
laravel-alertmanager | level=info msg="Listening on :9093"
laravel-alertmanager | level=info msg="Build context" version=...
```

---

## ÉTAPE 3 : Vérifier Prometheus

### Interface Web

Ouvrez : `http://localhost:9090/alerts`

Vous devriez voir **13 règles d'alertes** :

**Système (4)** :
- HighCPUUsage (Inactive)
- CriticalCPUUsage (Inactive)
- HighMemoryUsage (Inactive)
- CriticalMemoryUsage (Inactive)

**Application (7)** :
- LaravelAPIDown (Inactive)
- HighStockOutage (Inactive)
- CriticalStockOutage (Inactive)
- SlowResponseTime (Inactive)
- CriticalResponseTime (Inactive)
- DebugModeEnabled (Inactive ou Firing si debug=true)
- LargeDatabaseSize (Inactive)

**Monitoring (2)** :
- PrometheusScrapeFailing (Inactive)
- PrometheusHighLoad (Inactive)

### Vérifier la connexion à Alertmanager

Ouvrez : `http://localhost:9090/status`

Cherchez la section **Alertmanagers** :
```
Endpoint: http://alertmanager:9093/api/v2/alerts
State: UP
Last Scrape: 2s ago
```

---

## ÉTAPE 4 : TEST 1 - Arrêter l'API (Alerte Critique)

### Déclencher l'alerte

```bash
# Arrêter le conteneur app
docker-compose stop app
```

### Attendre 1 minute

L'alerte `LaravelAPIDown` se déclenche après 1 minute.

### Vérifier dans Prometheus

1. Ouvrir `http://localhost:9090/alerts`
2. Chercher `LaravelAPIDown`
3. État devrait passer de :
   - **Inactive** (vert) → **Pending** (jaune) → **Firing** (rouge)

### Vérifier dans Alertmanager

1. Ouvrir `http://localhost:9093`
2. Vous devriez voir l'alerte active
3. Détails :
   - **Alert** : LaravelAPIDown
   - **Severity** : critical
   - **Description** : L'API Laravel ne répond plus depuis plus de 1 minute

### Vérifier l'email

**Délai** : 10 secondes après que l'alerte passe en "Firing"

**Email attendu** :
```
De : naassarl98@gmail.com
À : rayanngokeng1@gmail.com
Sujet : 🚨 [CRITIQUE] Laravel API - LaravelAPIDown - ACTION IMMÉDIATE REQUISE

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

```bash
# Redémarrer le conteneur app
docker-compose start app

# Attendre 30 secondes
```

L'alerte devrait disparaître et vous recevrez un email de résolution.

---

## ÉTAPE 5 : TEST 2 - Charge CPU (Alerte Warning)

### Déclencher l'alerte

```bash
# Entrer dans le conteneur app
docker-compose exec app bash

# Générer une charge CPU (4 processus)
yes > /dev/null &
yes > /dev/null &
yes > /dev/null &
yes > /dev/null &

# Vérifier la charge
top
# Appuyez sur 'q' pour quitter
```

### Attendre 2 minutes

L'alerte `HighCPUUsage` se déclenche après 2 minutes si CPU > 85%.

### Vérifier dans Grafana

1. Ouvrir `http://localhost:3000`
2. Ouvrir le dashboard "Laravel API - Monitoring Complet"
3. Panel "💻 CPU Usage" devrait afficher > 85%

### Vérifier l'email

**Email attendu** :
```
De : naassarl98@gmail.com
À : rayanngokeng1@gmail.com
Sujet : [Laravel API] WARNING - HighCPUUsage

🔔 Alerte Laravel API - Gestion Produits

HighCPUUsage
Sévérité : WARNING
Catégorie : system
Description : Le CPU est utilisé à 87% depuis plus de 2 minutes.
```

### Résoudre l'alerte

```bash
# Tuer tous les processus 'yes'
killall yes

# Sortir du conteneur
exit
```

---

## ÉTAPE 6 : TEST 3 - Produits en rupture (Alerte Business)

### Déclencher l'alerte

```bash
# Entrer dans le conteneur
docker-compose exec app bash

# Ouvrir Tinker
php artisan tinker

# Mettre 15 produits en rupture de stock
Product::limit(15)->update(['quantity' => 0]);

# Vérifier
Product::where('quantity', 0)->count();
# Devrait afficher : 15

exit
exit
```

### Attendre 5 minutes

L'alerte `HighStockOutage` se déclenche après 5 minutes si rupture > 10.

### Vérifier dans Grafana

1. Panel "⚠️ Rupture" devrait afficher 15

### Vérifier l'email

**Email attendu** :
```
De : naassarl98@gmail.com
À : rayanngokeng1@gmail.com
Sujet : [Laravel API] WARNING - HighStockOutage

HighStockOutage
Sévérité : WARNING
Catégorie : business
Description : 15 produits sont en rupture de stock. 
              Réapprovisionnement nécessaire.
```

### Résoudre l'alerte

```bash
docker-compose exec app bash
php artisan tinker

# Remettre du stock
Product::where('quantity', 0)->update(['quantity' => 10]);

exit
exit
```

---

## ÉTAPE 7 : Vérifier les logs Alertmanager

```bash
# Voir tous les logs
docker-compose logs alertmanager

# Voir seulement les envois d'emails
docker-compose logs alertmanager | grep -i "notify"

# Voir les erreurs
docker-compose logs alertmanager | grep -i "error"
```

**Sortie attendue (succès)** :
```
level=info msg="Notify success" receiver=email-rayan-critical alert=LaravelAPIDown
level=info msg="Notify success" receiver=email-rayan alert=HighCPUUsage
```

**Sortie en cas d'erreur SMTP** :
```
level=error msg="Notify failed" receiver=email-rayan err="dial tcp: lookup smtp.gmail.com"
```

---

## DÉPANNAGE

### Problème : Pas d'email reçu

**1. Vérifier le mot de passe Gmail**

Le mot de passe `wyjz hjnj vvvm kqqv` est-il correct ?

Test :
```bash
# Tester la connexion SMTP
docker-compose exec alertmanager sh

# Installer telnet
apk add busybox-extras

# Tester la connexion
telnet smtp.gmail.com 587
# Devrait afficher : 220 smtp.google.com ESMTP

exit
```

**2. Vérifier les logs Alertmanager**

```bash
docker-compose logs alertmanager | tail -50
```

Cherchez :
- `level=error` : Erreurs
- `msg="Notify failed"` : Échec d'envoi
- `msg="Notify success"` : Succès d'envoi

**3. Vérifier que l'alerte est bien en "Firing"**

```bash
# Voir l'état des alertes
curl http://localhost:9090/api/v1/alerts | jq
```

**4. Vérifier la configuration Alertmanager**

```bash
# Valider la syntaxe YAML
docker-compose exec alertmanager amtool check-config /etc/alertmanager/alertmanager.yml
```

### Problème : Email dans les spams

1. Vérifier le dossier "Spam" de rayanngokeng1@gmail.com
2. Marquer comme "Non spam"
3. Ajouter naassarl98@gmail.com aux contacts

### Problème : Trop d'emails

Modifier `alertmanager/alertmanager.yml` :

```yaml
route:
  repeat_interval: 12h  # Au lieu de 4h
```

Puis :
```bash
docker-compose restart alertmanager
```

---

## RÉSUMÉ DES TESTS

| Test | Alerte | Sévérité | Délai | Email attendu |
|------|--------|----------|-------|---------------|
| **Test 1** | LaravelAPIDown | Critical | 1 min | 🚨 Template rouge |
| **Test 2** | HighCPUUsage | Warning | 2 min | 🔔 Template bleu |
| **Test 3** | HighStockOutage | Warning | 5 min | 🔔 Template bleu |

---

## COMMANDES UTILES

```bash
# Voir toutes les alertes actives
curl http://localhost:9090/api/v1/alerts | jq '.data.alerts[] | {name: .labels.alertname, state: .state}'

# Voir les alertes dans Alertmanager
curl http://localhost:9093/api/v2/alerts | jq

# Recharger la configuration Prometheus
curl -X POST http://localhost:9090/-/reload

# Recharger la configuration Alertmanager
curl -X POST http://localhost:9093/-/reload

# Voir les métriques Laravel
curl http://localhost:8000/metrics

# Tester l'envoi d'email manuellement
docker-compose exec alertmanager amtool alert add test_alert severity=critical
```

---

## PROCHAINES ÉTAPES

1. ✅ Démarrer les conteneurs
2. ✅ Vérifier Alertmanager sur :9093
3. ✅ Vérifier Prometheus sur :9090/alerts
4. ✅ Tester avec `docker-compose stop app`
5. ✅ Vérifier l'email sur rayanngokeng1@gmail.com
6. ✅ Redémarrer avec `docker-compose start app`

**Tout est prêt !** 🎉
