# Stage 0, "build-stage", based on Node.js, to build and compile Angular
FROM node:14-alpine as build-stage
ENV NODE_OPTIONS --max_old_space_size=8192

WORKDIR /app
RUN pwd
RUN ls
RUN node -v
RUN npm -v
COPY package.json /app/
# changes below
#RUN npm install npm@latest -g 
# RUN npm install --save @angular/compiler 
# RUN npm install -g @angular/cli@latest 
# RUN ng update --all --force
# RUN npx npm-check-updates -u -f /^@progress/ 
# RUN npm install --save @ngtools/webpack@latest
# RUN npm install --save typescript@3.5.3 
RUN npm cache clean --force
# RUN npm install
# RUN npm uninstall typescript
#RUN pwd
#RUN npm install --save-dev typescript@3.4.5
#RUN npm install --save core-js@latest
#RUN npm install --save eslint
RUN rm -r -f node_modules
#RUN npm install --save-dev typescript@3.4.5 --force
RUN npm install
#RUN rm -f /app/.npmrc
RUN ls
COPY ./ /app/
ARG configuration
RUN npm run build -- --output-path=./dist/out

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15
COPY --from=build-stage /app/dist/out/ /usr/share/nginx/html

COPY --from=build-stage /app/envjs.sh /usr/local/bin/
RUN ln -s usr/local/bin/envjs.sh

# workaround to fix CRLF from windows build machine
RUN apt-get update && apt-get install dos2unix
RUN dos2unix /usr/local/bin/envjs.sh
RUN chmod +x /usr/local/bin/envjs.sh
# end workaround

# generate env.js and start nginx
ENTRYPOINT [ "/envjs.sh" ]
CMD [ "nginx", "-g", "daemon off;" ]
