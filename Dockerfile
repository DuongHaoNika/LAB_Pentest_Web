FROM node:16

WORKDIR /usr/app

COPY . .

RUN npm install

RUN chmod 755 scripts/entrypoint.sh

RUN chmod 755 scripts/wait-for-it.sh

EXPOSE 3000

ENTRYPOINT ["./scripts/entrypoint.sh"]