#!/bin/bash

scripts/wait-for-it.sh ": db:5432:5432"


while ! npx prisma migrate dev 2>&1; do
    echo "Make migrations"
    sleep 3
done

while ! node ./models/seeder.js 2>&1; do
    echo "Seed database"
    sleep 3
done

npm run dev
sleep 3

exec "$@"