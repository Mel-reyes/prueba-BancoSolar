const { Pool } = require("pg");

const pool = new Pool({
    user: "melireyes",
    host: "localhost",
    password: "1234",
    port: 5432,
    database: "bancosolar",
});

const agregarUsuario = async (datos) => {
    const consulta = {
        text: "INSERT INTO usuarios (nombre, balance) VALUES ($1, $2)",
        values: datos,
    };
    try {
        const resultado = await pool.query(consulta);
        return resultado;
    } catch (error) {
        console.error("Error al agregar usuario:", error);
        throw error;
    }
};

const consultarUsuarios = async () => {
    try {
        const result = await pool.query("SELECT * FROM usuarios");
        return result.rows;
    } catch (error) {
        console.error("Error al consultar usuarios:", error);
        throw error;
    }
};

const editarUsuario = async (datos) => {
    const consulta = {
        text: "UPDATE usuarios SET nombre = $2, balance = $3 WHERE id = $1 RETURNING *",
        values: datos,
    };
    try {
        const result = await pool.query(consulta);
        return result;
    } catch (error) {
        console.error("Error al editar usuario:", error);
        throw error;
    }
};

const eliminarUsuario = async (id) => {
    const consulta = {
        text: "DELETE FROM usuarios WHERE id = $1 RETURNING *",
        values: [id],
    };
    try {
        const result = await pool.query(consulta);
        return result;
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        throw error;
    }
};

const realizarTransferencia = async (datos) => {
    // Validar que el emisor sea una cadena no numérica
    if (typeof datos[0] !== 'string') {
        throw new Error('El emisor debe ser una cadena no numérica');
    }

    const transferir = {
        text: "INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, NOW()) RETURNING *",
        values: datos
    };

    const datoEmisor = {
        text: "UPDATE usuarios SET balance = balance - $1 WHERE id = $2 RETURNING * ",
        values: [Number(datos[2]), datos[0]],
    };

    const datoReceptor = {
        text: "UPDATE usuarios SET balance = balance + $1 WHERE id = $2 RETURNING * ",
        values: [Number(datos[2]), datos[1]],
    }
    
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        await client.query(transferir)
        await client.query(datoEmisor);
        await client.query(datoReceptor);
        await client.query("COMMIT")
    } catch (e) {
        await client.query("ROLLBACK");
        console.error("Error al realizar transferencia:", e);
        throw e;
    } finally {
        client.release();
    }
};

const registroTransferencia = async () => {
    const consulta = {
        text: "SELECT * FROM transferencias",
        rowMode: "array",
    };
    try {
        const result = await pool.query(consulta);
        return result.rows;
    } catch (error) {
        console.error("Error al registrar transferencia:", error);
        throw error;
    }
};

module.exports = { agregarUsuario, consultarUsuarios, editarUsuario, eliminarUsuario, realizarTransferencia, registroTransferencia };
