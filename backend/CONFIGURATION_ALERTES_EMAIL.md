# CONFIGURATION DES ALERTES PAR EMAIL

## ÉTAPE 1 : CRÉER UN MOT DE PASSE D'APPLICATION GMAIL

Pour que Alertmanager puisse envoyer des emails via Gmail, vous devez créer un **mot de passe d'application** (pas votre mot de passe Gmail habituel).

### Procédure :

1. **Activer la validation en 2 étapes sur votre compte Gmail** :
   - Allez sur https://myaccount.google.com/security
   - Cliquez sur "Validation en 2 étapes"
   - Suivez les instructions pour l'activer

2. **Créer un mot de passe d'application** :
   - Allez sur https://myaccount.google.com/apppasswords
   - Sélectionnez "Autre (nom personnalisé)"
   - Tapez "Laravel Alertmanager"
   - Cliquez sur "Générer"
   - **Copiez le mot de passe de 16 caractères** (ex: `abcd efgh ijkl mnop`)

3. **Configurer Alertmanager** :
   - Ouvrez `alertmanager/alertmanager.yml`
   - Remplacez les lignes suivantes :

```yaml
smtp_from: 'rayanngokeng1@gmail.com'
smtp_auth_username: 'rayanngokeng1@gmail.com'
smtp_auth_password: 'abcd efgh ijkl mnop'  # ← Collez votre mot de passe d'application ici
```

---

## ÉTAPE 2 : DÉMARRER ALERTMANAGER

```bash
# Arrêter les conteneurs actuels
docker-compose down

# Redémarrer avec Alertmanager
docker-compose up -d

# Vérifier que Alertmanager est démarré
docker-compose ps
```

Vous devriez voir **11 conteneurs** maintenant (au lieu de 10) :
- laravel-alertmanager (nouveau)
- laravel-prometheus
- laravel-grafana
- etc.

---

## ÉTAPE 3 : VÉRIFIER LA CONFIGURATION

### Accéder à Alertmanager

Ouvrez votre navigateur : `http://localhost:9093`

Vous verrez l'interface Alertmanager avec :
- **Alerts** : Liste des alertes actives
- **Silences** : Alertes mises en sourdine
- **Status** : État de la configuration

### Vérifier Prometheus

Ouvrez `http://localhost:9090/alerts`

Vous verrez toutes les règles d'alertes configurées :
- HighCPUUsage
- CriticalCPUUsage
- HighMemoryUsage
- LaravelAPIDown
- HighStockOutage
- etc.

**État des alertes** :
- 🟢 **Inactive** : Tout va bien
- 🟡 **Pending** : Condition remplie mais attend la durée `for:`
- 🔴 **Firing** : Alerte active, email envoyé

---

## ÉTAPE 4 : TESTER LES ALERTES

### Test 1 : Simuler une charge CPU élevée

```bash
# Entrer dans le conteneur app
docker-compose exec app bash

# Générer une charge CPU (Ctrl+C pour arrêter)
yes > /dev/null &
yes > /dev/null &
yes > /dev/null &
yes > /dev/null &
```

**Résultat attendu** :
- Après 2 minutes : Alerte `HighCPUUsage` (warning)
- Email reçu sur rayanngokeng1@gmail.com
- Si CPU > 95% pendant 1 min : Alerte `CriticalCPUUsage` (critical)

**Arrêter la charge** :
```bash
killall yes
exit
```

### Test 2 : Arrêter l'API Laravel

```bash
# Arrêter le conteneur app
docker-compose stop app
```

**Résultat attendu** :
- Après 1 minute : Alerte `LaravelAPIDown` (critical)
- Email critique reçu avec template rouge

**Redémarrer** :
```bash
docker-compose start app
```

### Test 3 : Créer des produits en rupture

```bash
# Entrer dans le conteneur
docker-compose exec app bash

# Ouvrir Tinker
php artisan tinker

# Mettre 15 produits en rupture
Product::limit(15)->update(['quantity' => 0]);
exit
```

**Résultat attendu** :
- Après 5 minutes : Alerte `HighStockOutage` (warning)
- Email reçu

---

## ÉTAPE 5 : COMPRENDRE LES ALERTES CONFIGURÉES

### Alertes Système

| Alerte | Condition | Durée | Sévérité | Description |
|--------|-----------|-------|----------|-------------|
| **HighCPUUsage** | CPU > 85% | 2 min | Warning | CPU élevé |
| **CriticalCPUUsage** | CPU > 95% | 1 min | Critical | CPU saturé |
| **HighMemoryUsage** | RAM > 90% | 2 min | Warning | RAM élevée |
| **CriticalMemoryUsage** | RAM > 95% | 1 min | Critical | RAM saturée |

### Alertes Application

| Alerte | Condition | Durée | Sévérité | Description |
|--------|-----------|-------|----------|-------------|
| **LaravelAPIDown** | API ne répond plus | 1 min | Critical | API indisponible |
| **HighStockOutage** | Rupture > 10 produits | 5 min | Warning | Nombreux produits en rupture |
| **CriticalStockOutage** | Rupture > 20 produits | 2 min | Critical | Rupture massive |
| **SlowResponseTime** | Temps > 2s | 3 min | Warning | API lente |
| **CriticalResponseTime** | Temps > 5s | 1 min | Critical | API très lente |
| **DebugModeEnabled** | Debug = ON | 5 min | Warning | Mode debug en production |
| **LargeDatabaseSize** | BDD > 10 GB | 10 min | Info | Base volumineuse |

### Alertes Monitoring

| Alerte | Condition | Durée | Sévérité | Description |
|--------|-----------|-------|----------|-------------|
| **PrometheusScrapeFailing** | Collecte échoue | 2 min | Warning | Échec de collecte |
| **PrometheusHighLoad** | Prometheus lent | 5 min | Warning | Prometheus surchargé |

---

## ÉTAPE 6 : PERSONNALISER LES ALERTES

### Modifier les seuils

Éditez `prometheus/alerts/laravel-alerts.yml` :

```yaml
# Exemple : Changer le seuil CPU de 85% à 80%
- alert: HighCPUUsage
  expr: 100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80  # ← Changé
  for: 2m
```

### Ajouter une nouvelle alerte

```yaml
# Alerte si moins de 5 utilisateurs
- alert: LowUserCount
  expr: laravel_users_total < 5
  for: 10m
  labels:
    severity: info
    category: business
  annotations:
    summary: "Peu d'utilisateurs enregistrés"
    description: "Seulement {{ $value }} utilisateurs. Campagne marketing nécessaire ?"
```

### Recharger la configuration

```bash
# Recharger Prometheus sans redémarrer
curl -X POST http://localhost:9090/-/reload

# Ou redémarrer les conteneurs
docker-compose restart prometheus alertmanager
```

---

## ÉTAPE 7 : GÉRER LES ALERTES

### Mettre une alerte en sourdine (Silence)

1. Ouvrir Alertmanager : `http://localhost:9093`
2. Cliquer sur "Silences"
3. Cliquer sur "New Silence"
4. Remplir :
   - **Matchers** : `alertname="HighCPUUsage"`
   - **Duration** : `2h` (2 heures)
   - **Creator** : Votre nom
   - **Comment** : "Maintenance planifiée"
5. Cliquer sur "Create"

**Résultat** : Pendant 2 heures, l'alerte `HighCPUUsage` ne déclenchera pas d'email.

### Voir l'historique des alertes

Ouvrez Prometheus : `http://localhost:9090/alerts`

Vous verrez :
- **Active** : Alertes en cours
- **State** : Inactive / Pending / Firing
- **Value** : Valeur actuelle de la métrique

---

## ÉTAPE 8 : FRÉQUENCE DES EMAILS

### Configuration actuelle

```yaml
route:
  group_wait: 30s        # Attendre 30s avant d'envoyer le premier email
  group_interval: 5m     # Grouper les alertes pendant 5 minutes
  repeat_interval: 4h    # Renvoyer l'email toutes les 4h si l'alerte persiste
```

### Alertes critiques

```yaml
- match:
    severity: critical
  group_wait: 10s        # Envoi immédiat (10s)
  repeat_interval: 1h    # Rappel toutes les heures
```

**Exemple** :
- 10:00:00 : CPU > 95%
- 10:00:10 : Email critique envoyé
- 11:00:10 : Email de rappel (si CPU toujours > 95%)
- 12:00:10 : Email de rappel (si CPU toujours > 95%)

---

## ÉTAPE 9 : FORMAT DES EMAILS

### Email Warning (Normal)

```
Sujet: [Laravel API] WARNING - HighCPUUsage

┌─────────────────────────────────────┐
│ 🔔 Alerte Laravel API               │
│    Gestion Produits                 │
└─────────────────────────────────────┘

Nombre d'alertes : 1

┌─────────────────────────────────────┐
│ HighCPUUsage                        │
│ Sévérité : WARNING                  │
│ Catégorie : system                  │
│ Description : Le CPU est utilisé à  │
│               87% depuis plus de    │
│               2 minutes.            │
│ Début : 2026-04-08 14:30:15        │
└─────────────────────────────────────┘

Grafana: http://localhost:3000
```

### Email Critical (Urgent)

```
Sujet: 🚨 [CRITIQUE] Laravel API - CriticalCPUUsage - ACTION IMMÉDIATE REQUISE

┌─────────────────────────────────────┐
│ 🚨 ALERTE CRITIQUE                  │
│    ACTION IMMÉDIATE REQUISE         │
└─────────────────────────────────────┘

⚠️ INTERVENTION URGENTE NÉCESSAIRE ⚠️

Nombre d'alertes critiques : 1

┌─────────────────────────────────────┐
│ 🔥 CriticalCPUUsage                 │
│ Sévérité : CRITIQUE                 │
│ Catégorie : system                  │
│ Description : Le CPU est utilisé à  │
│               97% ! Intervention    │
│               immédiate requise.    │
│ Début : 2026-04-08 14:35:20        │
│                                     │
│ Actions recommandées :              │
│ • Vérifier les conteneurs Docker   │
│ • Consulter les logs                │
│ • Vérifier Grafana                  │
│ • Vérifier Kibana                   │
└─────────────────────────────────────┘
```

---

## DÉPANNAGE

### Problème : Pas d'email reçu

**Vérifications** :

1. **Mot de passe d'application correct ?**
   ```bash
   # Voir les logs Alertmanager
   docker-compose logs alertmanager
   
   # Chercher les erreurs SMTP
   docker-compose logs alertmanager | grep -i error
   ```

2. **Alertmanager accessible ?**
   ```bash
   curl http://localhost:9093/-/healthy
   # Doit retourner : Healthy
   ```

3. **Prometheus envoie bien vers Alertmanager ?**
   - Ouvrir `http://localhost:9090/status`
   - Vérifier "Alertmanagers" : doit afficher `alertmanager:9093` en UP

4. **Alerte bien déclenchée ?**
   - Ouvrir `http://localhost:9090/alerts`
   - Vérifier que l'alerte est en état "Firing" (rouge)

### Problème : Trop d'emails

**Solution** : Augmenter `repeat_interval`

```yaml
route:
  repeat_interval: 12h  # Au lieu de 4h
```

### Problème : Email dans les spams

**Solution** :
1. Marquer l'email comme "Non spam" dans Gmail
2. Ajouter `alertes.laravel@gmail.com` dans vos contacts
3. Créer un filtre Gmail pour toujours accepter ces emails

---

## RÉSUMÉ

✅ **11 conteneurs Docker** (ajout d'Alertmanager)
✅ **13 règles d'alertes** configurées
✅ **Emails automatiques** vers rayanngokeng1@gmail.com
✅ **Templates HTML** pour emails warning et critical
✅ **Groupement intelligent** des alertes
✅ **Interface web** Alertmanager sur :9093

**Prochaines étapes** :
1. Configurer le mot de passe d'application Gmail
2. Redémarrer les conteneurs
3. Tester avec une charge CPU
4. Vérifier la réception des emails
