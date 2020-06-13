FROM node:12.16.1
LABEL maintainer="Gabriela Ponceleon" \
      description="Tests para Bigfinite"

COPY . /var/app

WORKDIR /var/app

ENV TZ=Europe/Barcelona

RUN npm install

CMD ["npm","start"]