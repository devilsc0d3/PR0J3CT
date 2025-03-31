
# Makefile for PR0J3CT

.PHONY help:
help:
	@echo make title
	@echo make up
	@echo make down

.PHONY title:
title:
	@echo "PR0J3CT"

.PHONY up:
up:
	cd ./docker && docker-compose up -d

.PHONY down:
down:
	cd ./docker && docker-compose down