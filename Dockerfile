FROM  node:20-alpine3.18

# make the 'app' folder the current working directory
WORKDIR /app

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

RUN npm install -g npm@10.5.2

RUN npm install

RUN npm run build

EXPOSE 80

CMD ["npm", "run", "start:dev"]
