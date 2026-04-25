CAMWATERPRO API

Pipeline CI/CD & Observabilité

| Projet | CamwaterPRO API |
| --- | --- |
| Dépôt GitHub | github.com/Corei913th/camwater_api |
| Stack | Laravel 11 · PHP 8.2 · PostgreSQL 15 · Docker · Kubernetes |
| CI/CD | GitHub Actions → Docker Hub |
| Observabilité | ELK Stack · Prometheus · Grafana · Alertmanager |
| Version doc | 1.0  2025 |
| Auteur | BOGNING ZEUGUE Fredy |

Documentation Technique Officielle

Sommaire

I. Présentation du projet ......................................................
................................................................. 4 II. Concepts
 fondamentaux du CI/CD..........................................................
........................................ 5 2.1 Intégration Continue (CI) .......
................................................................................
.................... 5 2.2 Déploiement Continu (CD) ............................
............................................................................ 5 I
II. Stratégie de gestion du code................................................
........................................................... 5 3.1 Workflow des b
ranches (GitHub Flow) ..........................................................
........................... 5 3.2 Convention de commits (Conventional Commits) .
.................................................................... 5 IV. Pipel
ine GitHub Actions .............................................................
................................................... 6 4.1 Workflow de Validation
 (CI) ..........................................................................
........................... 6 4.2 Workflow de Déploiement (CD Production) ......
....................................................................... 6 V. Obs
ervabilité & Monitoring ........................................................
.................................................... 7 5.1 Dashboards Grafana ..
................................................................................
................................. 7 A. Strategic Dashboard v2 (Opérations) .....
................................................................................
.. 7 B. Business KPIs (Direction) ..............................................
.......................................................... 8 5.2 Alerting (Alert
manager) .......................................................................
...................................... 9 5.3 Centralisation des logs (ELK Stack)
 ...............................................................................
........... 9 VI. Déploiement & Infrastructure .................................
..................................................................... 10 6.1 Doc
ker Compose (environnement standard) ...........................................
................................. 10 6.2 Kubernetes (évolution scalable) .......
................................................................................
........ 10

Page 1

Glossaire

Les termes suivants sont utilisés tout au long de cette documentation.

| Terme |
| --- |
| CI -Continuous<br>Integration |
| CD -Continuous<br>Deployment |
| Docker |
| Kubernetes (K8s) |
| GitHub Actions |
| Prometheus |
| Grafana |

Définition

Pratique consistant à intégrer les modifications de code fréquemment (plusieurs
fois par jour) dans une branche

pipeline de tests pour détecter les régressions au plus tôt.

automatiquement déployé en production sans intervention

ligne.

Plateforme de conteneurisation qui isole chaque service (application, base de do
nnées, serveur web) dans un

le code fonctionne identiquement en développement et en production.

Utilisé pour la version scalable de CamwaterPRO.

de CI/CD défini dans des fichiers YAML.

Outil de collecte de métriques open-source. Il interroge ("scrape") régulièremen
t l'endpoint /api/metrics de l'application pour enregistrer des indicateurs numé
riques (taux d'erreur, temps de réponse, utilisation mémoire).

Plateforme de visualisation qui consomme les données de

et métier (KPIs).

ELK Stack Ensemble de trois outils : Elasticsearch (stockage et

Kibana (interface de recherche et visualisation). Filebeat

commune. Chaque intégration déclenche automatiquement un

| Extension de la CI : dès que le code passe tous les tests, il est<br>manuelle.
 Réduit le délai entre l'écriture du code et sa mise en |
| --- |
| environnement reproductible appelé conteneur. Garantit que |
| Orchestrateur de conteneurs qui automatise le déploiement, la<br>mise à l'éche
lle et la gestion des applications conteneurisées. |
| Service d'automatisation intégré à GitHub. Chaque événement<br>sur le dépôt (p
ush, pull request) peut déclencher un workflow |
| Prometheus pour construire des tableaux de bord interactifs.<br>Utilisé ici po
ur deux niveaux : opérationnel (santé technique) |
| indexation des logs), Logstash (transformation et routage),<br>collecte les lo
gs sur les machines et les envoie vers Logstash. |

Page 2

| Terme |
| --- |
| Alertmanager |
| Scrape |
| P95 (Percentile 95) |
| SAST -Static<br>Application Security<br>Testing |
| IaC -Infrastructure as<br>Code |
| (HPA) |
| Conventional Commits |

Définition

une notification par email ou webhook.

Action par laquelle Prometheus interroge activement un endpoint HTTP (/api/metri
cs) pour lire les métriques exposées par l'application. Distinct d'un push : c'e
st Prometheus qui vient chercher les données.

aberrantes (timeouts, pics isolés) pour avoir une mesure représentative des perf
ormances réelles.

sans exécuter le programme. Réalisé ici par PHPStan et Gitleaks dans le workflow
 de CI.

Pratique consistant à décrire l'infrastructure (serveurs, réseaux, conteneurs) d
ans des fichiers de configuration versionnés. Le scan IaC (Trivy) vérifie ces fi
chiers pour détecter des mauvaises configurations.

HorizontalPodAutoscaler Ressource Kubernetes qui ajuste automatiquement le nombr
e de réplicas d'un service en fonction de la charge CPU ou

des changelogs et de comprendre l'historique du projet au premier coup d'oeil.

| Composant de la suite Prometheus qui gère les règles d'alerte.<br>Lorsqu'un se
uil est franchi (ex. taux d'erreur > 5 %), il envoie |
| --- |
| Indicateur de latence signifiant que 95 % des requêtes ont été<br>traitées en
dessous de ce temps. Permet d'exclure les valeurs |
| Analyse du code source à la recherche de failles de sécurité, |
| mémoire. Configuré de 2 à 10 réplicas pour CamwaterPRO. |
| Convention de formatage des messages de commit Git (feat:,<br>fix:, ci:, docs:
, etc.) permettant de générer automatiquement |

Page 3

I. Introduction & Présentation du projet CamwaterPRO API est une application bac
kend développée avec Laravel 11 (PHP 8.2), conçue pour gérer la facturation, les
 abonnements et les réclamations clients de Camwater. L'API expose des endpoints
 REST consommés par les interfaces de gestion interne et par les agents terrain.

La stack technique combine PostgreSQL 15 pour la persistance des données, Docker
 pour l'isolation des services en développement et en production, et Nginx comme
 reverse proxy. L'hébergement de production s'appuie sur O2Switch (serveur mutua
lisé), avec une trajectoire d'évolution vers Kubernetes pour absorber la montée
en charge.

Ce document décrit l'ensemble du dispositif CI/CD mis en place sur GitHub Action
s, ainsi que la couche d'observabilité (métriques, logs, alertes) qui permet de
surveiller la santé de l'application en production.

| Composant | Technologie | Rôle dans le projet |
| --- | --- | --- |
| Backend | Laravel 11 / PHP<br>8.2 |  |
| Base de données | PostgreSQL 15 | réclamations |
| Conteneurisation | Docker | Isolation et reproductibilité des services<br>(App
, Nginx, DB) |
| Métriques | Prometheus | Collecte des indicateurs via scrape sur<br>/api/metri
cs |
| Visualisation | Grafana |  |
| Logs centralisés | ELK Stack | Kibana |
| Alertes | Alertmanager | Notifications email sur seuils critiques |

| API REST, logique métier, administration |
| --- |
| Stockage persistant des abonnés, factures, |
| Tableaux de bord opérationnels et métier |
| Filebeat → Logstash → Elasticsearch → |

Page 4

II. Concepts fondamentaux du CI/CD

2.1 Intégration Continue (CI)

développeur pousse du code sur le dépôt, un ensemble de vérifications automatiqu
es s'exécute immédiatement. Si l'une d'elles échoue, la fusion vers la branche p
rincipale est bloquée.

Pour CamwaterPRO, la CI enchaîne les étapes suivantes dans l'ordre : – Linting (
Laravel Pint) : vérification du style de code selon PSR-12.

base PostgreSQL éphémère.

2.2 Déploiement Continu (CD)

Le Déploiement Continu prend le relais une fois la CI validée. Il est découpé en
 deux niveaux distincts :

correctement.

III. Stratégie de gestion du code

3.1 Workflow des branches (GitHub Flow)

Le projet adopte le GitHub Flow, un modèle de branches léger et adapté aux déplo
iements fréquents. Quatre types de branches structurent le développement :

Le code qui y arrive doit obligatoirement avoir passé la CI.

avant de rejoindre main.

non urgente. Supprimées après fusion.

production. Fusionnées dans main et develop.

3.2 Convention de commits (Conventional Commits)

Tous les messages de commit respectent la convention Conventional Commits, qui i
mpose un

générer automatiquement des changelogs.

L'Intégration Continue est le premier pilier du pipeline. Son principe est simpl
e : chaque fois qu'un

– Analyse statique (Larastan) : détection des erreurs de logique sans exécuter l
e code.

– Tests unitaires & fonctionnels (Artisan Test) : validation du comportement de
l'API sur une

– Livraison Continue : l'image Docker de l'application est construite et publiée
 sur Docker Hub. Cette image versionée constitue l'artefact de référence pour to
ut déploiement.

– Déploiement Continu : les fichiers sont synchronisés vers le serveur O2Switch
via FTP- Deploy-Action, suivi d'un Health Check post-déploiement pour confirmer
que l'API répond

– main : branche de production. Tout commit sur main déclenche le pipeline de dé
ploiement.

– develop : branche d'intégration et de staging. Les fonctionnalités terminées s
ont fusionnées ici

– feature/* : branches à vie courte créées pour chaque nouvelle fonctionnalité o
u correction

– hotfix/* : branches d'urgence créées directement depuis main pour corriger un
bug critique en

format structuré permettant de comprendre l'intention d'un changement d'un seul
coup d'oeil et de

Page 5

– feat(api): ajout d'une nouvelle fonctionnalité à l'API.

– fix(auth): correction d'un bug dans le module d'authentification.

– ci(monitoring): modification des workflows GitHub Actions ou de la configurati
on de monitoring.

IV. Pipeline GitHub Actions

4.1 Workflow de Validation (CI)

Ce workflow se déclenche à chaque push sur n'importe quelle branche. Il constitu
e le garde-fou principal avant toute fusion. Il est composé de six jobs exécutés
 dans l'ordre :

| Job | Outil(s) | Objectif |
| --- | --- | --- |
| Security Audit | composer audit ·<br>PHPStan | Détecte les failles connues dan
s les<br>dépendances Composer et les erreurs de<br>logique dans le code (analyse
 SAST). |
| Secret Scanning | Gitleaks | Parcourt tout l'historique Git pour s'assurer<br>
été accidentellement commité. |
| IaC Scan | Trivy | Analyse le Dockerfile et les fichiers de<br>pratiques ou de
s vulnérabilités dans<br>l'infrastructure déclarée. |
| Lint & Style | Laravel Pint | Vérifie que tout le code PHP respecte<br>style s
ont signalés et bloquants. |
| Tests | php artisan test |  |
|  |  | contre une base PostgreSQL éphémère |
|  |  | provisionnée pour l'occasion. |
| SonarQube | sonar-scanner |  |
|  |  | dette technique, duplication, complexité |
|  |  | passent. |

4.2 Workflow de Déploiement (CD Production)

Ce workflow ne se déclenche que lorsque la CI est entièrement validée sur la bra
nche main. Il garantit qu'aucun code défaillant n'atteint la production.

qu'aucun mot de passe, clé API ou token n'a

| configuration pour identifier des mauvaises |
| --- |
| strictement la norme PSR-12. Les écarts de |
| Lance la suite de tests unitaires et fonctionnels |
| Analyse finale de la qualité globale du code :<br>cyclomatique. Exécuté unique
ment si les tests |

Page 6

| Étape | Description détaillée |
| --- | --- |
| 1 -Vérification CI | déploiement est annulé immédiatement. |
| 2 -Préparation | secrets GitHub (APP_KEY, DB_PASSWORD, etc.). Aucune<br>inform
ation sensible n'est stockée en clair dans le dépôt. |
| 3 -Synchronisation | Transfert des fichiers vers le répertoire api/ de l'héber
gement<br>sont transférés pour minimiser le temps d'indisponibilité. |
| 4 -Post-déploiement |  |

V. Observabilité & Monitoring L'observabilité désigne la capacité à comprendre l
'état interne d'un système à partir de ses sorties externes. Pour CamwaterPRO, e
lle repose sur trois piliers complémentaires : les métriques (Prometheus / Grafa
na), les logs (ELK Stack) et les alertes (Alertmanager).

5.1 Dashboards Grafana

Deux tableaux de bord ont été mis en place pour couvrir des audiences différente
s.

A. Strategic Dashboard v2 (Opérations)

Ce dashboard est destiné aux équipes techniques. Il surveille en temps réel la r
éactivité et la stabilité de l'application.

– Taux d'Erreur Global : jauge visuelle basée sur la proportion de réponses HTTP
 4xx et 5xx.

Un dépassement du seuil de 5 % déclenche une alerte automatique.

– Temps de Réponse Moyen : mesuré en millisecondes via un middleware Laravel inj
ecté dans chaque requête. Permet de détecter des dégradations progressives de pe
rformance.

– Santé Infrastructure : utilisation CPU et RAM du serveur, ainsi que l'état de
la connexion à PostgreSQL.

| Le workflow vérifie explicitement que le workflow de validation<br>précédent s
'est terminé avec succès. Si la CI n'est pas passée, le |
| --- |
| Génération sécurisée du fichier .env de production à partir des |
| O2Switch via FTP-Deploy-Action. Seuls les fichiers modifiés |
| Exécution sur le serveur des migrations de base de données (php<br>artisan mig
rate) et vidage des caches applicatifs (config, routes,<br>vues) pour que les ch
angements prennent effet immédiatement. |

Page 7

Capture 1 - Jauges d'erreurs et courbes de latence.

B. Business KPIs (Direction)

métier compréhensibles.

en attente de paiement (Pending).

Prometheus.

taux de recouvrement.

Ce dashboard est destiné aux décideurs non techniques. Il traduit l'activité de
l'API en indicateurs

– Chiffre d'Affaires : répartition en temps réel entre les montants encaissés (C
ollected) et ceux

– Croissance Abonnés : compteur du nombre total d'abonnés actifs, mis à jour à c
haque scrape

– Volume Facturation : décompte des factures par statut (payées / impayées) pour
 suivre le

Page 8

Capture 2 - Statistiques de revenus et nombre d'abonnés.

5.2 Alerting (Alertmanager)

sont configurées et déclenchent une notification par email :

| Alerte | Condition de déclenchement |
| --- | --- |
| HighErrorRate | Taux d'erreurs HTTP (4xx/5xx)<br>supérieur à 5 % sur une fenêt
re<br>glissante |
| DatabaseDown | Perte de connexion à<br>PostgreSQL détectée |
| AppServiceDown | L'endpoint de healthcheck de<br>l'API ne répond plus |

5.3 Centralisation des logs (ELK Stack)

faciliter le débogage et l'audit. La chaîne de traitement est la suivante :

sur Windows.

Alertmanager surveille en permanence les métriques collectées par Prometheus. Tr
ois règles d'alerte

| Impact opérationnel |
| --- |
| Signale une dégradation de<br>l'API susceptible d'affecter les<br>utilisateurs
 finaux. |
| Blocage total des opérations de<br>lecture et d'écriture.<br>Intervention immé
diate<br>requise. |
| L'application est hors ligne.<br>Tous les services dépendants<br>sont impactés
. |

Les logs applicatifs de Laravel sont structurés en JSON et centralisés dans une
pile ELK pour

– Filebeat : agent léger déployé sur le serveur, il lit les fichiers de logs de
Laravel et les transmet vers Logstash. Lancé avec l'option --strict.perms=false
pour compatibilité Docker

Page 9

route vers Elasticsearch.

en texte intégral sur l'historique des événements.

analyser les entrées de log en temps réel.

Capture 3 - Vue Discover avec les logs JSON structurés de Laravel.

VI. Déploiement & Infrastructure

6.1 Docker Compose (environnement standard)

propre conteneur avec des réseaux et volumes dédiés, garantissant la reproductib
ilité de l'environnement entre les membres de l'équipe.

6.2 Kubernetes (évolution scalable)

ressources sont organisées selon le type de workload :

jour sans interruption de service.

identité réseau stable et un stockage persistant.

fonction de la charge CPU mesurée.

– Logstash : reçoit les logs bruts, les parse (champs timestamp, level, message,
 context) et les

– Elasticsearch : stocke et indexe les logs sous le pattern laravel-logs-*. Perm
et des recherches

– Kibana : interface web de consultation des logs. La vue Discover permet de fil
trer, trier et

Docker Compose orchestre les 14 services du stack de manière coordonnée sur un s
eul hôte. Il est utilisé en développement local et pour l'environnement de stagi
ng. Chaque service est isolé dans son

Pour absorber une charge croissante, l'architecture est pensée pour migrer vers
Kubernetes. Les

– Deployments (Laravel, Nginx) : services sans état (stateless) pouvant être rép
liqués et mis à

– StatefulSets (PostgreSQL, Elasticsearch) : services avec état (stateful) néces
sitant une

– HorizontalPodAutoscaler : ajuste automatiquement le nombre de réplicas entre 2
 et 10 en

Page 10

Conclusion

sécurité des dépendances, analyse statique, conformité de style, tests fonctionn
els, scan

d'introduire des régressions ou des vulnérabilités non détectées.

assure une détection proactive des anomalies critiques.

pour accompagner la montée en charge du service.

la distribution d'eau.

CamwaterPRO API repose sur un pipeline CI/CD conçu pour éliminer les risques lié
s au déploiement manuel. Chaque modification de code traverse obligatoirement si
x étapes de validation

d'infrastructure et audit qualité avant d'atteindre la production. Ce dispositif
 réduit la probabilité

La couche d'observabilité complète cette approche en offrant une visibilité cont
inue sur l'état réel du système. Les métriques Prometheus alimentent deux niveau
x de lecture : un tableau de bord opérationnel pour les équipes techniques, et u
n tableau de bord métier pour la direction. Les logs centralisés via ELK permett
ent de diagnostiquer rapidement tout incident, tandis qu'Alertmanager

L'architecture actuelle, déployée sur O2Switch via Docker Compose, est dimension
née pour les besoins présents. La trajectoire vers Kubernetes avec HorizontalPod
Autoscaler est déjà planifiée

Au total, ce dispositif transforme le déploiement d'un acte risqué en un process
us reproductible, auditable et automatisé condition nécessaire à la fiabilité d'
un service critique comme la gestion de
