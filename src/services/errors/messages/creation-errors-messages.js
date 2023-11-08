export const generateUserErrorInfo = (user) => {

  return `Campos incompletos o inválidos.
  Campos requeridos:
      * fistName: type String, recibido: ${user.firstName}
      * lastName: type String, recibido: ${user.lastName}
      * email: type String, recibido: ${user.email}
      * age: type Number, recibido: ${age.email}
      
`
}

export const generateProductErrorInfo = (product) => {

  return `Campos incompletos o inválidos.
  Campos requeridos:
      * title: type String, recibido: ${product.title}
      * description: type String, recibido: ${product.description}
      * price: type Number, recibido: ${product.price}
      * thumbnail: type String, recibido: ${product.thumbnail}
      * code: type String, recibido: ${product.code}
      * stock: type Number, recibido: ${product.stock}
      * category: type String, recibido: ${product.category}
      * status: type Boolean, recibido: ${product.status}
      * Owner: type String, recibido: ${product.owner}

`
}
