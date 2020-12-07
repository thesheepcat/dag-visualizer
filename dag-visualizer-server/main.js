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
      parents = nodeList[node].parents
      //console.log(parents)    
      switch (parents.length){
        case 0:
          firstParentId = "none"
          secondParentId = "none"
          break;
        case 1:
          firstParentId = nodeList[node].parents[0]
          secondParentId = "none"
          break;
        case 2:
          firstParentId = nodeList[node].parents[0]
          secondParentId = nodeList[node].parents[1]
          break;
    } 
    //console.log(nodeId, firstParentId, secondParentId)
    //Send data through socketio channel  
    socketOnServer.emit('message', nodeId, firstParentId, secondParentId);}
  })
} catch(err){
  console.log(String(err))
}




