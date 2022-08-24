.PHONY: start stop restart install clean development
	
install: start
	docker-compose exec node npm install

start:
	docker-compose up --detach

stop:
	docker-compose down --remove-orphans --volumes --timeout 0
	
restart: stop start
	
clean: start
	docker-compose exec node rm -rf .npm node_modules .node_repl_history
	
dev: start
	docker-compose exec node npm run dev