.PHONY: all
all:
	@bash x1js/build/build.sh
	@bash FileServer/build/build.sh

.PHONY: clean
clean:
	@echo "cleaning ..."
	@rm -rf x1js/out
	@rm -rf FileServer/out
