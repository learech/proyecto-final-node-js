import ProductService from '../services/products.service.js'
import ProductDTO from '../dao/DTO/product.dto.js' 
const productService = new ProductService();
// const productDTO = new ProductDTO();

import UserService from '../services/users.service.js'
const Service = new UserService()
import CustomError from '../services/errors/customError.js'
import EErrors from '../services/errors/errors-enum.js'
import { generateProductErrorInfo } from '../services/errors/messages/creation-errors-messages.js'

import nodemailer from 'nodemailer'
import { gmailAccount, gmailAppPass } from '../config/env.config.js'

const transporter = nodemailer.createTransport({
  service:'gmail',
  port: 587,
  auth: {
      user:gmailAccount,
      pass:gmailAppPass 
  }
})

export const getWithQuerys = async (req,res) =>{ 
    try {
        let {limit = 4, page = 1, query, sort} = req.query
        if(sort && (sort !== 'asc' && sort !== 'desc')){
            sort = ''
        } 
        const payload = await productService.getAll(page, limit, sort, query);
        res.status(200).json({
            status: "success",
            payload: payload
        })
    } catch (error) {
        res.status(400).json({
            status: "error",
            error: error.message
        })     
    }
}
export const getProductById = async (req, res) =>{
    try {
        const pid = req.params.pid;
        const product = await productService.getProductById(pid);
        res.status(200).json({status:"success",
        message: `Producto con id:${pid}`, payload: product})

    } catch (error) {
        res.status(400).json({status: "error",
            error: error.message
        })
    }
}
export const addProduct = async (req, res) =>{ 
    try {
        const product = req.body
        if(!req.session.user){
          product.owner= 'admin@admin.com.ar' 
        }
        else{
          product.owner= req.session.user.email
        }
       
     
        const { title, description, price, thumbnail,code,stock,category, status } = req.body;
      if (!title || !description || !price || !code || !stock || !category) {
        
          CustomError.createError({
              name: "Product creation error",
              cause: generateProductErrorInfo({ title, description, price,code,stock,category }),
              message: "Error to create Product - TEST",
              code: EErrors.INVALID_TYPES_ERROR
          })
      } 
        const productToAdd = new ProductDTO(product)
        const result= await productService.addProduct(productToAdd)
        res.status(201).json({status:"success",message: 'Added successfuly', payload: result })
    } catch (error) {
        console.error(error);
        res.status(400).json({status: "error", error: error.code, message: error.message})
    }
}
export const deleteProduct = async (req, res) =>{
    try {
        let pid = req.params.pid;
        let product = await productService.getProductById(pid)
        let owner = await Service.getByEmail(product.owner)
        let rol = req.session.user.rol
        let email = req.session.user.email
        if(rol === 'Premium'){
            let productFound = await productService.getProductById(pid)
            if(productFound.owner === email){
              const product = await productService.deleteProduct(pid);
              res.status(200).json({status:"success", message: `The product with id: ${pid} was deleted succesfully!`, payload: product})
            }
            else{
              res.status(400).send({stasus:'error', message:`The product with id: ${pid} could not be removed!`})
            }
        }
        else{
          if(owner.rol === 'Premium'){
            await productService.deleteProduct(pid);

            const deleteProductPremium = {
              from: 'Coder Test - Delete Product Premium User ' + gmailAccount,
              to: owner.email,
              subject: "Correo de prueba coderhouse - programacion backend ",
              html: "<div><h1>A product created by you was removed!</h1></div>",
              attachments: []
              }
              transporter.sendMail(deleteProductPremium, (error, info) => {
                  if (error) {
                      console.log(error);
                      res.status(400).send({ message: "Error", payload: error })
                  }
                  
              })
              res.status(200).json({status:"success", message: `The product with id: ${pid} was deleted succesfully!`})
             
          }
          else{
            await productService.deleteProduct(pid);
            res.status(200).json({status:"success", message: `The product with id: ${pid} was deleted succesfully!`})
          }
        }
    } catch (error) {
        res.status(400).json({
            status: "error",
            error: error.message
        }) 
    }
}
export const updateProduct = async (req, res) =>{
    try {
        const id = req.params.id;
        const productByUser = req.body
        const product = await productService.updateProduct(id, productByUser);
        const result = await productService.getProductById(id)
        res.status(200).json({status: "success", message: `The product with id: ${id} was updated succesfully!`, payload: result
        }) 
    } catch (error) {
        res.status(400).json({
            status: "error",
            error: error.message
        }) 
    }
}

export const addManyProducts = async (req, res) => {
    try { 
      const data = req.body;
      for(let e of data){
        e.owner = req.session.user.email
      }
      const productCreated = await productService.createMany(data); 
      return res.status(201).json({
        status: "success",
        msg: "product created",
        data: productCreated,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        data: {},
      });
    }
  }
export const getProductError = (req,res) => {
res.render("error404", {
  style: "error404.css",
  title: "Error 404",
});
}

