import { CartMethods } from '../dao/factory.js'
import ProductService from '../services/products.service.js'
import TicketService from '../services/tickets.service.js'
import UserService from '../services/users.service.js'

const productService = new ProductService()
const ticketService = new TicketService()
const userSevice = new UserService()


class CartService {
  async getAll() {
    try {
      const carts = await CartMethods.find()
      return carts
    } catch (error) {
      throw new Error(error.message)
    }
  }
  async addCart() {
    try {
      let newCart = await CartMethods.create({ products: [] })
      console.log('Carrito creado exitosamente')
      return newCart
    } catch (error) {
      throw new Error(error.message)
    }
  }
  async getCartById(_id) {
    try {
      const cart = await CartMethods.findPopulatedOne(_id)
      return cart
    } catch (error) {
      throw new Error(error.message)
    }
  }
  async deleteCart(_id) {
    try {

      const cart = await CartMethods.updateOne(_id)
      return cart
    } catch (error) {
      throw new Error(error.message)
    }
  }
  async deleteCartUser(_id) {
    try {
      await CartMethods.delete(_id)
      const cart = 'Borrar carrito en service'
      return cart
    } catch (error) {
      throw new Error(error.message)
    }
  }
  async addProductToCart(productId, cartId, user) {
    try {
      let productFound = await productService.getProductById(productId)
      let carts = await this.getAll()
      let checkCId = carts.find((cId) => cId._id.equals(cartId))
      if (!checkCId) {
        throw new Error("id no válida, carrito no encontrado")
      }
      if (productFound.owner === user) {
        throw new Error(`El usuario ${user} no puede cargar un producto al carrito si fue creado por él mismo.`)
      }
      else {

        let cart = await CartMethods.findOne(cartId)
        let existingProduct = cart.products.find((pId) => pId.idProduct.equals(productId))

        if (existingProduct) {
          existingProduct.quantity += 1
        } else {
          cart.products.push({ idProduct: productId, quantity: 1 })
        }
        await cart.save()
        console.log(`Producto ${productId} añadido exitosamente al carrito ${cartId}`)
      }

    } catch (error) {
      throw new Error(error.message)
    }
  }
  async deleteProductFromCart(productId, cartId) {
    try {
      let carts = await this.getAll()
      let checkCId = carts.find((cId) => cId._id.equals(cartId))
      if (!checkCId) {
        throw new Error("id no válida, carrito no encontrado")
      }
      let cart = await CartMethods.findOne(cartId)

      let existingProduct = cart.products.find((pId) => pId.idProduct.equals(productId))
      if (existingProduct) {
        if (existingProduct.quantity === 1) {
          cart.products.splice(cart.products.indexOf(existingProduct), 1)
        } else {
          existingProduct.quantity -= 1
        }
      } else {
        throw new Error(`El producto con id: ${productId} no fue encontrado en el carrito con id:${cartId}`)
      }
      await cart.save()
      console.log(`El producto ${productId} fue borrado exitosamente del carrito ${cartId}`)
    } catch (error) {
      throw new Error(error.message)
    }
  }
  async updateCart(cartId, productId, cartByUser) {
    try {
      if (productId === null) {
        let cart = await CartMethods.findOne(cartId)
        let newCart = cart.products = cartByUser.products
        await cart.save()
        console.log(`Los productos del carrito con id:${cartId} fueron actualizados exitosamente`)
        return newCart
      } else {
        let cart = await CartMethods.findOne(cartId)
        let existingProduct = cart.products.find((pId) => pId.idProduct.equals(productId))
        if (existingProduct) {
          existingProduct.quantity = cartByUser.quantity
        } else {
          throw new Error(`El producto con id: ${productId} no fue encontrado en el carrito con id:${cartId}`)
        }
        await cart.save()
        return cart
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }
  async updateProductsCart(cartId, arrayproductId) {
    try {

      let cart = await CartMethods.updateProducts(cartId, arrayproductId)


      console.log(`Los productos del carrito con id:${cartId} fueron actualizados exitosamente`)
      return cart

    } catch (error) {
      console.log("error", error)
      throw new Error(error.message)
    }
  }
  async purchase(cartId, user) {
    try {

      let cart = await CartMethods.findOne(cartId)
      if (cart) {
        const productIds = cart.products.map(product => product.idProduct.toString())
        const productsQuantity = cart.products.map(quan => quan.quantity)
        const productsData = await productService.getArrProductsData(productIds)

        let amount = 0
        let prodOutStock = []
        let prodStock = []

        productsData.map((prod, index) => {
          if (productsQuantity[index] > prod.stock) {
            prodOutStock.push({
              idProduct: prod._id,
              quantity: productsQuantity[index]
            })
          }

          else {
            let newStock = prod.stock - (productsQuantity[index])
            let priceProduct = prod.price * (productsQuantity[index])
            amount += priceProduct
            prodStock.push({
              idProduct: prod._id,
              stock: newStock
            })

          }
        })
        const ticket = await ticketService.createTicket({
          amount,
          purchaser: user,

        })

        return {
          ticket,
          prodStock,
          prodOutStock
        }

      } else {
        throw new Error('Ese carrito no existe')
      }


    } catch (error) {
      throw new Error(error.message)
    }

  }
  async getPurchase() {
    try {
      const tickets = await ticketService.getTickets()
      return tickets
    } catch (error) {
      throw new Error(error.message)
    }
  }
  async deletePurchase() {
    try {
      const tickets = await ticketService.deletePurchase()
      return tickets
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
export const cartService = new CartService()