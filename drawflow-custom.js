var id = document.getElementById("drawflow");
const editor = new Drawflow(id);
// editor.reroute = true;
// editor.reroute_fix_curvature = true;
// editor.force_first_input = false;
var currentNodeId = 0;
var newNodeName = '';

// var defaultTemplate = `
//           <div>
//             <div class="title-box">${newNodeNameText}</div>            
//             <div class="box">${newNodeIdText}</div>
//           </div>
//           `;

editor.start();
editor.changeModule('Home');

// Events!
editor.on('nodeCreated', function (id) {
    console.log("Node created " + id);
})

editor.on('nodeRemoved', function (id) {
    console.log("Node removed " + id);
})

editor.on('nodeSelected', function (id) {
    console.log("Node selected " + id);
    currentNodeId = id;
})

var addNodeMenuInputsDropdown = document.getElementById("addnodemenuinputs");
for (var i = 0; i <= 100; i++) {
    var option = document.createElement("option");
    option.value = i;
    option.text = i;
    addNodeMenuInputsDropdown.add(option);
}

var addNodeMenuOutputsDropdown = document.getElementById("addnodemenuoutputs");
for (var i = 0; i <= 100; i++) {
    var option = document.createElement("option");
    option.value = i;
    option.text = i;
    addNodeMenuOutputsDropdown.add(option);
}

function openAddNodeMenu() {
    document.getElementById('add-node-menu').style.display = 'block';
}

function closeAddNodeMenu() {
    var newNodeNameText = document.getElementById("newNodeName");
    newNodeNameText.value = "";

    var newNodeIdText = document.getElementById("newNodeId");
    newNodeIdText.value = "";

    var numInputs = document.getElementById("addnodemenuinputs");
    numInputs.value = 0;

    var numOutputs = document.getElementById("addnodemenuoutputs");
    numOutputs.value = 0;

    newNodeName = "";

    document.getElementById('add-node-menu').style.display = 'none';
}

function createNode() {
    var newNodeNameText = document.getElementById("newNodeName").value;

    var selectedNumInputs = parseInt(document.getElementById("addnodemenuinputs").value);
    var selectedNumOutputs = parseInt(document.getElementById("addnodemenuoutputs").value);

    var newNodeIdText = document.getElementById("newNodeId").value;

    editor.addNodeByDeviceId(newNodeIdText, newNodeNameText, selectedNumInputs, selectedNumOutputs, 100, 100, newNodeNameText, {});
    closeAddNodeMenu();
}

function setInputs(e) {
    var node = editor.getNodeFromId(currentNodeId.toString());

    removeAllInputs(node);

    var numNewInputs = parseInt(document.getElementById("audioMatrixInputs").value);
    addInputs(numNewInputs);
}

function addInputs(numInputs) {
    console.log("Adding " + numInputs + " inputs to Audio Matrix ID" + currentNodeId.toString());
    for (var i = 1; i <= numInputs; i++) {
        editor.addNodeInput(currentNodeId.toString());
    }
}

function removeAllInputs(node) {
    var numOldInputs = Object.keys(node.inputs).length;

    for (let i = numOldInputs; i >= 1; i--) {
        editor.removeNodeInput(currentNodeId.toString(), 'input_' + i);
    }
}

function exportRouteTable () {
    const dataExport = JSON.parse(JSON.stringify(this.drawflow));
    this.dispatch('export', dataExport);
    return dataExport;
  }