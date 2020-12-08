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
        if (firstParentId != "none"){
            graph.addNode(firstParentId, firstParentId) 
            graph.addLink(nodeId, firstParentId)
        }
        if (secondParentId != "none"){
            graph.addNode(secondParentId, secondParentId)
            graph.addLink(nodeId, secondParentId)
        }
    })
} catch(err) {
    console.log(err)
}      

//Function called from Index.html
onLoad = () => {

    // first we generate DOM label for each graph node. 
    // Be cautious here, since for large graphs with more than 1k nodes, this will become a bottleneck.
    var domLabels = generateDOMLabels(graph);    
    
    var layout = Viva.Graph.Layout.forceDirected(graph, {
       springLength : 100,
       springCoeff : 0.00005,
       dragCoeff : 0.015,
       gravity : -0.50
    });

   var events = Viva.Graph.webglInputEvents(graphics, graph);

   //Mouse events shows each node data (click and hover)
   events.click(function (node) {
       document.getElementById('mouse-click-node-id').innerText = 'NODE ID (CLICKED): ' + node.id
   }).mouseEnter(function (node) {
    document.getElementById('mouse-hover-node-id').innerText = 'NODE ID (HOVER): ' + node.id
})

    graphics.placeNode(function(ui, pos) {
        // This callback is called by the renderer before it updates node coordinate. 
        // We can use it to update corresponding DOM label position;

        // we create a copy of layout position
        var domPos = {
            x: pos.x,
            y: pos.y
        };
        // And ask graphics to transform it to DOM coordinates:
        graphics.transformGraphToClientCoordinates(domPos);

        // then move corresponding dom label to its own position:
        var nodeId = ui.node.id;
        var labelStyle = domLabels[nodeId].style;
        labelStyle.left = domPos.x + 'px';
        labelStyle.top = domPos.y + 'px';
    });

    var renderer = Viva.Graph.View.renderer(graph, {
            layout    : layout,
            graphics  : graphics,
            container : document.getElementById('graphContainer')
        });

    renderer.run();

    function generateDOMLabels(graph) {
        // this will map node id into DOM element
        var labels = Object.create(null);
        graph.forEachNode(function(node) {
            var label = document.createElement('span');
            label.classList.add('node-label');
            label.innerText = node.id;
            labels[node.id] = label;
            document.body.appendChild(label);
        });
        // NOTE: If your graph changes over time you will need to
        // monitor graph changes and update DOM elements accordingly
        return labels;
      }
}

