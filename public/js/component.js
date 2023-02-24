var componentArray = []

var ComponentCounters = {
    "resistor": 1,
    "bulb": 1,
    "cell": 1,
    "wire": 1
};

var SelectedElement = null;

class Component {
    constructor (type) {
        this.type = type;
        this.div = document.createElement("DIV")
        this.connections = []
        this.ports = []
        
        this.div.id = type + ComponentCounters[type]++;
        this.div.classList.add("component");
        this.div.classList.add(type);
        
        
        this.selected = false;
        this.placed = false;
        
        this.addIcon();
        
        this.addToCanvas();
        
        
    }
    
    addToCanvas() {
        let element = this.div
        document.getElementById("component-container").append(element);
        this.addPorts();
        var overlay = document.getElementById("overlay")
        
        // Start Placement
        overlay.style.display = "block"
        element.classList.add("isBeingAdded")
        document.onmousemove = (e) => {
            
            let x = e.pageX;
            let y = e.pageY;
            
            let lockedCoords = this.placeToGrid(x , y);
            x = lockedCoords[0];
            y = lockedCoords[1];
            
            element.style.left = (x-element.clientWidth/2) + "px";
            element.style.top = (y-element.clientHeight/2) + "px";
        }
        
        document.onmousedown = (e) => {
            // console.log("Called")
            if (!(document.getElementById("toolbar").contains(e.target))) {
                console.log("placed")
                overlay.style.display = "none";
                element.classList.remove("isBeingAdded")
                document.onmousemove = () => {}
                document.onmousedown = () => {};
                this.addHandlers();
            }
        }

    }
    
    addIcon() {
        let element = this.div;
        let img = document.createElement("img");
        let svgURL = `../assets/components/${element.classList[1]}.svg`;
        img.src = svgURL;
        img.id = element.id + "-icon";
        img.alt = element.id;
        img.draggable = false;
        
        element.append(img)
    }
    
    addHandlers(){
        this.addMovement()
        this.addControls();
    }
    
    addPorts() {
        
        const createPort = (i) => {
            
            
            let port = document.createElement("div")
            port.classList.add("joint")
            port.classList.add("port")
            this.div.append(port)
            
            console.log(`i: ${i}`)
            // console.log(this.div.style.height/2 - port.clientHeight/2)
            // console.log(this.div.style.width * i)
            
            port.style.position = "absolute"
            port.style.top = (this.div.clientHeight/2 - port.clientHeight/2) + "px"
            port.style.left = (this.div.clientWidth * i - port.clientWidth/2) + "px"
            
            return port
        }

        for (var i = 0; i < 2; i++){ this.ports.push( createPort(i) ) }





    }
    
    addMovement() {
        let element = this.div;
        element.addEventListener("mousedown", () => {
            element.style.position = "absolute";
            SelectedElement = element;
            
            
            document.onmousemove = (e) => {
                
                let x = e.pageX;
                    let y = e.pageY;
                    
                    let lockedCoords = this.placeToGrid(x , y);
                    x = lockedCoords[0];
                    y = lockedCoords[1];
    
                    SelectedElement.style.left = (x-SelectedElement.clientWidth/2) + "px";
                    SelectedElement.style.top = (y-SelectedElement.clientHeight/2) + "px";
            }   
        })
    
        document.onmouseup = () => {
            document.onmousemove = (e) => {}
            SelectedElement = null;
        }
        
    }

    addControls () {
        
        console.log("Adding controls...")
        
        var element = this.div;
        var rotateBtn = document.getElementById("rotate-button");
        var deleteBtn = document.getElementById("delete-button");

        // Add event listener to bring up controls on double-click
        element.addEventListener("dblclick", () => {
            console.log(`${element.id} selected...`)
            element.classList.toggle("selectedComponent")
            rotateBtn.style.display = "block";
            deleteBtn.style.display = "block";
            this.selected = true;
        })

        document.addEventListener('click', (e) => {
            if (!( element.contains(e.target) || rotateBtn.contains(e.target) || deleteBtn.contains(e.target)) && this.selected ) {
                element.classList.toggle("selectedComponent")
                rotateBtn.style.display = "none";
                deleteBtn.style.display = "none";
                this.selected = false
            }
        })
    }
    
    rotate() {
        this.div.classList.toggle("rotated")
    }

    placeToGrid(x, y) {
        let cellsize = 30;
        let NewCoords = []

        let coords = [x , y]
        coords.forEach(coord => {
            let up = Math.ceil(coord/cellsize)*cellsize;
            let down = Math.floor(coord/cellsize)*cellsize;
            NewCoords.push(( Math.abs(coord - up) < Math.abs(coord - down) ? up : down))
        });
    
        return NewCoords;
    }
    
    
}

class Cell extends Component {
    constructor (type) {
        super(type);
        this.voltage = 10.0;
    }
}

class LoadComponent extends Component {
    constructor (type) {
        super(type);
        this.resistance = 10.0;
        this.voltage = 0.0;
    }
}

// In future, an AC Source and logic for AC may be included. But not for now ...

const addComponent = (type) => {

    let component;
    if (type == "Cell") {
        component = new Cell(type);
    } else if (type == "wire") {
        // component = new Wire()

        // window.scroll(window.innerWidth, window.innerHeight)
        component = createWire()
        // component.Realise(window.innerWidth + 100, window.innerHeight + 100)

    } else {
        component = new LoadComponent(type);
    }
    componentArray.push(component);

    console.log(componentArray);

}


const DeleteComponent = () => {
    componentArray.forEach(async (item, index) => {
        if (item.selected) {
            
            console.log(`Deleting Component ${item.div.id}...`)
            
            if (item.div.classList.contains("wire")) {
                await item.destroy()
            } else {
                await item.div.remove();
            }    

            componentArray.splice(index, 1);
            
            console.log("Delete Procedure finished... ")
        }
    })
}

const RotateComponent = () => {
    componentArray.forEach((item) => {
        if (item.selected) {
            item.rotate();
        }
    })
}



// Wire Stuff












const createWire = () => {
    
    const wireName = "wire" + ComponentCounters["wire"]++;
    
    const createJoint = () => {
        let joint = document.createElement("div")
        joint.classList.add("joint")
        container.append(joint)
        return joint
    }
    
    const placeToGrid = (x, y) => {
        let cellsize = 30;
        let NewCoords = []

        let coords = [x , y]
        coords.forEach(coord => {
            let up = Math.ceil(coord/cellsize)*cellsize;
            let down = Math.floor(coord/cellsize)*cellsize;
            NewCoords.push(( Math.abs(coord - up) < Math.abs(coord - down) ? up : down))
        });
    
        return NewCoords;
    }
    
    const positionWireToLine = (X1, Y1, X2, Y2) => {
        const [x2,y2] = placeToGrid(X2, Y2)
        let x1 = X1
        let y1 = Y1
        
        let deltaX = Math.abs(x2-x1)
        let deltaY = Math.abs(y2-y1)
        
        var orientation;
        if (deltaX > deltaY) {
            orientation = "horizontal"
        } else {
            orientation = "vertical"
        } 
        
        console.log(orientation)
        
        if (orientation == "horizontal") { //Horizontal
            return [x2, y1]
        } else { //Vertical
            return [x1, y2]
        }
        
    }

    var container = document.createElement("div")
    container.id = wireName + "-container"
    container.classList.add("wire-container")
    document.getElementById("component-container").append(container)
    
    let joints = [createJoint(), createJoint()]
    
    const thickness = 10
    var wire = new Wire(joints, thickness, wireName)

    
    wire.addToContainer()
    
    
    // Start Placement
    let overlay = document.getElementById("overlay")
    overlay.style.display = "block"
    
    var [joint1, joint2] = joints
    
    var x1, y1, x2, y2
    
    document.onmousemove = (e) => {
        [x1, y1] = placeToGrid(e.pageX, e.pageY)
        joint1.style.left = (x1-joint1.clientWidth/2) + "px";
        joint1.style.top = (y1-joint1.clientHeight/2) + "px";
    }

    document.onclick = (e) => {
        document.onmousemove = (e) => {
            [x2, y2] = positionWireToLine(x1, y1, e.pageX, e.pageY)
            joint2.style.left = (x2-joint1.clientWidth/2) + "px";
            joint2.style.top = (y2-joint1.clientHeight/2) + "px";
        }
        document.onclick = (e) => {
            
            if (x1 == x2 && y1 == y2) {
                return;
            }
            
            overlay.style.display = "none"
            document.onmousemove = () => {}
            document.onclick = () => {}

            
            // Figure out where to draw the div
            
            var length, top, left, orientation
            if (y1 == y2) {
                // wire is horizontal
                orientation = "horizontal"
                top = y1-thickness/2
                left = (x1 < x2 ? x1 : x2)
                length = Math.abs(x2-x1)
            } else {
                //wire is vertical
                orientation = "vertical"
                left = x1-thickness/2
                top = (y1 < y2 ? y1 : y2)
                length = Math.abs(y2-y1)
            }
            wire.Realise(left, top, length, orientation)
        }
    }

    return wire

}




class Wire {
    constructor(joints, thickness, name) {
        this.type = "wire";
        this.div = document.createElement("DIV")
        this.connections = [];
        this.thickness = thickness
        
        this.div.id = name;
        this.div.classList.add("component");
        this.div.classList.add("wire");

        this.joints = joints
    }
    
    addToContainer() { document.getElementById(this.div.id + "-container").append(this.div) }
    
    Realise(left, top, length, orientation) {
        
        
        if (orientation == "horizontal") {
            this.div.style.width = length + "px";
            this.div.style.height = this.thickness + "px";
        } else {
            this.div.style.width = this.thickness + "px";
            this.div.style.height = length + "px";
        }
        
        
        this.div.style.left = left + "px"
        this.div.style.top = top + "px"

        this.addControls()
    }

    addControls () {
        
        console.log("Adding controls...")
        
        var element = this.div;
        var [joint1, joint2] = this.joints
        var deleteBtn = document.getElementById("delete-button");

        // Add event listener to bring up controls on double-click
        const clickHandler = () => {
            console.log(`${element.id} selected...`)
            element.classList.toggle("selectedComponent")
            joint1.classList.toggle("selectedComponent")
            joint2.classList.toggle("selectedComponent")
            deleteBtn.style.display = "block";
            this.selected = true;
        }
        
        element.addEventListener("dblclick", clickHandler)
        joint1.addEventListener("dblclick", clickHandler)
        joint2.addEventListener("dblclick", clickHandler)

        document.addEventListener('click', (e) => {
            if (!( element.contains(e.target) || deleteBtn.contains(e.target)) && this.selected ) {
                element.classList.toggle("selectedComponent")
                joint1.classList.toggle("selectedComponent")
                joint2.classList.toggle("selectedComponent")
                deleteBtn.style.display = "none";
                this.selected = false
            }
        })
    }

    destroy() {
        document.getElementById(this.div.id + "-container").remove()
        this.div.remove()
        this.joints[0].remove()
        this.joints[1].remove()
    }

}







