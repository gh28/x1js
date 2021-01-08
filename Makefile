.PHONY: all
all:
	@bash build/make-minjs.sh
	@bash build/make-demo.sh

.PHONY: clean
clean:
	@echo "cleaning ..."
	@rm -rf ./out
