import nodemailer from 'nodemailer'
import { secret, gmailAccount, gmailAppPass } from '../config/env.config.js'
import jwt from 'jsonwebtoken'
import userModel from '../dao/mongo/models/users.model.js'
import { createHash, isValidPass } from '../utils/bcrypt.js'

const transporter = nodemailer.createTransport({
  service:'gmail',
  port: 587,
  auth: {
      user:gmailAccount,
      pass:gmailAppPass 
  } 
})
// verificar conexion con gmail
transporter.verify(function (error, success) {
  if (error) {
      console.log(error);
  } else {
      console.log('El servidor está listo para recibir mensajes');
  } 
});

const mailOptions = {
  from: 'Coder Test - ' + gmailAccount,
  to: gmailAccount,
  subject: "Correo de prueba coderhouse - programacion backend",
  html: "<div><h1>Test de envio de correos con Nodemailer</h1></div>",
  attachments: []
}

const mailOptionsWithAttachments =  {
  from: 'Coder Test c_44705 - ' + gmailAccount,
  to: gmailAccount,
  subject: "Correo de prueba coderhouse - programacion backend  - attachments",
  html: `
          <div>
              <h1 style="color:green">Test de envio de correos con Nodemailer</h1>
              <p>Usando imagenes: </p>
              <img src="cid:R"/>
              <img src="https://2.bp.blogspot.com/_6A0dskSgUKw/Su9oBwftcxI/AAAAAAAAAF8/Pt1Lb0Foa6Q/w1200-h630-p-k-no-nu/feller.jpg"/>
          </div>
  `,
  attachments: [
      {
          fileName: 'Reb',
          path:'src/public/images/R.jpg',
          cid: 'R'
      }
  ] 

}
export const sendEmail = (req,res)=>{
   try{
      console.log('Send Mail')
      const result = transporter.sendMail(mailOptions, (error,info)=> {
          if (error){
              res.status(400).send({message:'Error!!', payload:error})
          }
          console.log('Mensaje enviado: %s', info.messageId);
          res.send({ message: "Success!!", payload: info })
      })

  }catch(error){
      console.log(error)
      res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + gmailAccount });
  }
}
export const sendMailWhitAttachments = (req,res)=>{
  try{
      let result = transporter.sendMail(mailOptionsWithAttachments, (error, info) => {
          if (error) {
              console.log(error);
              res.status(400).send({ message: "Error", payload: error })
          }
          res.send({ message: "Success!!", payload: info })
      })
  }
  catch(error){
      console.log(error)
      res.status(500).send({ error: error, message: "No se pudo enviar el email desde: " + gmailAccount });
  }
}
export const forgotPass = (req,res)=>{ 
  res.render('resetSendMail',{
      style: "recovery.css",
      title: "Recovery Pass Form"  
  }) 

} 
export const sendResetPass = async (req,res)=>{
  try{ 
      let userEmail = req.body.email
      console.log(userEmail)
      const user = await userModel.findOne({email:userEmail})
      if(!user){
          return res.status(401).render('resetSendMail',{
              style: "recovery.css",
              title: "Recovery Pass Form",
              message:'E-mail inexistente, por favor envía un e-mail valido'  
          })
      }
      
      const token = jwt.sign({id:user.id}, secret, {expiresIn:'1h'})
   
      const emailRecoveryOptions ={
          from: 'Coder Test c_44705 - ' + gmailAccount,
          to: userEmail,
          subject: "Correo de recuperacion de contraseña - Clase 37",
          html: `
                  <div>
                      <h3>Hola</h3>
                      <h3>Te enviamos este correo para que puedas reestablecer tu contraseña.</h3><br>
                      <h3>Para reestablecer tu contraseña sigue el enlace que se encuentra debajo:</h3>
                      <br>
                      <br>
                      <p>Token de Seguridad:</p>
                      <p> ${token} </p>
                      <br>
                      <br>
                      <a class="btn btn-outline-primary mt-2 ms-2 me-2" href="http://localhost:8080/api/email/reset-form/?token=${token}">Click aqui para reestablecer tu contraseña</a>
                      <br>
                      <br>
                      <br>
                  </div>
                  
          `
      }
      let result = transporter.sendMail(emailRecoveryOptions, (error, info) => {
          if (error) {
              console.log(error);
              res.status(400).send({ message: "Error", payload: error })
          }
          res.status(200).render("resetInfo", {
              style: "resetInfo.css",
              title: "Info",
              message: `Hola  ${userEmail}  : revisa tu correo para reestablecer tu contraseña.`,
              message2:`Recuerda que el link que te enviamos expira en una hora`
            });
          
      })
  } 
  catch(error){
      console.log(error)
      res.status(500).send({ error: error, message: "No se pudo enviar el correo desde: " + gmailAccount });
  }
}

export const resetForm = async (req,res)=>{
  try{
      res.status(200).render("resetPass", {
          style: "resetPass.css",
          title: "Info",
        });

  }
  catch(error){
      console.log(error)
      res.status(500).send({ error: error, message: "No se pudo enviar el correo desde: " + gmailAccount });
  }
  
}
export const resetPass = async (req,res)=>{
  try{
      let {email,password, token} = req.body
      const user = await userModel.findOne({email:email})
      if(isValidPass(password, user.password)){
         return res.status(401).render("resetPass", {
              style: "resetPass.css", 
              title: "Info",
              message:'Ingresa a una contraseña diferente a la que ya posees.',
              token:token
            });
      }
      jwt.verify(token, secret, async(error, user)=>{
          if(error){
              return res.status(500).send({ error: error, message: "No se pudo reestablecer la contraseña del usuario" });
          }
          else{
              const user = await userModel.findOne({email:email})
              let data = { 
                  firstName: user.fileName, 
                  lastName: user.lastName,
                  email: user.email, 
                  age:user.age,
                  password:createHash(password),
                  rol:user.rol }
              await userModel.updateOne( { _id: user._id },data)
              return res.status(200).render("login", {
                  style: "login.css",
                  title: "Login",
                  message:'Usa tu nueva contraseña para loguearte!'
                });
          }
      })
  }
  catch(error){
      console.log(error)
      res.status(500).send({ error: error, message: "No se pudo reestablecer la contraseña del usuario" });
  }
} 
