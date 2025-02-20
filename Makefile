SHELL := /bin/bash
VERSION=$(shell git rev-parse --short HEAD)
APP_NAME=datte-node
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

# Build pour production
build-prod:
	@echo "Building production image..."
	@docker build --progress=plain . -t $(APP_NAME) -f ./docker/Dockerfile.prod

# Build pour développement
build-dev:
	@echo "Building development image..."
	@docker build --progress=plain . -t $(APP_NAME)-dev -f ./docker/Dockerfile.dev

build: build-dev

mysql: network
	@echo "Starting MySQL container..."
	@docker run --name mysql -e MYSQL_DATABASE=${MYSQL_DATABASE} -e MYSQL_ROOT_PASSWORD=${MYSQL_PASSWORD} -d mysql:5.7
	@docker network connect datte-network mysql

init-mysql:
	@echo "Initializing MySQL permissions..."
	@docker exec -it mysql mysql -uroot -p"${MYSQL_ROOT_PASSWORD}" -e "GRANT ALL PRIVILEGES ON *.* TO '${MYSQL_USER}'@'%' IDENTIFIED BY '${MYSQL_PASSWORD}' WITH GRANT OPTION; FLUSH PRIVILEGES;"

prod: build-prod network mysql
	@echo "Running production container..."
	@docker run --name $(APP_NAME) -p ${PORT}:${PORT} \
		--env-file=.env \
		--network=datte-network \
		-v $(APP_NAME)-logs:/app/logs \
		-d $(APP_NAME)
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

clean-all:
	@echo "Removing all containers related to $(APP_NAME)..."
	@docker ps -a | grep $(APP_NAME) | awk '{print $$1}' | xargs -r docker rm -f

info:
	@echo "Fetching container info..."
	@docker inspect $(APP_NAME)

network:
	@echo "Creating network..."
	@docker network create datte-network 2>/dev/null || true
