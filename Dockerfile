FROM node:16

WORKDIR /usr/web

COPY . .

RUN npm install

RUN chmod 755 app/scripts/entrypoint.sh

RUN chmod 755 app/scripts/wait-for-it.sh

EXPOSE 3000

ENTRYPOINT ["./scripts/entrypoint.sh"]