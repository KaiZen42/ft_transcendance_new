DOCKER_COMPOSE = docker-compose
DOCKER_COMPOSE_FILE = ./docker-compose.yml
ENV_FILE = ./.env

all:	up
up:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) --env-file $(ENV_FILE) up --build
down:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) --env-file $(ENV_FILE) down
ps:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) ps

re: all

.PHONY: all up down ps