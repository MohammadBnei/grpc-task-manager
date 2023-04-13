# Exercice

## Création d'une nouvelle API

En binome, vous allez devoir créer une nouvelle API à connecter aux microservices existant.

Choisissez un service à ajouter (génération de description par IA, service d'enregistrement de medias, ...) et définissez un fichier protobuf. Ce fichier sera a faire valider par l'intervenant.

Votre service devra contenir au moins 3 fonctions.

Implémentez ensuite le service dans les technologies de votre choix. Pour ne pas surcharger l'infrastructure, choisissez une BDD mongo ou mysql (mariadb).

Votre API devra suivre les bonnes pratiques suivantes :
 - Vérification au lancement de la présence dans les variables d'environnement des éléments de configuration nécessaires
 - PORT configurable via les variables d'environnement
 - HealthCheck
 - OpenTelemetry
 - Insecure flag pour lancer l'api en mode sécurisée ou non (TLS)

Votre API devra contenir au moins une route protégée par JWT.