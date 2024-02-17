## About this project
The technologies used in this project are:
- Next.js
- Postgres db (with docker)
- Prisma for orm
- Next-auth for authentication

## To run the database:
- docker-compose up -d
- go to http://localhost:5050/ (to view the database via pgAdmin)
- enter PGADMIN_DEFAULT_EMAIL and PGADMIN_DEFAULT_PASSWORD

## To register a new server inside the db
- docker container ls (to get the CONTAINER ID of the postgres image)
- docker inspect CONTAINER ID (to find the IP of the container)
- Then inside the pgAdmin -> Add new Server
- On General tab put a name (e.g. 'test_db')
- On Connection tab enter the IP of the container on Hostname
- Username and passoword: POSTGRES_USER and POSTGRES_PASSWORD

## To run in dev mode

Simply run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Sources:
- https://www.youtube.com/watch?v=2kgqPvs0j_I&t=175s
- https://github.com/TeoMastro/docker-compose-postgres
