# 🔧 GUIDE DE DÉPANNAGE - ALERTES GRAFANA

## Problème : Les alertes se déclenchent mais aucun email n'est reçu

### ✅ ÉTAPE 1 : Vérifier le contact point

1. Ouvrez Grafana : **http://localhost:3000**
2. Allez dans **Alerting** → **Contact points**
3. Vérifiez que **"Email Rayan"** existe
4. Cliquez sur **Edit** (icône crayon)
5. Vérifiez l'adresse email : **rayanngokeng1@gmail.com**
6. Cliquez sur **Test** en bas de la page
7. Cliquez sur **Send test notification**

**Résultat attendu** :
- ✅ Message vert : "Test notification sent"
- ✅ Email reçu dans les 30 secondes

**Si l'email n'arrive pas** :
- Vérifiez le dossier Spam de rayanngokeng1@gmail.com
- Vérifiez les logs Grafana (voir ÉTAPE 4)

---

### ✅ ÉTAPE 2 : Vérifier les Notification Policies

**C'est l'étape la plus importante !** Les alertes ne seront pas envoyées si les policies ne sont pas configurées.

1. Dans Grafana, allez dans **Alerting** → **Notification policies**
2. Vous devriez voir :
   ```
   Default policy
   Contact point: Email Rayan
   ```

**Si "Email Rayan" n'est PAS sélectionné** :
1. Cliquez sur **Edit** (icône crayon) sur la ligne "Default policy"
2. Dans le champ **"Default contact point"**, sélectionnez **"Email Rayan"**
3. Cliquez sur **"Save policy"**

**Configuration recommandée** :
- **Group by** : `alertname`, `grafana_folder`
- **Group wait** : `10s` (attendre 10s avant d'envoyer)
- **Group interval** : `5m` (grouper les alertes pendant 5 minutes)
- **Repeat interval** : `4h` (répéter toutes les 4 heures si l'alerte persiste)

---

### ✅ ÉTAPE 3 : Vérifier que les alertes sont bien en état "Firing"

1. Allez dans **Alerting** → **Alert rules**
2. Cherchez les alertes avec le statut **"Firing"** (orange/rouge)
3. Cliquez sur une alerte pour voir les détails

**Alertes qui devraient être en Firing** :
- **LaravelAPIDown** : Si le conteneur app est arrêté
- **DebugModeEnabled** : Si APP_DEBUG=true dans .env
- **HighCPUUsage** : Si CPU > 85%
- **CriticalStockOutage** : Si > 20 produits en rupture

---

### ✅ ÉTAPE 4 : Vérifier les logs Grafana

Ouvrez PowerShell et exécutez :

```powershell
# Voir les logs liés aux emails
docker-compose logs grafana --tail 100 | Select-String -Pattern "smtp|email|notification|alertmanager"

# Voir tous les logs récents
docker-compose logs grafana --tail 50
```

**Erreurs courantes** :

**1. Erreur SMTP authentication failed**
```
level=error msg="Failed to send notification" error="SMTP authentication failed"
```
**Solution** : Vérifier le mot de passe Gmail dans docker-compose.yml

**2. Erreur connection refused**
```
level=error msg="Failed to send notification" error="dial tcp: connection refused"
```
**Solution** : Vérifier que le port 587 est accessible

**3. Erreur TLS handshake**
```
level=error msg="Failed to send notification" error="tls: handshake failure"
```
**Solution** : Vérifier GF_SMTP_SKIP_VERIFY=false dans docker-compose.yml

---

### ✅ ÉTAPE 5 : Forcer le déclenchement d'une alerte

Pour tester l'envoi d'email, arrêtez le conteneur app :

```powershell
# Arrêter l'API Laravel
docker-compose stop app

# Attendre 2 minutes que l'alerte se déclenche
Start-Sleep -Seconds 120

# Vérifier l'état de l'alerte dans Grafana
# Allez dans Alerting → Alert rules
# "LaravelAPIDown" devrait être en rouge (Firing)

# Redémarrer l'API
docker-compose start app
```

**Chronologie attendue** :
- T+0s : Conteneur arrêté
- T+60s : Prometheus détecte up{job="laravel-api"} = 0
- T+120s : Alerte passe en "Firing"
- T+130s : Email envoyé à rayanngokeng1@gmail.com

---

### ✅ ÉTAPE 6 : Vérifier la configuration SMTP dans Grafana

```powershell
# Voir la configuration SMTP
docker-compose exec grafana env | Select-String -Pattern "GF_SMTP"
```

**Résultat attendu** :
```
GF_SMTP_ENABLED=true
GF_SMTP_HOST=smtp.gmail.com:587
GF_SMTP_USER=naassarl98@gmail.com
GF_SMTP_PASSWORD=wyjz hjnj vvvm kqqv
GF_SMTP_FROM_ADDRESS=naassarl98@gmail.com
GF_SMTP_FROM_NAME=Laravel Monitoring
GF_SMTP_SKIP_VERIFY=false
```

---

### ✅ ÉTAPE 7 : Recréer le contact point manuellement (si nécessaire)

Si le provisioning ne fonctionne pas, créez le contact point manuellement :

1. Allez dans **Alerting** → **Contact points**
2. Cliquez sur **"+ Add contact point"**
3. Remplissez :
   - **Name** : `Email Rayan Manual`
   - **Integration** : `Email`
   - **Addresses** : `rayanngokeng1@gmail.com`
4. Cliquez sur **"Test"** pour vérifier
5. Cliquez sur **"Save contact point"**
6. Allez dans **Notification policies**
7. Modifiez la politique par défaut pour utiliser "Email Rayan Manual"

---

### ✅ ÉTAPE 8 : Vérifier que le mot de passe Gmail est correct

Le mot de passe utilisé est un **mot de passe d'application Gmail**, pas le mot de passe principal.

**Pour créer un nouveau mot de passe d'application** :
1. Allez sur https://myaccount.google.com/security
2. Activez la validation en 2 étapes (si ce n'est pas déjà fait)
3. Allez dans "Mots de passe des applications"
4. Créez un nouveau mot de passe pour "Mail"
5. Copiez le mot de passe (format : xxxx xxxx xxxx xxxx)
6. Mettez à jour docker-compose.yml :
   ```yaml
   - GF_SMTP_PASSWORD=nouveau mot de passe
   ```
7. Redémarrez Grafana :
   ```powershell
   docker-compose restart grafana
   ```

---

## 🎯 CHECKLIST COMPLÈTE

Avant de dire que ça ne fonctionne pas, vérifiez :

- [ ] Le contact point "Email Rayan" existe dans Grafana
- [ ] Le test d'envoi depuis le contact point fonctionne
- [ ] Les Notification Policies utilisent "Email Rayan" comme contact point par défaut
- [ ] Au moins une alerte est en état "Firing" (rouge/orange)
- [ ] Les logs Grafana ne montrent pas d'erreur SMTP
- [ ] Le mot de passe Gmail est correct (mot de passe d'application)
- [ ] L'email n'est pas dans le dossier Spam
- [ ] Grafana a été redémarré après les modifications

---

## 📧 FORMAT DE L'EMAIL REÇU

Quand tout fonctionne, vous recevrez un email comme ceci :

**Sujet** :
```
[FIRING:1] LaravelAPIDown
```

**Expéditeur** :
```
Laravel Monitoring <naassarl98@gmail.com>
```

**Destinataire** :
```
rayanngokeng1@gmail.com
```

**Contenu** :
```
[FIRING:1]

LaravelAPIDown Laravel Alerts

Labels:
  alertname = LaravelAPIDown
  category = application
  grafana_folder = Laravel Alerts
  job = laravel-api
  severity = critical

Annotations:
  description = L'API Laravel ne répond plus depuis plus de 1 minute. 
                Vérifiez les conteneurs Docker.
  summary = 🚨 API Laravel indisponible

Source: http://localhost:3000/alerting/grafana/...

Silence: http://localhost:3000/alerting/silence/new?...
```

---

## 🚨 SI RIEN NE FONCTIONNE

Essayez cette solution alternative avec un contact point manuel :

```powershell
# 1. Supprimer le fichier de provisioning
Remove-Item grafana/provisioning/alerting/contactpoints.yaml

# 2. Redémarrer Grafana
docker-compose restart grafana

# 3. Attendre 10 secondes
Start-Sleep -Seconds 10

# 4. Créer le contact point manuellement dans l'interface Grafana
# (voir ÉTAPE 7 ci-dessus)
```

---

## 💡 CONSEIL FINAL

La cause la plus fréquente d'absence d'emails est que **les Notification Policies ne sont pas configurées**. Même si les alertes se déclenchent et que le contact point existe, Grafana ne sait pas où envoyer les notifications sans une policy.

**Vérifiez toujours** : Alerting → Notification policies → Default contact point = "Email Rayan"
