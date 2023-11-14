const monstruos = JSON.parse(localStorage.getItem("monstruos")) || [];

loader(); 
setTimeout(() => {
    monstruos.forEach(monstruo => {
        let newMonstruo = new Monstruo(monstruo.id, monstruo.nombre, monstruo.alias, monstruo.defensa, monstruo.miedo, monstruo.tipo, monstruo.enemigos);
        cargarTarjeta(newMonstruo);
    });
    loader();
}, 2000);



function cargarTarjeta(monstruo)
{
    let main = (document.querySelectorAll("main"))[0];
    let contenedor = document.createElement("div");
    contenedor.classList.add("contenedorDeTarjeta");
    let ul = document.createElement("ul");
    ul.classList.add("tarjeta");
    let atributos = [monstruo.nombre, monstruo.alias, monstruo.defensa, monstruo.miedo, monstruo.tipo, monstruo.enemigos];

    for (let i = 0; i < 6; i++) {
        atributo = document.createElement("li");
        
        atributo.textContent = atributos[i];
        ul.appendChild(atributo);
    }
    contenedor.appendChild(ul);
    main.appendChild(contenedor);
}

function loader(){
    let listado = document.getElementsByTagName('main')[0];
    let spinners = document.getElementById("loading");
    let footer = document.getElementById("footer");
    footer.style.display = "none";

    if(spinners === null){
        let spinner = document.createElement("img");
        const src = "./assets/ghost.png";
        spinner.id = "loading";
        spinner.classList.add("loaderTarjetas");
        spinner.src = src;
        listado.appendChild(spinner);
    }else{
        listado.removeChild(spinners);
        footer.style.display = "block";
    }
}