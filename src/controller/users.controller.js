import UserService from '../services/users.service.js'
const Service = new UserService()
import cartService from '../services/carts.service.js'
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

export const getUser = async (req,res)=>{
  try{
      const users = await Service.getAll();
      let result= []
      users.map(u =>{
          let userData = {
              "email": u.email,
              "rol": u.rol,
              "documents": JSON.stringify(u.documents),
              "last_connection" : u.last_connection || ''
          }
          result.push(userData)
      })
      console.log(result)

      return res.status(200).json({
          status: 'success',
          msg: 'Usuarios encontrados',
          data: users,
      })
  }
  catch (e) {
  console.log(e);
  return res.status(500).json({
    status: 'error',
    msg: 'Uuuups, algo salió mal',
    data: {},
  });
}
}

export const getUserById = async (req, res) => {
  try {
      const uid = req.params.uid;
      const user= await  Service.getById(uid)
      return user? 
      res.status(200).json({
          status: 'success', 
          msg: 'Usuario obtenido con ID',
          data:user,
      }):
      res.status(200).json({
          status: 'error',
          msg: 'Usuario no encontrado',                                                             
          data: user,
      })
  } 
  catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'Uuuups, algo salió mal',
      data: {},
    });
  }
}

export const postUser = (req, res) => {
  res.redirect('/session/login')
} 

export const rolUserById = async (req,res)=>{
  try{
      let _id = req.params.uid
      const user = await  Service.getById(_id)
      if(!user){
          res.status(400).send(`El usuario con id: ${uid} No se encuentra o no existe.`)
      }
      else{
          let address = user.documents.some(e => e.name === 'address')
          let account= user.documents.some(e => e.name === 'accountStatus')
          let identification = user.documents.some(e => e.name === 'identification')
          if(address && account && identification){
              
              user.rol= 'Premium' 
              await user.save() 
              return res.status(201).json({
              status: 'success',
              message: 'Usuario actualizado a Premium',
              payload: user
              });s
          }
          else{
              user.rol= 'User' 
              await user.save() 
              return res.status(400).send({
                  message:'Debes tener los siguientes campos actualizados para ser Premium: address, identification, account status', 
                  Rol: user.rol,
                  documents: user.documents,
              })
          }

      }
     
  }
  catch (e) {
      console.log(e);
      return res.status(500).json({
          status: 'error',
          msg: 'Uuuups, algo salió mal',
          data: {},
      });
  }
}
export const adminRolUserById = async (req,res)=>{ 
  try{
      let _id = req.params.uid
      const user = await  Service.getById(_id)
      if(user.rol === 'User'){
          user.rol= 'Premium' 
          await Service.updateOne(_id,user) 
          return res.status(201).json({
              status: 'success',
              msg: 'Usuario actualizado a Premium',
          });

      }else{
          user.rol= 'User'
          await Service.updateOne(_id,user) 
          return res.status(201).json({
              status: 'success',
              msg: 'Usuario actualizado a User',
          });
      }
  }
  catch (e) {
      console.log(e);
      return res.status(500).json({
          status: 'error',
          msg: 'Uuuups, algo salió mal',
          data: {},
      });
  }
}

export const delUserById =  async (req, res) => {
  try {
  const uid = req.params.uid;
  const user = await Service.getById(uid)
  await cartService.deleteCartUser(user.cart)
  await Service.deletedOne(uid)
  return res.status(200).json({
      status: 'success',
      msg: 'Usuario borrado',
      data: {},
  });
  } catch (e) {
  console.log(e);
  return res.status(500).json({
      status: 'error',
      msg: 'Uuuups, algo salió mal',
      data: {},
  });
  }
}

export const delUsers = async (req,res)=>{
  try {
      const users = await Service.getAll();
      users.map(async (u) =>{
          console.log(u.email)
          if (u.rol === 'Admin'){
              console.log(`El usuario ${u.email} es Administrador, no debe ser borrado `)
          }
          else{

              const dateUser = new Date(u.last_connection).valueOf()
              console.log(dateUser)
              const date = Date.now()
              console.log(date)
              const hs = 172800000 / 48  // 48 hs
              const min = 180000  //3 minutos
          
              if( min < (date - dateUser)){
                  console.log(`Usuario: ${u.email} Inactivo. Eliminado.`)

                  await Service.deletedOne(u._id)
                  await cartService.deleteCartUser(u.cart)

                  const deleteCountEmail = {
                      from: 'Coder Test - Delete Account  ' + gmailAccount,
                      to: u.email,
                      subject: "Correo de prueba de Coderhouse ",
                      html: "<div><h1>Tu cuenta ha sido eliminada por prolongada inactividad</h1></div>",
                      attachments: []
                  }
                  transporter.sendMail(deleteCountEmail, (error, info) => {
                      if (error) {
                          console.log(error);
                          res.status(400).send({ message: "Error", payload: error })
                      }
                      
                  })
              }
              else{
                  console.log(`Usuario: ${u.email} Activo.`)  
              }
          
          }
      })
      const result = await Service.getAll();
      return res.status(200).json({
          status: 'success',
          msg: 'Usuarios borrados',
          data:result,
      });
      } catch (e) {
      console.log(e);
      return res.status(500).json({
          status: 'error',
          msg: 'Uuuuups, algo salió mal',
          data: {},
      });
      }
}

export const putUserById = async (req, res) => { 
  try {
      const uid = req.params.uid;
      const data= req.body
      await Service.updateOne(uid,data)
      return res.status(201).json({
          status: 'success',
          msg: 'Usuario actualizado',
          data:data,
      });
  } 
  catch (e) {
      console.log(e);
      return res.status(500).json({
          status: 'error',
          msg: 'Uuuups, algo salió mal',
          data: {},
      });
  }
}
export const userDocuments = async (req,res) => {
  try{
      const uid = req.params.uid;
      const user= await  Service.getById(uid)
      if(!user){
          res.status(400).send(`El usuario con id: ${uid} No se encuentra o no existe.`)
      }
      const sentDocuments=[]
      const file =req.files
      for(const e in file){
          if(file[e][0].fieldname === 'imageProfile'){
              continue
          }
          else{
              let name=file[e][0].fieldname
              let reference=file[e][0].path
              sentDocuments.push({name:name,reference:reference})
              
              if(user.documents.some(e=>e.name === name)){
                  continue
              }
              else{
                  user.documents.push({name:name,reference:reference})
              }
          }
      }
       await user.save()
      return res.status(200).send({message:'Route :api/users/:uid/document post method', payload: user.documents})
  }
  catch(e){
      console.log(e);
      return res.status(500).json({
          status: 'error',
          msg: 'Uuuups, algo salió mal',
          data: {},
      });
  }

}
export const deleteDocuments = async (req,res) => {
  try{
      const uid = req.params.uid;
      const user= await  Service.getById(uid)
      if(!user){
          res.status(400).send(`Usuario con id: ${uid} No se encuentra o no existen `)
      }
      
      user.documents= []
      await user.save()
      return res.status(200).send({message:'Route :api/user/:uid/document delete method', payload:user})
  }
  catch(e){
      console.log(e);
      return res.status(500).json({
          status: 'error',
          msg: 'Uuuups, algo salió mal',
          data: {},
      });
  }

}