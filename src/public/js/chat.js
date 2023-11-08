const socket= io()
socket.on('wellcome', (data)=> {
    console.log(data)
})
socket.on('messages-all', (data)=>{
    render(data) 

})
function render(data) {
    const html = data.map(element=>{
        return (`
        <div>
            <h5><strong>${element.user}: ${element.message}</strong></h5>
        </div>
        `)
    }).join(' ') 
    document.getElementById('caja').innerHTML = html 
}

function addMessage(){
    const mensaje={
        user:document.getElementById('username').value,
        message:document.getElementById('message').value 
    }
    chatForm()

    socket.emit('new-message', mensaje) 
    return false 
}

function chatForm(){
    user=document.getElementById('username').value,
    document.getElementById('message').value = '' 
}