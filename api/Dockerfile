FROM node:22

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

# isso aqui serve pra ele não instalar coisas de dev em caso de production
# - production
# - development
RUN if ["$NODE_ENV" = "production"]; then \
    npm ci --only=production; \
    else \
        npm install; \
    fi

COPY . .

EXPOSE 3000

# pressupõe que package.json existe.
CMD [ "npm", "run", "start" ]