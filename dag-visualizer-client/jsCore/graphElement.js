let socketIO
const Viva = require('../vivagraphLib/vivagraph.js')


//Connect to backend server
backendAddress = 'http://localhost:5000'
let graph = Viva.Graph.graph();
var graphics = Viva.Graph.View.webglGraphics();

//Initialize connection through SocketIO
try {
    socketIO = require('socket.io-client')(backendAddress)
    console.log('Connected to backend server...')
    socketIO.on('message', function(nodeId, firstParentId, secondParentId) {
        graph.addNode(nodeId, nodeId) 
        graph.addNode(firstParentId, firstParentId) 
        graph.addNode(secondParentId, secondParentId)
        graph.addLink(nodeId, firstParentId)
        graph.addLink(nodeId, secondParentId)
    })
} catch(err) {
    console.log(err)
}      

//Function called from Index.html
onLoad = () => {

    var layout = Viva.Graph.Layout.forceDirected(graph, {
       springLength : 80,
       springCoeff : 0.00010,
       dragCoeff : 0.015,
       gravity : -2.5
    });

   var events = Viva.Graph.webglInputEvents(graphics, graph);

   //Mouse events shows each node data (click and hover)
   events.click(function (node) {
       document.getElementById('node-id').innerText = 'NODE ID: ' + node.id
   }).mouseEnter(function (node) {
    document.getElementById('node-id').innerText = 'NODE ID: ' + node.id
})

    var renderer = Viva.Graph.View.renderer(graph, {
            layout    : layout,
            graphics  : graphics,
            container : document.getElementById('graphContainer')
        });

    renderer.run();
}

