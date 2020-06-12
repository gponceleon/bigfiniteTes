FROM node:12.16.1
LABEL maintainer="Gabriela Ponceleon" \
      description="Tests para Bigfinite"

COPY . /var/app

WORKDIR /var/app

ENV TZ=Europe/Barcelona

RUN npm install --unsafe-perm || \
  ((if [ -f npm-debug.log ]; then \
      cat npm-debug.log; \
    fi) && false)

CMD ["npm","start"]