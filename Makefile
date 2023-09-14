.PHONY: test
test:
	docker run -it --rm --pull always -v $(CURDIR):/data --entrypoint bash ghcr.io/anweber/httpyac -c 'unset NODE_ENV && npm install && npm test'
	rm -rf node_modules

update:
	docker run -it --rm --pull always -v $(CURDIR):/data --entrypoint npm ghcr.io/anweber/httpyac update
	rm -rf node_modules

dev:
	docker run -it --rm --pull always -v $(CURDIR):/data --entrypoint bash ghcr.io/anweber/httpyac
