const addProductForm = document.getElementById("product-form");
const addProductFormRealtime = document.getElementById("product-form-realtime");
const productsListContainer = document.getElementById("products_list");



const deleteProduct = async (id) => {
        
    const response = await fetch(`/api/products/${id}`, {
        method: "delete",
    });
    
    if(response.ok) {
        const li = document.getElementById(id);
        li.remove();
    }
};


const deleteProductSocket = async (id) => {       
    socket.emit('deleteProduct', id)
};


// CON FETCH
try {



    // Creo una función para el botón submit para agregar productos desde el formulario
    addProductForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const formData = new FormData(addProductForm);
        const data = Object.fromEntries(formData.entries());

        // Acá tomo los datos del formulario y hago un fetch a /api/producst con un post y agrego un producto
        const response = await fetch("/api/products", {
            method: "post",
            body: JSON.stringify(data),
            headers: {
                "content-type": "application/json",
            },
        });

        const bodyResponse = await response.json();
        const product = bodyResponse.result.payload;


        if (response.ok) {
            const li = `
            <li class="card" id="${product.id}">
                <div>
                    <h2>${product.title}</h2>
                    <h4>${product.description}</h4>
                    <p>Price: <span>$${product.price}</span> </p>
                    <p>Code: <span>${product.code}</span> </p>
                    <p>Stock: <span>${product.stock}</span></p>
                    <p>Category: <span>${product.category}</span></p>
                    <button class="delete_btn" onclick="deleteProduct(${product.id})">Delete</button>
                </div>
            </li>
            `;
            productsListContainer.innerHTML += li;
            addProductForm.reset()
        }
    });
} catch (error) { }




// CON SOCKET.IO
try {




    socket.on('connect', () => {
        console.log('Connection established with the server')
    });

    socket.on('productCreated', product => {
        const li = `
        <li class="card" id="${product.id}">
            <div>
                <h2>${product.title}</h2>
                <h4>${product.description}</h4>
                <p>Price: <span>$${product.price}</span> </p>
                <p>Code: <span>${product.code}</span> </p>
                <p>Stock: <span>${product.stock}</span></p>
                <p>Category: <span>${product.category}</span></p>
                <button class="delete_btn" onclick="deleteProduct(${product.id})">Delete</button>
            </div>
        </li>
        `;
        productsListContainer.innerHTML += li;
        addProductFormRealtime.reset()
    });

    socket.on('productDeleted', (id) => {
        const li = document.getElementById(id);
        li.remove();
    } )

   // Creo una función para el botón submit para agregar productos desde el formulario
addProductFormRealtime.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const formData = new FormData(addProductFormRealtime);
    const data = Object.fromEntries(formData.entries());

    socket.emit('createProduct', data)
}); 
} catch (error) { }


