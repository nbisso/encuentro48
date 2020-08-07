const fs = require("fs")

const mongoose = require('mongoose');

/*
{"id":1,edad ,"userName":"nbisso","nombre":"Nicolas","password":"123ASD","roles":["ADMIN","NORMAL_USER"]}

*/

// var personas = [
//     {
//         id: 123,
//         nombre: "pepe",
//         direccion: {
//             nombre: "asd"
//         }
//     },
//     {
//         id: 1,
//         apellido: "Carloz"
//     }
// ]

// for (let i = 0; i < personas.length; i++) {
//     const element = personas[i];

//     console.log(element.direccion.nombre)

// }


const ModeloUsuario = mongoose.model('usuarios', {
    userName: String,
    nombre: String,
    password: String,
    roles: Array,
    edad: Number
});


module.exports.getUsers = async () => {
    return new Promise(r => {
        ModeloUsuario.find((err, res) => {
            r(res)
        })
    })
}


module.exports.getUser = async (id) => {
    return new Promise(r => {
        ModeloUsuario.findOne({ _id: id }, (err, res) => {
            r(res)
        })
    })
}

module.exports.autenticarUser = async (username, password) => {
    return new Promise(r => {
        ModeloUsuario.findOne({ userName: username, password: password }, (err, res) => {
            r(res)
        })
    })
}

module.exports.findUserByUserName = async (username) => {
    return new Promise(r => {
        ModeloUsuario.findOne({ userName: username }, (err, res) => {
            r(res)
        })
    })
}

module.exports.actualziarUsuario = async (user, id) => {
    return new Promise((r, rej) => {
        let actualizar = { nombre: user.nombre }


        ModeloUsuario.update({ _id: id }, actualizar, (err, res) => {
            if (err) {
                rej(new Error("Error al actualizar el usuario"))
            }
            r()
        })
    })
}

module.exports.eliminar = async (id) => {
    return new Promise((r, rej) => {
        ModeloUsuario.deleteOne({ _id: id }, (err, res) => {
            if (err) {
                rej(new Error("Error al elimiar el usuario"))
            }
            r()
        })
    })
}

module.exports.registrarUser = async payload => {
    return new Promise(async (r, rej) => {
        let user = await this.findUserByUserName(payload.userName)

        if (user) {
            rej(new Error("El usuario ya existe"))
        }

        const usuario = new ModeloUsuario(payload);


        usuario.roles = ["NORMAL_USER"]

        usuario.save((err, doc) => {
            if (err) {
                throw new Error("Ocurrio un error en generar el usuario")
            }
            r(doc)
        })

    })
}