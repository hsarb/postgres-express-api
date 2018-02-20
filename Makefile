BREW ?= brew
DB := postgres
MAKE ?= make
NPM ?= npm
YARN ?= yarn
OSTYPE := $(shell uname)
POSTGRES ?= postgres
PSQL ?= psql
USER := postgres
PASSWORD := postgres

ifeq ($(OSTYPE), Darwin)
install:
	$(MAKE) clean
	$(MAKE) install-modules
	$(MAKE) install-osx
	$(MAKE) setup-db
else
install:
	$(MAKE) clean
	$(MAKE) install-modules
	$(MAKE) install-linux
	$(MAKE) setup-db-linux
endif

clean:

	@echo "Removing node_modules"
	rm -rf node_modules/

install-linux:
	@echo "Installing Linux"

	sudo apt-get update
	sudo apt-get install postgresql postgresql-contrib

install-osx:

	@echo "Updating brew"
	$(BREW) update

	@echo "Uninstalling postgres"
	$(BREW) uninstall --force postgres

	@echo "Reinstalling postgres"
	$(BREW) install postgres

	@echo "Starting postgres"
	$(BREW) services start postgres

install-modules:
	$(NPM) install yarn -g

	@echo "Installing node modules"
	$(YARN)

setup-db:

	@echo "Initializing $(DB) database"
	@if $(PSQL) -lqt | cut -d \| -f 1 | grep -qw $(DB) ; then \
		echo "Database already exists" ; \
	else \
		createdb $(DB) ; \
	fi

	@echo "Creating user"
	@if $(PSQL) $(DB) -tAc "SELECT 1 FROM pg_roles WHERE rolname='$(USER)'" | grep -q 1 ; then \
		echo "User already exists" ; \
	else \
		$(PSQL) $(DB) -c "CREATE USER $(USER) WITH PASSWORD '$(PASSWORD)';" ; \
	fi

	@echo "Adding Tables"
	$(PSQL) $(DB) -f src/modules/user/schema.sql

	@echo "Granting privileges"
	$(PSQL) $(DB) -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $(USER);"
	$(PSQL) $(DB) -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $(USER);"

setup-db-linux:
	@echo "Initializing $(DB) database"
	@if sudo -u $(USER) $(PSQL) -lqt | cut -d \| -f 1 | grep -qw $(DB) ; then \
		echo "Database already exists" ; \
	else \
		sudo -u $(USER) createdb $(DB) ; \
	fi

	@echo "Creating user"
	@if sudo -u $(USER) $(PSQL) $(DB) -tAc "SELECT 1 FROM pg_roles WHERE rolname='$(USER)'" | grep -q 1 ; then \
		echo "User already exists" ; \
	else \
		sudo -u $(USER) $(PSQL) $(DB) -c "CREATE USER $(USER) WITH PASSWORD '$(PASSWORD)';" ; \
	fi

	@echo "Adding Tables"
	sudo -u $(USER) $(PSQL) $(DB) -f src/modules/user/schema.sql

	@echo "Granting privileges"
	sudo -u $(USER) $(PSQL) $(DB) -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $(USER);"
	sudo -u $(USER) $(PSQL) $(DB) -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $(USER);"

start:

	@echo "Starting Server"
	$(BREW) services start postgres
	$(YARN) start

lint:
	node_modules/.bin/eslint --fix src/


