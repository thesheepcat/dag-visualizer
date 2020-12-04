const http = require('http')
const socketIo = require('socket.io')
const nodeList = require('./nodeList.json')

//Activating server
server = http.createServer(onRequest).listen(5000)
console.log('Server activated...')


//Call to check if server is active
function onRequest(req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end('SocketIO server is now active!');
}


//Open socket connection
try{
  //Activate socket instance on server
  socketOnServer = socketIo.listen(server)
  socketOnServer.on('connection', () => {
    console.log('New client has been connected...')
    
    //Send data to listeners
    for (var node in nodeList) {
      nodeId = nodeList[node].id
      firstParentId = nodeList[node].firstParentId
      secondParentId = nodeList[node].secondParentId
      //console.log(nodeId, firstParentId, secondParentId)
      socketOnServer.emit('message', nodeId, firstParentId, secondParentId);}
  })
} catch(err){
  console.log(String(err))
}




