import { generateUser, generateProduct } from '../utils/mocks.js'

export const mockUsers = async (req, res) => {
  try {
    let users = []
    let numUsuarios = 30
    for (let index = 0; index < numUsuarios; index++) {
      users.push(generateUser())
    }
    res.send({ status: "success", payload: users })
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: error, message: "No se pudieron obtener los usuarios:" })
  }
}
export const mockProducts = async (req, res) => {
  try {
    let products = []
    let numOfProducts = 50
    for (let index = 0; index < numOfProducts; index++) {
      products.push(generateProduct())
    }
    res.send({ status: "success", payload: products })
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: error, message: "No se pudieron obtener los Productos:" })
  }
}
export const mockGetError = (req, res) => {
  res.render('error404', {
    style: 'error404.css',
    title: 'Error 404'
  })
}



