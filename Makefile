help:
	@echo start:
	@echo 	starts whole application

start:
	@docker-compose -p juicify -f Docker-compose.dev.yml up --build

deploy:
	@docker-compose -p juicify -f Docker-compose.yml up --build -d
