// Variables
const carrito = document.querySelector("#carrito");
const listaCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const listaCursos = document.querySelector("#lista-cursos");
let articulosCarrito = [];

// Llamadas a eventos

cargarEventListeners();
function cargarEventListeners(){

    // Cuando se presiona el botón "Agregar al carrito" de cualquier curso
    listaCursos.addEventListener("click", agregarCurso);

    // Cuando se presiona la "X" en un curso agregado al carrito
    carrito.addEventListener("click", eliminarCurso);

    // Cuando se presiona el botón "Vaciar carrito" del carrito
    vaciarCarritoBtn.addEventListener("click", () => {
        articulosCarrito = [];
        vaciarCarrito();
    });

    // Actualizar la lista de articulos del carrito con el contenido del LocalStorage
    document.addEventListener("DOMContentLoaded", () => {
        articulosCarrito = JSON.parse(localStorage.getItem("productos")) || [];
        carritoHTML();
    })
}

// Funciones

// Añadir un curso al carrito de compras
function agregarCurso(e){
    e.preventDefault()
    // Obtener únicamente el llamado al botón "Agregar al carrito"
    if(e.target.classList.contains('agregar-carrito')) {
        // Seleccionar el curso (div) correspondiente al botón presionado para tomar sus datos
        const cursoActual = e.target.parentElement.parentElement;
        leerDatosCurso(cursoActual);
    }
}

// Eliminar un curso del carrito en el DOM
function eliminarCurso(e){
    // Obtener únicamente el llamado a la "X" para eliminar un curso de la lista del carrito
    if(e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute("data-id");
        // Eliminar del arreglo del carrito:
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId )
        // Actualizar el HTML ahora sin el curso eliminado
        carritoHTML();
    }
}

// Obtener los datos de un curso
function leerDatosCurso(curso){
    const infoCurso = {
        imagen: curso.querySelector("img").src,
        titulo: curso.querySelector("h4").textContent,
        precio: curso.querySelector(".precio span").textContent,
        id: curso.querySelector("a").getAttribute("data-id"),
        cantidad: 1
    }
    agregarListaCarrito(infoCurso);
    carritoHTML();
}

// Añadir un curso seleccionado a la lista del carrito de compras
function agregarListaCarrito(cursoNuevo){
    // Verificar primero si el curso ya se encuentra en la lista del carro
    if( articulosCarrito.some( curso => curso.id === cursoNuevo.id ) ) { 
        const cursos = articulosCarrito.map( curso => {
             if( curso.id === cursoNuevo.id ) {
                  curso.cantidad++;  // Si ya se encuentra, actualizar la cantidad
                   return curso;
              } else {
                   return curso;
           }
        })
        articulosCarrito = [...cursos];
   }  else {
        articulosCarrito = [...articulosCarrito, cursoNuevo]; // Si no se encuentra, añadirlo al array
   }
}

// Mostrar el curso seleccionado en el carrito
function carritoHTML(){

    vaciarCarrito();

    articulosCarrito.forEach( curso => {
        const { imagen, titulo, precio, id, cantidad } = curso; // Object Destructuring
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <img src=${imagen} width=100>
            </td>
            <td> ${titulo} </td>
            <td> ${precio} </td>
            <td> ${cantidad} </td>
            <td>
                <a href="#" class="borrar-curso" data-id=${id}> X </a>
            </td>
        `;
        listaCarrito.appendChild(row);
    })

    sincronizarLocalStorage();
}

// Actualizar el contenido del LocalStorage con el nuevo producto
function sincronizarLocalStorage(){
    localStorage.setItem("productos", JSON.stringify(articulosCarrito));
}

// Eliminar todos los cursos añadidos al carrito en el DOM
function vaciarCarrito(){
    while(listaCarrito.firstChild){
        listaCarrito.removeChild(listaCarrito.firstChild); // Eliminar uno por uno (recomendado)
    }
    sincronizarLocalStorage();
}