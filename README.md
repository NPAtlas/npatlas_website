# NPAtlas_website

Reposistory for the new Dockerized deployment of the NP Atlas website www.npatlas.org.

Custom HTML/CSS/JS are contained in the `public-html` folder, with modules being copied into the Joomla CMS.

#### Status

**Beta** - requires significant development and cleanup of legacy code and dependencies. Website versioning to be removed and re-factored.

#### Setup

Deployment is controlled with Docker and Docker Compose. Development `docker-compose.yml` is provided with commented out dependencies (some currently missing).

Requirements:

- a Joomla instance with the NP Atlas specific data (SQL + Filesystem, not included in this repo).
- the JChem webservices to be installed (example in `docker-compose.yml`)
- replace ServerName in `/sites-enabled/npatlas.conf` for Joomla Apache.
- `public-html/marvinjs/` for chemical drawing util.

`/public-html/custom/` contains Joomla modules in HTML/JS with extra CSS. These require changing of API URL from localhost to deployed URL with the correct API Key.

Set the variables in `EXAMPLE_db.env` and move to `db.env`.
