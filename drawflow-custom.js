var id = document.getElementById("drawflow");
const editor = new Drawflow(id);
// editor.reroute = true;
// editor.reroute_fix_curvature = true;
// editor.force_first_input = false;
var currentNodeId = 0;
var newNodeName = '';
var currentNodeIndex = 0;

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
    //console.log("Node created " + id);
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

function openImportMenu() {
    document.getElementById('import-menu').style.display = 'block';
}

function closeImportMenu() {
    document.getElementById('import-menu').style.display = 'none';
}

function openFileExplorer(inputId) {
    const fileInput = document.getElementById(inputId);

    // Trigger the file input only if it's not already triggered
    if (!fileInput.value) {
        fileInput.click();
    }
}

function handleFileSelection(inputId, callback) {
    const fileInput = document.getElementById(inputId);
    const file = fileInput.files[0];

    if (file) {
        console.log(`Selected file for ${inputId}:`, file.name);
        callback(file);
    }
}

function openProjectConfigFile() {
    openFileExplorer("projectConfigInput");
}

function handleProjectConfigFile() {
    closeImportMenu();
    handleFileSelection("projectConfigInput", (file) => handleFile(file, "projectConfig"));
}

function openRouteTableFile() {
    openFileExplorer("routeTableInput");
}

function handleRouteTableFile() {
    closeImportMenu();
    handleFileSelection("routeTableInput", (file) => handleFile(file, "routeTable"));
}

function handleFile(file, fileType) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const fileContent = event.target.result;
        const parsedObject = JSON.parse(fileContent);

        // Call the appropriate handler based on fileType
        if (fileType === "projectConfig") {
            handleProjectConfig(parsedObject);
        } else if (fileType === "routeTable") {
            handleRouteTable(parsedObject);
        } else {
            console.error("Unknown file type");
        }
    };
    reader.readAsText(file);
}

function handleProjectConfig(projectConfig) {
    if (!projectConfig || !projectConfig.devices) {
        console.error("Invalid project configuration");
        return;
    }

    const devices = projectConfig.devices;
    var isFirstButton = true;

    Object.keys(devices).forEach(deviceType => {
        const deviceArray = devices[deviceType];

        deviceArray.forEach(device => {
            const deviceId = device.id;
            const deviceName = device.name;
            const groupid = device.groupid;

            const { xpos, ypos } = getNextButtonPosition();        

            // Call the editor.addNodeByDeviceId function with deviceId and deviceName
            editor.addNodeByDeviceId(deviceId, deviceName, groupid, 0, 0, xpos, ypos, deviceName, {});
            //console.log(`Creating New Node ${deviceId} ${deviceName} ${xpos} ${ypos}`);
        });
    });
}

function getNextButtonPosition() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const buttonWidth = 200; // Replace with the actual width of your button
    const buttonHeight = 90; // Replace with the actual height of your button
    const margin = 10; // Adjust the margin as needed
    const offset = 70;

    // Calculate the number of columns based on the button width and viewport width
    const numberOfColumns = Math.floor(viewportWidth / (buttonWidth + margin));
    const currentColumn = currentNodeIndex % numberOfColumns;

    // Calculate the position of the button
    let xpos, ypos;
    xpos = currentColumn * (buttonWidth + margin);
    ypos = (Math.floor(currentNodeIndex / numberOfColumns) * (buttonHeight+ margin)) + offset;

    currentNodeIndex++;

    return { xpos, ypos };
}

function handleRouteTable(routeTable) {
    console.log("Handling Route Table:", routeTable);
    // Add your handling logic for routeTable here
}

function createNode(xpos, ypos) {
    var newNodeNameText = document.getElementById("newNodeName").value;

    var selectedNumInputs = parseInt(document.getElementById("addnodemenuinputs").value);
    var selectedNumOutputs = parseInt(document.getElementById("addnodemenuoutputs").value);

    var newNodeIdText = document.getElementById("newNodeId").value;

    editor.addNodeByDeviceId(newNodeIdText, newNodeNameText, selectedNumInputs, selectedNumOutputs, xpos, ypos, newNodeNameText, {});
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

function exportRouteTable() {
    const dataExport = JSON.parse(JSON.stringify(this.drawflow));
    this.dispatch('export', dataExport);
    return dataExport;
}