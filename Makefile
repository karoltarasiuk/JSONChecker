.PHONY: default tests open

default:
	@echo "run make [open|tests]"

open:
	open http://localhost:8000/
	python -m SimpleHTTPServer 8000

tests:
	rm tests/jasmine/src/JSONChecker.js
	cp src/* tests/jasmine/src/
	open tests/jasmine/SpecRunner.html
