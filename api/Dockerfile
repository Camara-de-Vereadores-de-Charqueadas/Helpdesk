FROM node:22

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN if [ "$NODE_ENV" = "production" ]; then \
    npm ci --only=production; \
else \
    npm install; \
fi

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]