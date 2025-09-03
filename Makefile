postgres:
	docker run --name mypostgres -e POSTGRES_PASSWORD=letme1n -e POSTGRES_USER=root -p 5432:5432 -d postgres:17-alpine

redis:
	docker run --name myredis -p 6379:6379 -d redis:7.4-alpine

createdb:
	docker exec -it mypostgres createdb --username=root --owner=root vecsys-exam

createextension:
	docker exec -it mypostgres psql -U root -d vecsys-exam -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'

dropdb:
	docker exec -it mypostgres dropdb vecsys-exam

.PHONY: postgres createdb dropdb redis createextension deploy_dev