
const addToCartButtons = document.querySelectorAll(".add-to-cart-button");


const addToCart = ( productId ) => {
    let cartId = document.getElementsByClassName('user-cartId')[0];
    cartId = cartId.textContent
    
    fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            alert("Added to cart:", data);
        })
        .catch((error) => {
            console.error("Error: ", error);
        });
};

const deleteFromCart = ( productId ) => {
    alert(`delete ${productId}`)
}

const purchaseCart = ( cartId ) => {
    alert(`purchase ${cartId}`)
}
