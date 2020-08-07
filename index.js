const express = require("express")
const jwt = require("jsonwebtoken")

const mongoose = require('mongoose');


const usuarioRepo = require("./repository/user.repositry")

let server = express();
const SECRET_JWT = "SECRETO"


server.use(express.json())


server.use(express.static("public"))



server.post("/login", async (req, res) => {
    let user = req.body;
    let findUser = await usuarioRepo.autenticarUser(user.userName, user.password)


    if (!findUser) {
        res.status(400).json({
            message: "invalid user or password"
        })
        return
    }

    let token = jwt.sign({
        id: findUser.id,
        nombre: findUser.nombre
    }, SECRET_JWT)

    res.status(200).send(token)
})


let autorizar = (rolesRequeridos) => async (req, res, next) => {
    let token = req.headers["authorization"].split(" ")[1]
    console.log(token)
    let user = null;
    try {
        user = jwt.verify(token, SECRET_JWT)
    } catch (er) {
        res.status(401).send("apaaaaa a donde queres ir?")
        return;
    }

    let findUser = await usuarioRepo.getUser(user.id)
    let tieneRol = false;
    if (rolesRequeridos && rolesRequeridos.length != 0) {
        for (let i = 0; i < rolesRequeridos.length; i++) {
            const rol = rolesRequeridos[i];
            if (findUser.roles.includes(rol)) {
                tieneRol = true
            }
        }
        if (!tieneRol) {
            res.status(401).send("apaaaaa a donde queres ir?")
            return;
        }
    }


    console.log(user)

    next()
}

server.get("/abierto", (req, res) => {
    res.send("ok")
})



server.get("/normal_user", autorizar(), (req, res) => {
    res.send("Hola, solo podes leer esto si estas logeado")
})

server.get("/cerrado", autorizar(["ADMIN"]), (req, res) => {
    res.send("Hola, solo podes leer esto si estas logeado")
})

server.get("/users", async (req, res) => {

    let usuarios = await usuarioRepo.getUsers();
    res.send(usuarios)
})


server.get("/users/:id", async (req, res) => {

    let usuarios = await usuarioRepo.getUser(req.params.id);
    res.send(usuarios)
})


server.post("/registrar", async (req, res) => {
    let body = req.body;

    try {
        await usuarioRepo.registrarUser(body)
        res.send("ok")
    } catch (error) {
        res.status(400).send(error.message)
    }
})


server.put("/users/:id", async (req, res) => {
    let body = req.body;

    try {
        await usuarioRepo.actualziarUsuario(body, req.params.id)
        res.send("ok")
    } catch (error) {
        res.status(400).send(error.message)
    }
})


server.delete("/users/:id", async (req, res) => {
    try {
        await usuarioRepo.eliminar(req.params.id)
        res.send("ok")
    } catch (error) {
        res.status(400).send(error.message)
    }
})


async function initServer() {

    mongoose.connect('mongodb://localhost:27017/dwfs').then(r => {
        server.listen(3000, () => {
            console.log("server run")
        })
    }).catch(error => {
        console.log(error)
        console.log("NO Pude conectar a la base de datos")
    })
}

initServer();