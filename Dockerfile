FROM node:20-alpine
LABEL authors="obashion"

#ENTRYPOINT ["top", "-b"]

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

CMD ["npm", "start"]