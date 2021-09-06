const tempCapes = {
    "Developer": {
        "description": "Given out to developers of NameMC+",
        "users": ["88e152f3e54546818cec3e8f85175902", "4a66d3d87eed42e6a479e4139e9041ee", "5787ba858ec44acc8f670e651dc5301d"],
        "src": "https://m6.wtf/assets/nmcp.png",
        "image": "https://m6.wtf/assets/nmcpPreview.png"
    },
    "Marc": {
        "description": "Given out to Marc, for having the most capes in Minecraft",
        "users": ["b05881186e75410db2db4d3066b223f7"],
        "src": "https://m6.wtf/assets/b05881186e75410db2db4d3066b223f7.png",
        "image": "https://m6.wtf/assets/marcCapePreview.png"
    },
    "xinabox": {
        "description": "Given out to xinabox, a huge influence on the OG community",
        "users": ["935e160c0a9d49e5a1ef2ccd1d54ff7d"],
        "src": "https://m6.wtf/assets/935e160c0a9d49e5a1ef2ccd1d54ff7d.png",
        "image": "https://m6.wtf/assets/xinacape.png"
    }
}

class CapeTemplate {
    /**
     * 
     * @param {string} src 
     * @param {string[]} users 
     * @param {string} name 
     * @param {string} description
     * @param {string} redirect
     */
    constructor(src, users, name, description = null, redirect = null, image = null) {
        this.src = src;
        this.users = users;
        this.name = name;
        this.description = description;
        this.redirect = redirect;
        this.image = image;
    }
}

const customCapesURL = chrome.runtime.getURL('../json/customCapes.json');
const capes = fetch(customCapesURL)
    .then((response) => response.json())
    .then((json) => {
        console.log(`Address: ${location.href}`)
        if (location.href == "https://namemc.com/capes") {
            loadCapes(tempCapes, "NameMC+ Capes", "nmcp-cape")
            loadCapes(json, "Custom Capes", "custom-cape");
        }

        if (location.href.includes("namemc.com/nmcp-cape/")) {
            let displayCape = null;
            Object.entries(tempCapes).forEach(obj => {
                if (obj[0].toLowerCase().replace(" ", "-") == location.href.split("namemc.com/nmcp-cape/")[1]) {
                    displayCape = new CapeTemplate(obj[1].src, obj[1].users, obj[0], obj[1].description, null, obj[1].image);
                }
            })
            if (displayCape == null) return;
            document.querySelector("main > div").remove();
            loadCapeInfo(displayCape, "NameMC+ Cape");
        }
        
        if (location.href.includes("namemc.com/custom-cape/")) {
            let displayCape = null;
            Object.entries(json).forEach(obj => {
                if (obj[0].toLowerCase().replace(" ", "-") == location.href.split("namemc.com/custom-cape/")[1]) {
                    displayCape = new CapeTemplate(obj[1].src, obj[1].users, obj[0], obj[1].description);
                }
            })
            if (displayCape == null) return;
            document.querySelector("main > div").remove();
            loadCapeInfo(displayCape, "Custom Cape");
        }
        
        if (location.href.includes("namemc.com/cape/")) {
            const capeInfoURL = chrome.runtime.getURL("../json/capeInfo.json")
            fetch(capeInfoURL).then(response => response.json()).then(async capeJson => {
                const capeHash = location.href.split("namemc.com/cape/")[1];

                const descriptionCard = document.createElement("div");
                descriptionCard.className = "card mb-3";
                descriptionCard.innerHTML = `
                    <div class="d-flex flex-column" style="max-height: 25rem">
                        <div class="card-header py-1">
                            <strong>Description</strong>
                        </div>
                        <div class="card-body py-2">
                            ${capeJson.capes[capeHash].description}
                        </div>
                    </div>
                `;

                /* const lengthText = document.getElementsByClassName("position-absolute bottom-0 right-0 m-1 text-muted")[0].innerHTML.substr(1);
                const capeInfo = new CapeTemplate(textureURL(capeHash), parseInt(lengthText), "Cape");
                createSkinViewer(document.getElementsByClassName("skin-3d")[0].parentElement.parentElement, capeInfo);
                document.getElementsByClassName("skin-3d")[0].parentElement.remove(); */

                const insertBeforeDiv = document.getElementsByClassName("card-body player-list py-2")[0].parentElement.parentElement.parentElement.parentElement.childNodes[0];
                insertBeforeDiv.appendChild(descriptionCard);
            })
        }
    });



async function loadCapes(json, title, urlPath) {
    const capesDiv = document.querySelector("main > div > div");

    const capes = Object.entries(json);
    for(let i = 0; i < Object.keys(json).length; i++) {
        if (i == 0) {
            capesDiv.innerHTML += `
                <div class="container mt-3">
                    <h1 class="text-center">${title}</h1>
                    <hr class="my-0">
                    <br>
                </div>
            `
        }
        // Make it so that if there's five capes in a row, it starts a new row
        if (i / 5 == Math.round(i / 5)) {
            const breakLine = document.createElement("div");
            breakLine.classList = "d-none d-md-block w-100";
            capesDiv.appendChild(breakLine);
        }
        // Create the cape card
        const capeDiv = document.createElement("div");
        capeDiv.className = "col-6 col-md";
        capeDiv.innerHTML = `
            <a href="https://namemc.com/${urlPath}/${capes[i][0].toLowerCase().replace(" ", "-")}">
                <div class="card mb-2">
                    <div class="card-header text-center text-nowrap text-ellipsis p-1" translate="no">${capes[i][0]}</div>
                    <div class="card-body position-relative text-center checkered p-0">
                        <div>
                            <img class="auto-size-square" loading="lazy" width="280" height="280" style="image-rendering: pixelated;" src="${capes[i][1].image ?? capes[i][1].src}" data-src="${capes[i][1].image ?? capes[i][1].src}" alt="${capes[i][0]}" title="${capes[i][0]}">
                        </div>
                        <div class="position-absolute bottom-0 right-0 text-muted mx-1">★${capes[i][1].users.length}</div>
                    </div>
                </div>
            </a>
        `;
        capesDiv.appendChild(capeDiv);
    }
}



/**
 * 
 * @param {CapeTemplate} cape 
 * @param {string} type 
 */
async function loadCapeInfo(cape, type) {
    document.title = `${cape.name} | ${type} | NameMC`;
    const headerDiv = document.querySelector("body > header").appendChild(document.createElement("div"));
    headerDiv.className = "container mt-3";
    headerDiv.innerHTML = `
        <h1 class="text-center" translate="no">${cape.name} <small class="text-muted text-nowrap">${type}</small></h1>
        <hr class="my-0">
    `;

    document.querySelector("main").innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div id="skinViewerDiv" class="card mb-3 card-body position-relative text-center p-0 checkered"></div>
                <div class="card mb-3">
                    <div class="d-flex flex-column" style="max-height: 25rem">
                        <div class="card-header py-1">
                            <strong>Description</strong>
                        </div>
                        <div class="card-body py-2">
                            ${cape.description}
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card mb-3">
                    <div class="d-flex flex-column" style="max-height: 25rem">
                        <div class="card-header py-1">
                            <strong>Profiles (${cape.users.length})</strong>
                        </div>
                        <div class="card-body player-list py-2">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    createSkinViewer(document.getElementById("skinViewerDiv"), cape);

    const namesDiv = document.getElementsByClassName("card-body player-list py-2")[0];
    cape.users.forEach(user => {
        fetch(`https://api.gapple.pw/cors/sessionserver/${user}`).then(response => response.json()).then(json => {
            namesDiv.innerHTML += `<a translate="no" href="/profile/${user}">${json.name}</a> `;
        })
    })
}



async function createSkinViewer(parent, cape) {
    // Skin
    let featureDiv = document.createElement("div");
    featureDiv.id = "skinviewer";
    featureDiv.className = "card mb-3";

    // User count
    featureDiv.innerHTML += `
        <h5 id="skinViewerDiv" class="position-absolute bottom-0 right-0 m-1 text-muted">★${cape.users.length ?? cape.users}</h5>
    `;

    // Add a button for animation
    let featureAnimateButton = document.createElement("button");
    featureAnimateButton.className = "btn btn-secondary play-pause-btn position-absolute top-0 left-0 m-2 p-0";
    featureAnimateButton.style.cssText = "width:32px;height:32px;z-index:1;";
    featureAnimateButton.addEventListener('click', event => {
        this.skinViewerWalk.paused = !this.skinViewerWalk.paused;
    })
    let featureButtonIcon = document.createElement("i")
    featureButtonIcon.className = "fas fa-play";
    featureAnimateButton.appendChild(featureButtonIcon);
    featureDiv.appendChild(featureAnimateButton);

    // Add a button for Elytra
    let featureElytraButton = document.createElement("button");
    featureElytraButton.innerHTML = "Show Elytra"
    featureElytraButton.className = "btn btn-secondary play-pause-btn position-absolute top-0 right-0 m-2 p-0";
    featureElytraButton.style.cssText  = "height:32px;padding:0px 10px !important;z-index:1;";
    featureElytraButton.addEventListener('click', event => {
        if(this.skinViewer.playerObject.backEquipment == "cape") {
            featureElytraButton.innerHTML = "Show Cape"
            this.skinViewer.loadCape(this.skinViewer.capeImage, { backEquipment: 'elytra' })
        } else {
            featureElytraButton.innerHTML = "Show Elytra"
            this.skinViewer.loadCape(this.skinViewer.capeImage, { backEquipment: 'cape' })
        }
    })
    featureDiv.appendChild(featureElytraButton);

    // Add the body
    let featureBody = document.createElement("div");
    featureBody.className = "card-body text-center checkered";

    featureDiv.appendChild(featureBody);

    // Add the canvas
    let featureCanvas = document.createElement("canvas");
    featureCanvas.id = "skin_container"
    featureBody.appendChild(featureCanvas);

    //Insert the div
    parent.appendChild(featureDiv);

    const usedSkin = skinCalculator(cape.users);

    console.log(`Using cape: ${cape.src}`)

    this.skinViewer = new skinview3d.FXAASkinViewer({
        canvas: document.getElementById("skin_container"),
        width: 400,
        height: 362,
        skin: usedSkin,
        cape: cape.src
    });

    this.skinViewer.loadCape("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgBAMAAABQs2O3AAAAKlBMVEUAAABOTk6NjY2Hh4d7e3tzc3NsbGxZWVlKSkpVVVVoaGiEhIR/f39jY2OSVXT6AAAAAXRSTlMAQObYZgAAAKdJREFUOMtjQAOMgsbGxgz4gCADISDYKCiIX0GHoKAAPgWMQAWClClobBQsx69AYnp5Ah4FnB2SM2vxKphZXj5rAR4F7NOnl6cFYJU6AKHm3kpLC8anYFXaslRnrAoMYAqyQp3xmbA01MUlGqsCBQgV4uri4oRPAatLaIgRVgUboApCXHx24zOBx8ZYSQmfAgYj603YFQTAFChpG+NVwGwEtGIUUBsAADaTIwwcJYk6AAAAAElFTkSuQmCC");

    let control = skinview3d.createOrbitControls(this.skinViewer);
    control.enableRotate = true;
    control.enableZoom = false;
    control.enablePan = false;

    this.skinViewerWalk = this.skinViewer.animations.add(skinview3d.WalkingAnimation);
    this.skinViewerWalk.paused = true;

    this.skinViewer.camera.position.set(0, 10, 50);
    control.update();

    this.skinViewer.playerObject.rotation.y = 10;

    //Set style
    document.getElementById("skin_container").style.filter = "drop-shadow(-9px 4px 9px rgba(0,0,0,0.4))"
    document.getElementById("skin_container").style.outline = "none"
}



function textureURL(hash) {
    return 'https://texture.namemc.com/' + hash[0] + hash[1] + '/' + hash[2] + hash[3] + '/' + hash + '.png';
}



const skinCalculator = (users) => {
    if (users) {
        if (users.length == 1) {
            return `https://www.mc-heads.net/skin/${users[0]}`;
        }
    }
    return "https://texture.namemc.com/12/b9/12b92a9206470fe2.png";
}