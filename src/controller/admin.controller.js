import UserService from '../services/users.service.js'
const Service = new UserService()
import { deleteCartUser } from '../services/carts.service.js'
import { createTransport } from 'nodemailer'
import { gmailAccount, gmailAppPass } from '../config/env.config.js'

const transporter = createTransport({
    service:'gmail',
    port: 587,
    auth: {
        user:gmailAccount,
        pass:gmailAppPass 
    }
})

export const adminPanelRender = async (req,res)=>{
    try{
        const users = await Service.getAll();
        const active = []
        const inactive = []
        users.map(u => {
            if (u.rol === 'Admin'){
                console.log(`El usuario ${u.email} es Administrador, no debe ser borrado `)
            }
            else{ 
                const dateUser = new Date(u.last_connection).valueOf()
                const date = Date.now()
                const hs = 172800000  // 48 hs
                const min = 180000  //3 minutos

                if( hs < (date - dateUser)){
                    let userData = {
                        "email": u.email,
                        "rol": u.rol,
                        "firstName":u.firstName,
                        "lastName" : u.lastName,
                        '_id': u._id
                    }
                    inactive.push(userData)
                }
                else{
                    let userData = {
                        "email": u.email,
                        "rol": u.rol,
                        "firstName":u.firstName,
                        "lastName" : u.lastName,
                        '_id': u._id
                    }
                    active.push(userData)
                }
            }
        })
        res.status(200).render('adminPanel', {
            style:'adminPanel.css',
            title:'Admin Panel',
            message:'Admin Panel',
            Admin:req.session.user,
            active: active,
            inactive: inactive
        })
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
          status: 'error',
          msg: 'Uuuups, algo salió mal ',
          data: {},
        });
      }
 
}

export const adminGetUsers = async (req,res)=>{
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
            msg: 'Users founds',
            data: users,
        })
    }
    catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 'error',
      msg: 'Uuuups, algo salió mal ',
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
                payload:user
            }); 
        }else{
            user.rol= 'User'
            await Service.updateOne(_id,user) 
            return res.status(201).json({
                status: 'success',
                msg: 'Usuario actualizado a User',
                payload:user
            });
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 'error',
            msg: 'Uuuups, algo salió mal ',
            data: {},
        });
    }
}

export const adminDelUserById =  async (req, res) => {
    try {
    const uid = req.params.uid;
    const user = await Service.getById(uid)
    await deleteCartUser(user.cart)
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
        msg: 'Uuuups, algo salió mal ',
        data: {},
    });
    }
}

export const adminInactiveUsers = async (req,res)=>{
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
                    console.log(`Usuario: ${u.email} inactivo. Eliminado.`)

                    await Service.deletedOne(u._id)
                    await deleteCartUser(u.cart)

                    const deleteCountEmail = {
                        from: 'Coder Test - Delete Account  ' + gmailAccount,
                        to: u.email,
                        subject: "Correo de prueba Coderhouse",
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
            msg: 'Usuarios eliminados',
            data:result,
        });
        } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 'error',
            msg: 'Uuuups, algo salió mal ',
            data: {},
        });
        }
}
export const getError = (req,res) => {
    res.render("error404", {
      style: "error404.css",
      title: "Error 404",
    });
  }

