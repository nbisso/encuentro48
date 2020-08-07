


fetch("/users").then(async r => {
    let usuariosContendor = document.getElementById("usuarios");
    let users = await r.json()

    let result = ""
    for (let i = 0; i < users.length; i++) {
        const element = users[i];
        result += `<h1>${element._id} ${element.userName}</h1>`
    }

    usuariosContendor.innerHTML = result;
})