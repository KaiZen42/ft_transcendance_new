DOCKER_COMPOSE = docker-compose
DOCKER_COMPOSE_FILE = ./docker-compose.yml
ENV_FILE = ./.env

all:	install up
up: 
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) --env-file $(ENV_FILE) up --build
down:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) --env-file $(ENV_FILE) down
ps:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) ps

re: clear all

clear: 
		./cleanup.sh


fast_git:	
			@clear
			@git status
			@echo "What should I push?";\
			read PUSH;\
			git add $$PUSH && clear;\
			git status
		    @ echo "Write the commit:";\
			read COMMIT;\
			git commit -m  "$$COMMIT" && git push

install: 
		npm install ./src/front;
		npm install ./src/back;

clear_space:
			@rm -rf ~/Library/Caches
			@rm -rf ~/Library/Application\ Support/Slack/Cache
			@rm -rf ~/Library/Application\ Support/Slack/Service\ Worker/CacheStorage
			@rm -rf ~/Library/Application\ Support/Code/Crashpad
			@rm -rf ~/Library/Application\ Support/Code/Cache
			@rm -rf ~/Library/Application\ Support/Code/User/workspaceStorage
			@rm -rf ~/Library/Application\ Support/Code/CachedData
			@rm -rf ~/Library/Application\ Support/Chrome/Default
			@rm -rf ~/Library/Developer/CoreSimulator
			@rm -rf ~/Library/Containers/com.docker.docker

.PHONY: all up down ps