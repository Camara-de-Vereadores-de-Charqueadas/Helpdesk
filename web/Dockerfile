
FROM node:22 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist /app
RUN npm install -g serve
EXPOSE 5173
CMD ["serve", "-s", ".", "-l", "5173"]

# Eu não sei bem as tecnologias que vão ser usadas no front. O dockerfile da API e o compose.yaml eu reciclei de outros projetos.
# Sinta-se livre para mexer nesse Dockerfile já que ele é separado do back.
# - Luãn