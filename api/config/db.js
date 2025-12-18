import Database from "better-sqlite3";

// Cria (ou abre) o arquivo database.db na raiz da API
const db = new Database("database.db");

// Habilita FK (SQLite não vem ligado por padrão)
db.pragma("foreign_keys = ON");

export default db;
