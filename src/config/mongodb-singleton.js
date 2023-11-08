import {mongoUrl, dbName} from './env.config.js';
import mongoose from 'mongoose';

class MongoSingleton {
  static #instance;

  constructor(){
      this.#connectMongoDB();
  };

  static getInstance(){
      if (this.#instance) {
          console.log("Ya hay una conexión abierta a MongoDB.");
      } else {
          this.#instance = new MongoSingleton(); 
      }
      return this.#instance;
  };

  #connectMongoDB = async ()=>{
      try {
          await mongoose.connect(mongoUrl + dbName); 
          console.log("Conectado con éxito a MongoDB usando Moongose.");
      } catch (error) {
          console.error("No se pudo conectar a MongoDB usando Moongose: " + error);
          process.exit();
      }
  };
}

export default MongoSingleton