import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: "mysql", // nome do serviço no docker-compose
    user: "root",
    password: process.env.MYSQL_ROOT_PASSWORD || "fubar",
    database: process.env.MYSQL_DATABASE || "helpdesk",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default pool;
