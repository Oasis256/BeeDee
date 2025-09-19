#!/bin/bash
set -e
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  CREATE DATABASE scraperdb;
  CREATE DATABASE bffdb;
  CREATE DATABASE profilesdb;
  CREATE DATABASE resultsdb;
  CREATE DATABASE notifydb;
  CREATE DATABASE commsdb;
  CREATE DATABASE explorationdb;
  CREATE DATABASE safetydb;
EOSQL
