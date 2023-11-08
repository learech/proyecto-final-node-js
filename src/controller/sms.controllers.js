import twilio from 'twilio'
import { twilioAuthToken, twilioSID, twilioNumber, userCellNumber } from '../config/env.config.js'

const twilioClient = twilio(twilioSID, twilioAuthToken)
const SMSOptions = {
    body: "Mensaje de prueba con Twilio desde Coderhouse. Comisión 44705. Leandro Rech",
    from: twilioNumber,
    to:  userCellNumber
} 

export const sendSMS = async (req,res)=>{
    try{
        console.log("Enviando SMS usando la cuenta de Twilio");
   
        const result = await twilioClient.messages.create(SMSOptions)
        res.status(200).send({ message: "Success", payload: result })
    }
    catch(error){
        console.log(error)
        res.status(500).send(error)
    }
}
