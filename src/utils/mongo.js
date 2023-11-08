import mongoose from 'mongoose'
import { dbName } from '../config/env.config'

class ManagerMongo {

  constructor (url){ 
      this.url = url
  } 

      async connect(){
          try {
          const connect = await mongoose.connect(this.url + dbName, { useUnifiedTopology: true, useNewUrlParser: true })
          console.log('Conexión Exitosa !!!')
        } catch (err) {
          console.log(err)
        }
      }
  
}

export default ManagerMongo