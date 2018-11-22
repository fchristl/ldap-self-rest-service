FROM node:alpine
COPY . /var/lib/run
RUN cd /var/lib/run && npm install
CMD node /var/lib/run/service/index.js