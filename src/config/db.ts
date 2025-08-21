import mysql from 'mysql2/promise';


const getConnection = async () => {
    const conn = await mysql.createConnection({
        port: 3306,
        host: "localhost",
        user: 'root',
        database: 'nodejspro',
        password: 'Anhhai123@',
        namedPlaceholders: true,
    });

    return conn;
}

export default getConnection;