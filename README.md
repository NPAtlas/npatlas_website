# The Natural Products Atlas

Hosted at www.npatlas.org

AUTHOR: Jeff van Santen

Contained is a bare bones `docker-compose` deployment for the NP Atlas.
The required Docker images are currently not publically available.

This repo exists primarily for **Issue Tracking**.

#### Environment files

As specified in the `docker.compose.yml` two environment files need to be configured.
Here are the required files for the REST api and the webapp, respectively.

api.env

```
LOG_LEVEL=debug
MODULE_NAME=atlas.main
DATABASE_URL=postgresql://jvansan:jvansan@127.0.0.1/np_atlas_2020_06
#AUTH_DATABASE_URL=postgresql://jvansan:jvansan@127.0.0.1/authentication # Only used with DEV_DEPLOYMENT == true
DEV_DEPLOYMENT=false
REDIS_URL=redis
```

app.env

```
ATLAS_APIKEY=<REPLACEME>
ATLAS_URL=http://api/api/v1
ATLAS_VERSION=2020_06
SECRET_KEY=<REPLACEME>
DEV=false
ALLOWED_HOSTS=<REPLACEME>
EMAIL_HOST_USER=<REPLACEME>
EMAIL_HOST_PASSWORD=<REPLACEME>
```