const http = require("http");
const { agregarUsuario, consultarUsuarios, editarUsuario, eliminarUsuario, realizarTransferencia, registroTransferencia } = require("./consultas");
const url = require("url");
const fs = require("fs");

const PORT = 3000;

const ROUTES = {
    ROOT: "/",
    USUARIO: "/usuario",
    USUARIOS: "/usuarios",
    TRANSFERENCIA: "/transferencia",
    TRANSFERENCIAS: "/transferencias",
};

http.createServer(async (req, res) => {
    try {
        if (req.url === ROUTES.ROOT && req.method === "GET") {
            serveFile("index.html", "text/html", res);
        } else if (req.url === ROUTES.USUARIO && req.method === "POST") {
            handlePostUsuario(req, res);
        } else if (req.url === ROUTES.USUARIOS && req.method === "GET") {
            handleGetUsuarios(req, res);
        } else if (req.url.startsWith(ROUTES.USUARIO) && req.method === "PUT") {
            handlePutUsuario(req, res);
        } else if (req.url.startsWith(`${ROUTES.USUARIO}?id`) && req.method === "DELETE") {
            handleDeleteUsuario(req, res);
        } else if (req.url === ROUTES.TRANSFERENCIA && req.method === "POST") {
            handlePostTransferencia(req, res);
        } else if (req.url === ROUTES.TRANSFERENCIAS && req.method === "GET") {
            handleGetTransferencias(req, res);
        } else {
            handleError(res, 404, "Not Found");
        }
    } catch (error) {
        handleError(res, 500, "Internal Server Error", error);
    }
}).listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));

function serveFile(fileName, contentType, res) {
    fs.readFile(fileName, "utf8", (err, data) => {
        if (err) {
            handleError(res, 500, "Internal Server Error", err);
        } else {
            res.setHeader("Content-Type", contentType);
            res.end(data);
        }
    });
}

async function handlePostUsuario(req, res) {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });
    req.on("end", async () => {
        try {
            const datosJson = JSON.parse(body);
            const datos = [datosJson.nombre, datosJson.balance];
            const respuesta = await agregarUsuario(datos);
            res.statusCode = 201;
            res.end(JSON.stringify(respuesta));
        } catch (error) {
            handleError(res, 500, "Internal Server Error", error);
        }
    });
}

async function handleGetUsuarios(req, res) {
    try {
        const usuarios = await consultarUsuarios();
        res.end(JSON.stringify(usuarios));
    } catch (error) {
        handleError(res, 500, "Internal Server Error", error);
    }
}

async function handlePutUsuario(req, res) {
    let body = "";
    let { id } = url.parse(req.url, true).query;
    req.on("data", (chunk) => {
        body = chunk.toString();
    });
    req.on("end", async () => {
        try {
            const datosJson = JSON.parse(body);
            const datosUsuarios = [id, datosJson.name, datosJson.balance];
            const result = await editarUsuario(datosUsuarios);
            res.end(JSON.stringify(result));
        } catch (error) {
            handleError(res, 500, "Internal Server Error", error);
        }
    });
}

async function handleDeleteUsuario(req, res) {
    try {
        let { id } = url.parse(req.url, true).query;
        const respuesta = await eliminarUsuario(id);
        res.end(JSON.stringify(respuesta));
    } catch (error) {
        handleError(res, 500, "Internal Server Error", error);
    }
}

async function handlePostTransferencia(req, res) {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk;
    });
    req.on("end", async () => {
        try {
            const datosJson = JSON.parse(body);
            const datos = [datosJson.emisor, datosJson.receptor, datosJson.monto];
            const respuesta = await realizarTransferencia(datos);
            res.statusCode = 201;
            res.end(JSON.stringify(respuesta));
        } catch (error) {
            handleError(res, 500, "Internal Server Error", error);
        }
    });
}

async function handleGetTransferencias(req, res) {
    try {
        const registros = await registroTransferencia();
        res.end(JSON.stringify(registros));
    } catch (error) {
        handleError(res, 500, "Internal Server Error", error);
    }
}

function handleError(res, statusCode, message, error) {
    res.statusCode = statusCode;
    console.error(message, error);
    res.end(message);
}
