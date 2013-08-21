MOCHA_OPTS= --check-leaks
REPORTER = nyan

check:test

test: test-unit

test-unit:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS)

test-acceptance:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--bail \
		test/test-acceptance/*.js

.PHONY: test test-unit test-acceptance