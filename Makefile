SHELL := /bin/bash
VERSION=$(shell git rev-parse --short HEAD)
APP_NAME=datte
DOCKER_REPO=registry.gitlab.com/datte-company

dpl ?= .env
include $(dpl)
export $(shell sed 's/=.*//' $(dpl))

.PHONY: help build-prod build-dev build mysql init-mysql prod dev version tag-latest tag-version push attach clean clean-all info

help:
	@echo ""
	@echo "Usage: make [TARGET]"
	@echo "Targets:"
	@echo "  build-prod      Build l'image Docker pour la production"
	@echo "  build-dev       Build l'image Docker pour le développement"
	@echo "  build           Alias pour build-dev"
	@echo "  mysql           Lance un conteneur MySQL"
	@echo "  init-mysql      Initialise les permissions MySQL"
	@echo "  prod            Démarre le conteneur en mode production"
	@echo "  dev             Démarre le conteneur en mode développement"
	@echo "  version         Affiche la version actuelle (commit hash)"
	@echo "  tag-latest      Tag l'image avec 'latest'"
	@echo "  tag-version     Tag l'image avec la version actuelle"
	@echo "  push            Push l'image sur le registre"
	@echo "  attach          Attache un terminal au conteneur en cours"
	@echo "  clean           Supprime le conteneur en cours"
	@echo "  clean-all       Supprime tous les conteneurs liés à l'application"
	@echo "  info            Affiche les détails du conteneur"

start:
	@echo "Starting container..."
	docker compose up -d

stop:
	@echo "Stopping container..."
	docker compose stop

# Build pour production
build-prod:
	@echo "Building production image..."
	@docker build --progress=plain . -t $(APP_NAME) -f ./container/dockerfile/Dockerfile.prod

# Build pour développement
build-dev:
	@echo "Building development image..."
	@docker build --progress=plain . -t $(APP_NAME)-dev -f ./container/dockerfile/Dockerfile.dev

build: build-dev


deploy-db:
	@echo "Deploying correct database..."
	@./scripts/deploy.sh

# Add here ALL type of databases MySQL, Redis, PostgreSQL, etc
# ----------------------------------------------------------------------------------------------------------------
# MySQL
mysql: network
	@echo "Starting MySQL container..."
	@docker run --name mysql -e MYSQL_DATABASE=${MYSQL_DATABASE} -e MYSQL_ROOT_PASSWORD=${MYSQL_PASSWORD} -d mysql:5.7
	@docker network connect datte-network mysql

init-mysql:
	@echo "Initializing MySQL permissions..."
	@docker exec -it mysql mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" -e "GRANT ALL PRIVILEGES ON *.* TO '${MYSQL_USER}'@'%' IDENTIFIED BY '${MYSQL_PASSWORD}' WITH GRANT OPTION; FLUSH PRIVILEGES;"



# MariaDB
mariadb: network
	@echo "Starting MariaDB container..."
	@docker compose up -d mariadb
	@docker network connect datte-network mariadb

# Redis
REDIS_CMD=docker compose exec redis redis-cli
REDIS_PWD=-a ${shell grep REDIS_PASSWORD .env | cut -d '=' -f2}  # Get the password from .env

redis-cli:
	@echo "Starting Redis container..."
	${REDIS_CMD} ${REDIS_PWD}

redis-status:
	@echo "=== Redis Status ==="
	${REDIS_CMD} ${REDIS_PWD} INFO | grep used_memory_human
	${REDIS_CMD} ${REDIS_PWD} INFO | grep connected_clients

redis-reset:
	${REDIS_CMD} ${REDIS_PWD} FLUSHALL
	@echo "Redis flushed"

redis: network
	@echo "Starting Redis container..."
	@docker compose up -d redis
	@docker network connect datte-network redis




# PostgreSQL
postgresql: network
	@echo "Starting PostgreSQL container..."
	@docker run --name postgresql -e POSTGRES_DB=${POSTGRES_DB} -e POSTGRES_USER=${POSTGRES_USER} -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} -d postgres:latest
	@docker network connect datte-network postgresql
	@echo "Waiting for PostgreSQL to be ready..."
	@sleep 5  # Wait 5 seconds to be sure the container is ready
	@until docker exec postgresql pg_isready -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" > /dev/null 2>&1; do sleep 1; done
	@echo "PostgreSQL is ready!"
	@$(MAKE) init-postgresql

init-postgresql:
	@echo "Initializing PostgreSQL database and permissions..."
	@docker exec -it postgresql sh -c "psql -U \"${POSTGRES_USER}\" -d postgres -c \"SELECT 1 FROM pg_database WHERE datname = '${POSTGRES_DB}';\""
	@docker exec -it postgresql sh -c 'psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -c "ALTER USER ${POSTGRES_USER} WITH SUPERUSER;"'



# SQLite
init-sqlite:
	@echo "Initializing SQLite database..."
	# @docker compose exec back sh -c "touch /app/data/datte.sqlite"
	@docker compose exec back sh -c "mkdir -p /app/data && touch /app/data/datte.sqlite && chmod 777 /app/data/datte.sqlite"
	@echo "SQLite database initialized inside container."

sqlite: network
	@echo "Starting SQLite container..."
	@$(MAKE) init-sqlite
	@echo "SQLite setup complete!"



# MSSQL
mssql: network
	@echo "Starting MSSQL container..."
	@docker compose up -d mssql
	@echo "Connect to network..."
	@docker network connect datte-network mssql
	@echo "Waiting for MSSQL to be ready..."
	@sleep 5
	@docker compose logs --tail=10 mssql




# MongoDB
mongodb: network
	@echo "Starting MongoDB container..."
	@docker compose up -d mongodb
	@echo "Connect to network..."
	@docker network connect datte-network mongodb
	@echo "Waiting for MongoDB to be ready..."
	@sleep 5
	@docker compose logs --tail=10 mongodb

# Build for production or development
# ----------------------------------------------------------------------------------------------------------------
# Put the db that you want to use here : 
# prod: build-prod network [HERE]
# ----------------------------------------------------------------------------------------------------------------
prod: deploy-db build-prod network ${MY_DB}
	@echo "Running production container..."
	@docker run --name $(APP_NAME) -p ${PORT}:${PORT} \
		--env-file=.env \
		--network=datte-network \
		-v $(APP_NAME)-logs:/app/logs \
		-d $(APP_NAME)
	@echo "Logs: $(APP_NAME)-logs"
	@docker logs -f $(APP_NAME)

dev: build network
	@echo "Running development container..."
	@docker run --name $(APP_NAME) -p ${PORT}:${PORT} -it --rm --env-file=.env -d $(APP_NAME)-dev
	@docker network connect datte-network $(APP_NAME)
	@docker logs -f $(APP_NAME)


#-p ${PORT}:${PORT}

version:
	@echo "Current version: $(VERSION)"

tag-latest:
	@echo "Tagging image as latest..."
	@docker tag $(APP_NAME) $(DOCKER_REPO)/$(APP_NAME):latest

tag-version:
	@echo "Tagging image with version $(VERSION)..."
	@docker tag $(APP_NAME) $(DOCKER_REPO)/$(APP_NAME):$(VERSION)

push: build tag-version tag-latest
	@echo "Publishing version $(VERSION) to $(DOCKER_REPO)..."
	@docker push $(DOCKER_REPO)/$(APP_NAME):$(VERSION)
	@docker push $(DOCKER_REPO)/$(APP_NAME):latest

attach:
	@echo "Attaching to container..."
	@docker attach $(APP_NAME)

clean:
	@echo "Stopping and removing container $(APP_NAME)..."
	@docker container stop $(APP_NAME) || true
	@docker container rm $(APP_NAME) || true
	@docker container stop mysql || true
	@docker container rm mysql || true
	@docker container stop mariadb || true
	@docker container rm mariadb || true
	@docker container stop redis || true
	@docker container rm redis || true
	@docker container stop postgresql || true
	@docker container rm postgresql || true
	@docker container stop sqlite || true
	@docker container rm sqlite || true
	@docker container stop mssql || true
	@docker container rm mssql || true
	@docker container stop mongodb || true
	@docker container rm mongodb || true
	
clean-all:
	@echo "Removing all containers related to $(APP_NAME)..."
	@docker ps -a | grep $(APP_NAME) | awk '{print $$1}' | xargs -r docker rm -f

info:
	@echo "Fetching container info..."
	@docker inspect $(APP_NAME)

network:
	@echo "Creating network..."
	@docker network create datte-network 2>/dev/null || true
