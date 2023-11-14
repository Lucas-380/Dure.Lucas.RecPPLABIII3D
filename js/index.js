//localStorage
let monstruosBD = cargarDatos();
//console.log(monstruosBD);

//Guardo el array en el localStorage
const guardarTipo = ["Esqueleto", "Zombie", "Vampiro", "Bruja", "Hombre Lobo"];
localStorage.setItem("tipo", JSON.stringify(guardarTipo));
// Obtener array
const tipo = JSON.parse(localStorage.getItem("tipo")) || [];

function generarId() {
    let db = JSON.parse(localStorage.getItem("monstruos"));
    let id = Math.floor(Math.random() * 100) + 1;
    if(db != null) {
        let ultimoMonstruo = db[db.length - 1];
        if(ultimoMonstruo != undefined) {
            id = parseInt(ultimoMonstruo.id) + 1;
        }
    }
    return id;
}

function cargarDatos() {
    let db = JSON.parse(localStorage.getItem("monstruos")) || [];
    loader(); // Crea la img con el spinner
    setTimeout(() => {
        db.forEach(m => {
            actualizarLista(new Monstruo(m.id, m.nombre, m.tipo, m.alias, m.defensa, m.miedo, m.enemigos));
        });
        loader(); // remuevo el spinner
    }, 2000);
    return db;
}

//select del form
const select = document.createElement("select");
select.id = "selectTipo";
select.classList.add("inputForm");

tipo.forEach(function (opcion) {
    const option = document.createElement("option");
    option.text = opcion;
    option.value = opcion;
    select.appendChild(option);
});

document.getElementById("menuDeTipos").appendChild(select);

//form de altaMonstruo
document.getElementById("formMonstruo").addEventListener("submit", function(event) {
    event.preventDefault();

    let nombre = document.getElementById("txtNombre").value;
    let alias = document.getElementById("txtAlias").value;
    let defensa = (document.querySelector('input[name="rdbDefensa"]:checked')).value;
    let miedo = document.getElementById("rngMiedo").value;
    let tipo = document.getElementById("selectTipo").value;

    let enemigos = document.querySelectorAll('input[name="checkEnemigos"]:checked');
    let arrayEnemigos = [];
    enemigos.forEach(e => {
        arrayEnemigos.push(e.id);
    });
    if(enemigos.length != 0){
        let newMonstruo = new Monstruo(generarId(), nombre, tipo, alias, defensa, miedo, arrayEnemigos);
        actualizarLista(newMonstruo);
        guardarMonstruo(newMonstruo);
    }else{
        mostrarNotificacion("FALTA CARGAR ENEMIGOS")
    }

    btnCancelar.click();
});

//Tabla
function actualizarLista(monstruo) //Actualizo NUEVO monstruo
{
    let tablaBody = document.getElementById("listaMonstruo");
    let tr = document.createElement("tr");
    tr.id = monstruo.id;
    let atributos = [monstruo.nombre, monstruo.alias, monstruo.defensa, monstruo.miedo, monstruo.tipo, monstruo.enemigos];

    for (let i = 0; i < 6; i++) {
        let atributo = document.createElement("td");
        atributo.textContent = atributos[i];
        tr.appendChild(atributo);
    }
    tablaBody.appendChild(tr);
}

function loader(){
    let listado = document.getElementById("listadoDeMonstruos");
    let spinners = document.getElementById("loading");

    if(spinners === null){
        let spinner = document.createElement("img");
        const src = "./assets/Spider.png";
        spinner.id = "loading";
        spinner.src = src;
        listado.appendChild(spinner);
    }else{
        listado.removeChild(spinners);
    }
}

function guardarMonstruo(monstruo) {
    let db = JSON.parse(localStorage.getItem("monstruos")) || [];
    const indice = db.findIndex(m => m.id == monstruo.id);
    if(indice > -1){
        db[indice] = monstruo;
        localStorage.setItem("monstruos", JSON.stringify(db));
    }else{
        db.push(monstruo);
        localStorage.setItem("monstruos", JSON.stringify(db));        
    }
}


//eventos
const tabla = document.getElementById("tablaDeMonstruos");
const btnEliminar = document.getElementById("btnEliminar");
const btnModificar = document.getElementById("btnModificar");
const btnCancelar = document.getElementById("btnCancelar");
const btnGuardar = document.getElementById("btnGuardar");
let idClickeado;

tabla.addEventListener("click", function(e) {
    e.preventDefault();
    if (e.target.tagName === "TD") {
        let fila = e.target.parentNode;
        document.getElementById("txtNombre").value = fila.cells[0].textContent;
        document.getElementById("txtAlias").value = fila.cells[1].textContent;
        document.getElementById(`${fila.cells[2].textContent}`).checked = true;
        document.getElementById("rngMiedo").value = fila.cells[3].textContent;
        document.getElementById("selectTipo").value = fila.cells[4].textContent;
        
        let arrayEnemigos = fila.cells[5].textContent.split(',');
        arrayEnemigos.forEach(enemigo => {
            document.getElementById(`${enemigo}`).checked = true;
        });

        btnModificar.hidden = false;
        btnCancelar.hidden = false;
        btnEliminar.hidden = false;
        btnGuardar.style.display = "none";
        idClickeado = fila.id;
    }
});

btnEliminar.addEventListener("click", () => {
    eliminarMonstruo(idClickeado);
    mostrarNotificacion("ELIMINADO")
});

btnModificar.addEventListener("click", () => {
    modificarMonstruo(idClickeado);
});

btnCancelar.addEventListener("click", () => {
    btnModificar.hidden = true;
    btnCancelar.hidden = true;
    btnEliminar.hidden = true;
    btnGuardar.style.display = "block";
});

function eliminarMonstruo(id) {
    let db = JSON.parse(localStorage.getItem("monstruos")) || [];
    let monstruosRestantes = db.filter(monstruo => monstruo.id != id);
    if(db.length == 1) {
        monstruosRestantes = [];
    }
    console.log(monstruosRestantes);
    localStorage.setItem("monstruos", JSON.stringify(monstruosRestantes));
    eliminarTabla();
    cargarDatos();
    btnCancelar.click();
}

// Eliminar todos los elementos hijos de la tabla
function eliminarTabla() {
    let tablaBody = document.getElementById("listaMonstruo");
    while (tablaBody.firstChild) {
        tablaBody.removeChild(tablaBody.firstChild);
    }
}

function modificarMonstruo(id) {
    let nombre = document.getElementById("txtNombre").value;
    let alias = document.getElementById("txtAlias").value;
    let defensa = (document.querySelector('input[name="rdbDefensa"]:checked')).value;
    let miedo = document.getElementById("rngMiedo").value;
    let tipo = document.getElementById("selectTipo").value;

    let enemigos = document.querySelectorAll('input[name="checkEnemigos"]:checked');
    let arrayEnemigos = [];
    enemigos.forEach(e => {
        arrayEnemigos.push(e.id);
    });

    if(enemigos.length != 0){
        let newMonstruo = new Monstruo(id, nombre, tipo, alias, defensa, miedo, arrayEnemigos);
        actualizarMonstruo(newMonstruo);
        guardarMonstruo(newMonstruo);
        mostrarNotificacion("MODIFICADO");
    }else{
        mostrarNotificacion("FALTA CARGAR ENEMIGOS")
    }

    btnCancelar.click();
}

function actualizarMonstruo(monstruo)
{
    let tablaBody = document.getElementById("listaMonstruo");
    let fila = document.getElementById(`${monstruo.id}`);

    fila.cells[0].textContent = monstruo.nombre;
    fila.cells[1].textContent = monstruo.alias;
    fila.cells[2].textContent = monstruo.defensa;
    fila.cells[3].textContent = monstruo.miedo;
    fila.cells[4].textContent = monstruo.tipo;
    fila.cells[5].textContent = monstruo.enemigos;

    tablaBody.appendChild(fila);
}

function mostrarNotificacion(mensaje) {
    let notificacion = document.getElementById("notificacion");
    let texto = document.createElement("p");
    texto.textContent = mensaje;
    notificacion.hidden = false;
    notificacion.appendChild(texto);

    setTimeout(() => {
        notificacion.hidden = true;
        texto.hidden = true;
    }, 2000);
}
