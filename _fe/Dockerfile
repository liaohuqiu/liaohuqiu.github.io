FROM node:4.6.1
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/node_npm_data && mv /tmp/node_modules /opt/node_npm_data/
WORKDIR /opt/node_npm_data
ENV NODE_PATH /opt/node_npm_data/node_modules/
ENV PATH /opt/node_npm_data/node_modules/.bin:$PATH
