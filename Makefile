update:
	docker run -it --rm --pull always -v $(CURDIR):/data --entrypoint npm ghcr.io/anweber/httpyac update
