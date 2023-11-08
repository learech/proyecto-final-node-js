import { Server } from 'socket.io'
import ProductDTO from '../dao/DTO/product.dto.js'
import ProductService from '../services/products.service.js'
const productService = new ProductService()
import ChatService from '../services/chat.service.js'
let chatService = new ChatService()
const messages = []

function connectSocket(httpServer){ 
  const socketServer = new Server(httpServer);

  socketServer.on('connection', (socket) => {
      console.log(`Nuevo usuario conectado: ${socket.id}`); 
      
     // Comunicacion con realTimeProduct.js
    socket.on('addProduct' ,(data)=>{ 
        const productToAdd = new ProductDTO(data)
        productService.addProduct(productToAdd)
        .then(pr=>{
            productService.find({})
            .then(pr=>{
                socketServer.emit('newData', pr)
            })
            .catch(error=>{
                throw new Error(error.message);   
                
            }) 
        })
        .catch(error=>{
            throw new Error(error.message);   
            
        })  

    })
    socket.on('delProduct', async(data)=>{
        let {id} = data
     
        productService.deleteProduct(id)
        .then(pr =>{ 
            productService.find({})
            .then(pr=>{
                socketServer.emit('newData', pr)
            })
            .catch(error=>{
                throw new Error(error.message);   
                
            }) 
        })
        .catch(error=>{
            throw new Error(error.message);   
            
        })
    })

    // Chat sockets
    socket.on('new-message', (data)=>{
            console.log(data)
            chatService.findOne(data.user)
            .then(pr=>{
                if(pr){
                    let id = pr._id
                    chatService.updateOne(id,data)
                    .then(pr=>{
                        messages.push(data)
                        socketServer.emit('messages-all', messages)
                    })
                    .catch(err=>{
                        console.log('Error al enviar el mensaje')   
                    })
                }
                else{
                    chatService.create(data)
                    .then(pr=>{
                    messages.push(data)
                    socketServer.emit('messages-all', messages)
                    })
                    .catch(err=>{
                        console.log('Error al enviar el mensaje')   
                    })
                }
            })
    })
  });
}

export default connectSocket 