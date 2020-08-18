# The Natural Products Atlas - SQL

**For the atlas there are several required accounts to run all the services**

### MySQL Databases

- `Joomla_DB` Required Joomla database

- `piwik` Required database for piwik/Matomo web analytics tool

- `JCHEM_NPAtlas` Marvin JChem webservices database - contains _N_-NP Atlas version tables

### Users

- `'root'@'localhost'` has `ALL PRIVILEGES ON *.* WITH GRANT OPTION`

- `'JChem'@'%'` has `ALL PRIVILEGES ON JCHEM%`

- `'JoomlaUser'@'localhost'` has `ALL PRIVILEGES ON Joomla\_DB`

- `'piwik'@'localhost'` has `ALL PRIVILEGES ON piwik`

### Postgres SQL Databases

- `np_atlas_YYYY_MM` are now in psql databases for the RDKit cartridge, all interactions are controlled through the new NP Atlas API.
