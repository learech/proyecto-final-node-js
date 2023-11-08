import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as gitHubStrategy } from 'passport-github2';
import UserModel from '../dao/mongo/models/users.model.js'
import UserService from '../services/users.service.js';
const userService = new UserService();
import cartService from '../services/carts.service.js'
import {createHash, isValidPass} from '../utils/bcrypt.js'
import { githubClientId, githubSecret, githubCallBack} from '../config/env.config.js'
import fetch from 'node-fetch'

const initializePassport = () => {

  passport.use('login-passport', 
  new LocalStrategy(
      {passReqToCallback:true, usernameField:'email'}, 
      async (req, username, password, done)=>{
          try{
              let userFound = await UserModel.findOne({email:username})
       

              if (!userFound) {
                  console.log('Usuario no encontrado con userName (email) ' + username);
                  return done(null, false);
              }
              if (!isValidPass(password, userFound.password)) {
                  console.log('Password no válido');
                  return done(null, false);
              }

              let userNew = {
                  firstName: userFound.firstName,
                  lastName:userFound.lastName,
                  email:userFound.email,
                  age: userFound.age,
                  password:userFound.password,
                  rol: userFound.rol,
                  cart:userFound.cart,
                  documents: userFound.documents,
                  last_connection: new Date(Date.now())
                
              }  
              await userService.updateOne(userFound._id.toString(), userNew)
              
              let result = await UserModel.findOne({email:username})

              return done(null, result);
          }
          catch (err){
              return done(err);
          }
      })
  ),
  passport.use('register-passport', 
  new LocalStrategy(
      {passReqToCallback:true, usernameField:'email'},
      async (req, username, password,done) => {
          try{
              let newCart = await cartService.addCart() 
              let userData = req.body
              
              let userFound = await UserModel.findOne({email:username})
              if(userFound){
                  console.log('User already exists')
                  done(null,false)
              }

              let userNew = {
                  firstName: userData.firstName,
                  lastName:userData.lastName || 'no-last-name',
                  email:userData.email,
                  age: userData.age || 18,
                  password:createHash(userData.password),
                  rol: 'User',
                  cart:newCart._id,
                  documents: [],
                  last_connection: new Date(Date.now())
                
              }  
              console.log(userNew)
              let result = await UserModel.create(userNew)
              done(null, result)
          }
          catch (err){
              return done('Error creating user' + err)
          }
      }) 
  ),
  passport.use('auth-github', new gitHubStrategy(
      { 
          clientID: githubClientId, 
          clientSecret:  githubSecret,
          callbackURL: githubCallBack
      },
      async (accessToken, refreshToken, profile, done)=>{
          try{
              const res = await fetch('https://api.github.com/user/emails', {
              headers: {
                  Accept: 'application/vnd.github+json',
                  Authorization: 'Bearer ' + accessToken,
                  'X-Github-Api-Version': '2022-11-28',
              },
              });
              
              const emails = await res.json();
              const emailDetail = emails.find((email) => email.verified == true); 

              if (!emailDetail) {
                  return done(new Error('No se pudo obtener un mail válido para este usuario'));
                }
                profile.email = emailDetail.email;
                let date = new Date(8.64e15).toString()
                console.log(date)
                let user = await UserModel.findOne({ email: profile.email });
                if (!user) {
                  let userCart = await cartService.addCart()
                  const newUser = {
                    email: profile.email,
                    firstName: profile._json.name || profile._json.login || 'Avatar',
                    lastName: profile._json.name ||'Avatar',
                    password: null,
                    rol: 'User',
                    cart: userCart._id,
                    documents:[],
                    last_connection: new Date(Date.now())
                  };
                  let userCreated = await UserModel.create(newUser);
                  console.log('Usuario registrado exitosamente');
                  return done(null, userCreated);
                }
                else {
              console.log('el usuario ya existe');
              return done(null, user);
              } 
          }
          catch(err) {
              console.log('Error en auth github');
              console.log(err);
              return done(err);
              }
          }
      )
  ),
  passport.serializeUser((user,done)=>{
      done(null, user._id)
  }), 
  passport.deserializeUser(async (id,done)=>{
      let user= await UserModel.findById(id)
      done(null,user)
  })
}

export default  initializePassport
