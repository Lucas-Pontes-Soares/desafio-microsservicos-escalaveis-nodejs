import { orders } from "./channels/orders.ts";

orders.consume('orders', async message => {
    if(!message){
        return null;
    }
    
    console.log(message?.content.toString());

    orders.ack(message);
}, {
    noAck: false, //não reconhecer, dizer que a mensagem foi recebida com sucesso, eu vou fazer isso se der errado
})