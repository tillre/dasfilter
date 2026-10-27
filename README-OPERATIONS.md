# Das Filter – operations notes (stack as of 2026-10-27)

Everything runs from `/root/dasfilter` with `docker-compose` (v1.20) on the droplet.

| Service   | Image                                   | Purpose                                   |
|-----------|-----------------------------------------|-------------------------------------------|
| nginx     | nginx:1.28                              | public :80/:443, cache, URL rewriting     |
| app       | dasfilter_app:node24 (built from ./Dockerfile) | the hapi/node site + admin + api   |
| couchdb   | apache/couchdb:3.5.2                    | database, data in `./data/couchdb3`       |
| clouseau  | ghcr.io/cloudant-labs/clouseau:3.5.0    | Lucene search sidecar (shares couchdb net)|

Secrets live only in `config/app.env`, `config/couchdb.env`, `config/erlang.cookie`
(git-ignored). The old `start-prod.sh` still holds the same values; keep them in sync.

## Daily commands

```sh
cd /root/dasfilter
docker-compose ps                       # status
docker-compose logs --tail 100 app      # app log (also: couchdb, clouseau, nginx)
docker-compose restart app              # restart one service
docker-compose up -d                    # apply compose changes
tail /var/log/dasfilter-health.log      # what the watchdog did (empty = all good)
```

The watchdog `bin/healthcheck.sh` runs every 2 minutes from root's crontab and restarts
a service only after 3 consecutive failed probes.

## Rollback to the previous stack

`docker-compose.old.yml` is the compose file that ran until 2026-10-27 (CouchDB 2.1.1
custom image + node 4). Its data directory `./data/couchdb` was left untouched.

```sh
docker-compose stop
docker-compose -f docker-compose.old.yml up -d
```

## Rebuilding the app image

The droplet's Docker (19.03 on Ubuntu 16.04) cannot run `apt` inside modern images
during `docker build` (seccomp, see below). Build on any current machine and ship it:

```sh
docker build -t dasfilter_app:node24 .
docker save --platform linux/amd64 dasfilter_app:node24 | gzip | ssh root@DROPLET 'gunzip | docker load'
ssh root@DROPLET 'cd /root/dasfilter && docker-compose up -d app'
```

The compiled front-end assets (`static/`) are prebuilt and copied into the image;
the old bower/gulp 3 toolchain no longer runs on current Node.

## Why `config/seccomp-enosys.json`

Kernel 4.4 + Docker 19.03 answer syscalls that are not in the allowlist with EPERM.
Modern glibc, the JVM and Node probe newer syscalls (clone3, faccessat2) and only fall
back on ENOSYS. The profile is Docker's default allowlist with the default action
changed to return ENOSYS; nothing extra is allowed. On a current host (Ubuntu 24.04,
Docker 27+) remove the `security_opt` lines.

## HTTPS

Enabled 2026-10-27. Let's Encrypt certificate for dasfilter.com, www.dasfilter.com,
dasfilter.net, www.dasfilter.net, das-filter.net, www.das-filter.net, dasfilter.org,
www.dasfilter.org. Files live in `data/certbot/conf`
(mounted read-only into nginx at `/etc/letsencrypt`). Port 80 only serves the ACME
challenge path and redirects everything else to HTTPS; `config/conf.d/ssl.conf`
(copied from `config/nginx-ssl.conf.template`) is the HTTPS server block, with HSTS
set to one day.

Renewal: `bin/cert-renew.sh` runs every Monday 04:17 from root's crontab, renews when
fewer than 30 days remain and reloads nginx; log in `/var/log/dasfilter-cert.log`.
Test it any time with `bin/cert-renew.sh --dry-run`.

Note: `config/nginx.conf` and `config/nginx-locations.conf` are single-file bind mounts.
Editing them with `sed -i` (new inode) is not seen by the running container; either
write in place (`cat > file`) or `docker-compose up -d --force-recreate --no-deps nginx`.
Article images are rewritten to the HTTPS-capable S3 endpoint (`nginx-locations.conf`),
so pages have no mixed content.

## Backups

`/root/backups/data-couchdb-clouseau-*.tgz` is a tarball of the data directory taken
before the migration. `data/couchdb` (old CouchDB 2.1 files) is kept as-is. DigitalOcean
weekly droplet backups remain the main backup.

## Known leftovers

- A dead replication job in `_replicator` (to sesame.cloudant.com) retries forever and
  logs errors every few hours. Harmless; delete the doc if the noise bothers you.
- `df-backup-2018-03-30` database and `/root/couchseau` tarball are 2018 leftovers.
- Ubuntu 16.04 and Docker 19.03 are end-of-life; this compose file is written so that
  `rsync /root/dasfilter` + `docker compose up -d` on a fresh droplet is the migration.
- The GitHub remote (github.com/tillre/dasfilter) is public. Its history contains an AWS
  key pair from 2014–2016 (`AKIAI7N2…`, in manifest.js until commit 511ea72); checked
  2026-10-27: that key is no longer valid. The live key (`AKIAJR7H…`, IAM user
  `prod.dasfilter`) was never committed. Secrets now live only in the git-ignored
  `config/*.env` files; keep it that way.
