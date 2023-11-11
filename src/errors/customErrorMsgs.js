
const productFormatError = (product) => {
    return `
        Some product properties are not right
        Properties must be:
        * title: String -- ${product.title}
        * description: String -- ${product.description}
        * price: Number -- ${product.price}
        * status: Boolean -- ${product.status}
        * category: String -- ${product.category}
        * code: String -- ${product.code}
        * stock: Number -- ${product.stock}
        * thumbnail: String -- ${product.thumbnail}
        `
};

const productAlreadyExists = (product) => {
    return `
        The product already exists:
        * Product name: ${product.title}
        * Product code: ${product.code}
        `
}

export {
    productFormatError,
    productAlreadyExists
}
