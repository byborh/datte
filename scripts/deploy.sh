#!/bin/bash

set -e  # Stoppe le script si une commande échoue

# Charger les variables d'environnement depuis .env
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Nettoyer MY_DB pour éviter les caractères cachés (Windows CRLF)
MY_DB=$(echo "$MY_DB" | tr -d '\r')

# Vérifier que MY_DB est bien défini
if [ -z "$MY_DB" ]; then
    echo "❌ Erreur : MY_DB n'est pas défini dans .env"
    exit 1
fi

# Supprimer l'ancien fichier docker-compose.yml
rm -f docker-compose.yml

# Copier le bon fichier docker-compose
cp "./container/docker-compose/docker-compose.${MY_DB}.yml" "./docker-compose.yml"

echo "✔️ docker-compose.yml file updated with $MY_DB configuration"
