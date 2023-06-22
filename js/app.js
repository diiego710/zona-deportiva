const file = 'https://raw.githubusercontent.com/diiego710/zona-deportiva/main/data/producto.json';
const menuHam = document.querySelector('#menu-ham');
const enlaces = document.querySelector('.nav');
const contenidoProductos = document.querySelector('#productos-home');
const ventanaCarrito = document.querySelector('#ventana-carrito');
const carrito = document.querySelector('#carrito i');
const totalCompra = document.querySelector('#total');
const btnClose = document.querySelector('#close');
const ventanaBody = document.querySelector('.ventana-body');
let productosCarrito = [];

class Producto{
    constructor(imagen, nombre, precio,id){
        this.imagen = imagen;
        this.nombre = nombre;
        this.precio = precio;
        this.id = id;
        this.cantidad = 1;
        this.subtotal = 0;
    }
    obtenerTotal(){
        this.subtotal = this.precio * this.cantidad;
    }
}

cargarEventos();

function cargarEventos(){
    document.addEventListener('DOMContentLoaded', () =>{
        renderizarProductos();
        productosCarrito = JSON.parse(localStorage.getItem('productLS')) || [];
        mostrarProductosCarrito();
    });

    contenidoProductos.addEventListener('click', agregarProducto);
    ventanaBody.addEventListener('click',eliminarProducto);
    carrito.onclick = function(){
        ventanaCarrito.style.display = 'block'
    };

    btnClose.onclick = function(){
        ventanaCarrito.style.display = 'none'
    };

    window.onclick = function (event){
        if(event.target == ventanaCarrito){
            ventanaCarrito.style.display = 'none';
        }
    };

    menuHam.addEventListener('click', () => {
        enlaces.classList.toggle('activado');
    });

}

function eliminarProducto(e){
    if(e.target.classList.contains('eliminar-producto')){
        const productoId = parseInt(e.target.getAttribute('id'));
        
        productosCarrito = productosCarrito.filter((producto) => producto.id !== productoId);
        guardarProductosStorage();
        mostrarProductosCarrito()
    }
}

function agregarProducto(e){
    e.preventDefault();

    if(e.target.classList.contains('boton__carrito')){
        const productoAgregado = e.target.parentElement;
        
        leerDatosProductos(productoAgregado);
    };
}

function leerDatosProductos(producto){
     const datosProducto = new Producto(
        producto.querySelector('img').src,
        producto.querySelector('h4').textContent,
        Number(producto.querySelector('p').textContent.replace('$', '')),
        Number(producto.querySelector('a').getAttribute('id')),
     );

     datosProducto.obtenerTotal();
    agregarAlCarrito(datosProducto);
}

function agregarAlCarrito(productoAgregar){
    const existeEnCarrito = productosCarrito.some((producto) => producto.id === productoAgregar.id);

    if(existeEnCarrito){
        const productos = productosCarrito.map((producto) => {
            if(producto.id === productoAgregar.id){
                producto.cantidad++;
                producto.subtotal = producto.precio * producto.cantidad;

                return producto;
            }else{
                return producto;
            }
        }); productosCarrito = productos;
    } else{
        productosCarrito.push(productoAgregar);
    }
    guardarProductosStorage();
    mostrarProductosCarrito();
}

function mostrarProductosCarrito(){
    limpiarCarrito();
    productosCarrito.forEach((producto) =>{
        const {imagen, nombre, precio, cantidad, subtotal, id} = producto;

        const div = document.createElement('div');
    div.classList.add('contenedor-producto');
    div.innerHTML = `
      <img src="${imagen}" width="100">
      <div class="contenido-descripcion">
        <div class="contenido-parrafo">
            <p>${nombre}</p>
            <p>Precio Unitario: $${precio.toFixed(3)}</p>
            <p>Cantidad: ${cantidad}</p>
            <p>Precio Total: $${subtotal.toFixed(3)}</p>
        </div>
        <div class="boton">
            <a href="#" class="eliminar-producto" id="${id}"> X </a>
        </div>
      </div>
    `;
    ventanaBody.appendChild(div)
    });
    calcularTotal();
}

function calcularTotal(){
    let total = productosCarrito.reduce((sumaTotal, producto) => sumaTotal + producto.subtotal, 0 );
    totalCompra.innerHTML = `Total: $${total.toFixed(3)}`;
}

function limpiarCarrito(){
    while(ventanaBody.firstChild){
        ventanaBody.removeChild(ventanaBody.firstChild);
    }
}


function guardarProductosStorage(){
    localStorage.setItem('productLS',JSON.stringify(productosCarrito));
}

async function realizarPeticion(datos) {
    try {
        const response = await fetch(datos);

        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        return data;
        } catch (error) {
    }
}



async function renderizarProductos(){
    const productos = await realizarPeticion(file);

    productos.forEach((producto) =>{
        const divCard = document.createElement('div');
        divCard.classList.add('card')
        divCard.innerHTML +=`
            <img src="./img/${producto.img}" alt="${producto.nombre}" />
            <h4>${producto.nombre}</h4>
			<p>$${producto.precio.toLocaleString()}</p>
			<a id=${producto.id} class="boton__carrito" href="#">Agregar</a>
        `;
        contenidoProductos.appendChild(divCard) 
    });
}