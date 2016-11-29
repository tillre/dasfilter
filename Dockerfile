FROM node:4

RUN apt-get update -y && apt-get -y --force-yes install \
    vim \
    curl \
    graphicsmagick

WORKDIR /opt/app

COPY package.json /opt/app/package.json
RUN npm install --loglevel silent

COPY bower.json /opt/app/bower.json
RUN node_modules/.bin/bower install --silent --allow-root

COPY . /opt/app
RUN npm run build

ENTRYPOINT ["/opt/app/entrypoint.sh"]
