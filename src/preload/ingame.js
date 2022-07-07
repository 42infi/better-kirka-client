const {clipboard, ipcRenderer} = require('electron');
const fs = require('fs');
const path = require('path');
const Store = require('electron-store');

const settings = new Store();

const documents = ipcRenderer.sendSync('docs');
const scriptFolder = documents + "\\BetterKirkaClient\\scripts";

if (!fs.existsSync(scriptFolder)) {
    fs.mkdirSync(scriptFolder, {recursive: true});
}
try {
    fs.readdirSync(scriptFolder).filter(file => path.extname(file).toLowerCase() === '.js').forEach(filename => {
        try {
            require(`${scriptFolder}/${filename}`);
        } catch (e) {
            console.error("an error occurred while executing userscript: " + filename + " error: " + e);
        }
    });
} catch (e) {
    console.error("an error occurred while loading userscripts: " + e);
}

let permCrosshair = !!settings.get('permCrosshair');
let noLoadingTimes = true;
let customCss = !!settings.get('customCss');
let hpNumber = true;
let hideWeaponsAds = !!settings.get('hideWeaponsAds');
let hideArms = !!settings.get('hideArms');
let playerHighLight = !!settings.get('playerHighLight');
let fullBlack = !!settings.get('fullBlack');
let wireframeWeapons = !!settings.get('wireframeWeapons');
let wireframeArms = !!settings.get('wireframeArms');
let rainbow = !!settings.get('rainbow');
let adspower = !!settings.get('adspower');
let autoJoin = !!settings.get('autoJoin');
let fpsCap  = typeof settings.get('fpsCap') == 'undefined' ? false : settings.get('fpsCap');
let capture  = typeof settings.get('capture') == 'undefined' ? false : settings.get('capture');


let inspecting = false;
let prevInsp = false;
let prevInspectPos;
let prevInspectRot;
let prevWireframeWeapons = false;
let prevWireframeArms = false;

let gui = document.createElement("div");
let menuVisible = false;

let listening = false;
if (!settings.get('inspectKey')) settings.set('inspectKey', "j");

let euLobbies = !!settings.get('euLobbies');
let naLobbies = !!settings.get('naLobbies');
let asiaLobbies = !!settings.get('asiaLobbies');
let ffaLobbies = !!settings.get('ffaLobbies');
let tdmLobbies = !!settings.get('tdmLobbies');
let parkourLobbies = !!settings.get('parkourLobbies');
let preferredFilter = typeof settings.get('preferredFilter') == 'undefined' ? 'Players' : settings.get('preferredFilter');
let minPlayers = typeof settings.get('minPlayers') == 'undefined' ? 4 : settings.get('minPlayers');
let maxPlayers = typeof settings.get('maxPlayers') == 'undefined' ? 8 : settings.get('maxPlayers');
let minTimeLeft = typeof settings.get('minTimeLeft') == 'undefined' ? 3 : settings.get('minTimeLeft');
let filterMaps = !!settings.get('filterMaps');
let avoidSameLobby = true;
let currentURL = window.location.href;
let gameModes = [];
let bestLobby = '';
let allLobbyData = [];
let maps = settings.get('maps') ? settings.get('maps') : [];
let responseCount = 0;
let minPlayerSlider;
let maxPlayerSlider;
let minPlayersLab;
let maxPlayersLab;
let minTimeLeftSlider;
let minTimeLeftLab;
let settingsButtonsAdded = false;

let scene;

WeakMap.prototype.set = new Proxy(WeakMap.prototype.set, {
    apply(target, thisArg, argArray) {

        if (argArray[0] && argArray[0].type === 'Scene' && argArray[0].children[0].type === 'AmbientLight') {
            scene = argArray[0];
        }

        return Reflect.apply(...arguments);
    }
});

let crosshair;

new MutationObserver(mutationRecords => {
    try {
        mutationRecords.forEach(record => {
            record.addedNodes.forEach(el => {
                if (el.classList?.contains("loading-scene") && noLoadingTimes) el.parentNode.removeChild(el);
                if (el.id === "qc-cmp2-container") el.parentNode.removeChild(el);
                if (el.id === "cmpPersistentLink" || el.classList?.contains("home") || el.classList?.contains('moneys')) {

                    let btn = document.createElement("button");

                    btn.id = "clientJoinButton";

                    btn.style = "background-color: var(--primary-1);\n" +
                        "    --hover-color: var(--primary-2);\n" +
                        "    --top: var(--primary-2);\n" +
                        "    --bottom: var(--primary-3);" +
                        "    display: flex;\n" +
                        "    justify-content: center;\n" +
                        "    align-items: center;\n" +
                        "    border: none;\n" +
                        "    position: absolute;\n" +
                        "    color: var(--white);\n" +
                        "    font-size: 1rem;\n" +
                        "    transition: all .3s ease;\n" +
                        "    font-family: Rowdies;\n" +
                        "    padding: .9em 1.4em;\n" +
                        "    transform: skew(-10deg);\n" +
                        "    font-weight: 900;\n" +
                        "    overflow: hidden;\n" +
                        "    text-transform: uppercase;\n" +
                        "    border-radius: .2em;\n" +
                        "    outline: none;\n" +
                        "    text-shadow: 0 0.1em 0 #000;\n" +
                        "    -webkit-text-stroke: 1px var(--black);\n" +
                        "    box-shadow: 0 0.15rem 0 rgba(0,0,0,.315);\n" +
                        "    cursor: pointer;" +
                        "    box-shadow: 0 5.47651px 0 rgba(0,0,0,.5)!important;\n" +
                        "    text-shadow: -1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000,0 1px 1px rgba(0,0,0,.486)!important;" +
                        "    width: 150px;" +
                        "    height: 50px;" +
                        "    bottom: 0px;" +
                        "    right: 100%;" +
                        "    margin-right: 10px;" +
                        "    font-size: 20px;";


                    btn.innerText = "Join Link";

                    btn.onclick = () => {
                        window.open(clipboard.readText());
                    }

                    document.getElementsByClassName('play-content')[0].append(btn);

                    document.getElementsByClassName('settings-and-socicons')[0].children[0].onclick = () => {
                        window.open("https://discord.com/invite/cNwzjsFHpg");
                    };

                    document.getElementsByClassName('settings-and-socicons')[0].children[1].onclick = () => {
                        window.open("https://github.com/42infi/better-kirka-client/releases");
                    };

                    if (!el.classList?.contains("home") && !el.classList?.contains('moneys')) el.parentNode.removeChild(el);

                }
                if (el.classList?.contains("game-interface")) {
                    crosshair = document.getElementById("crosshair-static");
                    let hpElem = document.getElementsByClassName("hp-progress")[0];
                    document.getElementsByClassName('hp-title')[0].innerText = hpElem.style.width.slice(0, -1);
                    observer.observe(hpElem, {
                        attributeFilter: ["style"],
                    });
                }
                if(el.classList?.contains("settings") && !settingsButtonsAdded){

                    let exportBtn = document.createElement('div');

                    exportBtn.id = "importBtn";

                    exportBtn.style = "line-height: 1.2;\n" +
                        "user-select: none;\n" +
                        "--white: #fff;\n" +
                        "--secondary-2: #37477c;\n" +
                        "-webkit-font-smoothing: antialiased;\n" +
                        "text-align: center;\n" +
                        "font-family: Exo\\ 2;\n" +
                        "box-sizing: border-box;\n" +
                        "text-shadow: -1px -1px 0 #0f0f0f,1px -1px 0 #0f0f0f,-1px 1px 0 #0f0f0f,1px 1px 0 #0f0f0f;\n" +
                        "font-weight: 100;\n" +
                        "height: 100%;\n" +
                        "padding: 0 .8rem;\n" +
                        "color: var(--white);\n" +
                        "font-size: 1.5rem;\n" +
                        "box-shadow: 0 .125rem .25rem rgba(24,28,40,.25);\n" +
                        "border-radius: 0 .313rem .313rem 0;\n" +
                        "background-color: var(--secondary-2);\n" +
                        "display: flex;\n" +
                        "justify-content: center;\n" +
                        "align-items: center;"

                    exportBtn.onmouseover = () =>{
                        exportBtn.style.color = "#ffd500";
                    }

                    exportBtn.onmouseout = () =>{
                        exportBtn.style.color = "#ffffff";
                    }

                    exportBtn.innerText = "Export to clipboard"

                    exportBtn.onclick = () => {
                        let gameSettingsObj = {};

                        for (let key in localStorage){
                            if(key.startsWith("m")){
                                if(localStorage[key].startsWith('"') && localStorage[key].endsWith('"')){
                                    gameSettingsObj[key] = localStorage[key].slice(1, -1);
                                }else{
                                    gameSettingsObj[key] = localStorage[key];
                                }
                            }
                        }
                        clipboard.writeText(JSON.stringify(gameSettingsObj));
                    }


                    let importBtn = document.createElement('div');

                    importBtn.id = "importBtn";

                    importBtn.style = "line-height: 1.2;\n" +
                        "user-select: none;\n" +
                        "--white: #fff;\n" +
                        "--secondary-2: #37477c;\n" +
                        "-webkit-font-smoothing: antialiased;\n" +
                        "text-align: center;\n" +
                        "font-family: Exo\\ 2;\n" +
                        "box-sizing: border-box;\n" +
                        "text-shadow: -1px -1px 0 #0f0f0f,1px -1px 0 #0f0f0f,-1px 1px 0 #0f0f0f,1px 1px 0 #0f0f0f;\n" +
                        "font-weight: 100;\n" +
                        "height: 100%;\n" +
                        "padding: 0 .8rem;\n" +
                        "color: var(--white);\n" +
                        "font-size: 1.5rem;\n" +
                        "box-shadow: 0 .125rem .25rem rgba(24,28,40,.25);\n" +
                        "border-radius: 0 .313rem .313rem 0;\n" +
                        "background-color: var(--secondary-2);\n" +
                        "display: flex;\n" +
                        "justify-content: center;\n" +
                        "align-items: center;"

                    importBtn.onmouseover = () =>{
                        importBtn.style.color = "#ffd500";
                    }

                    importBtn.onmouseout = () =>{
                        importBtn.style.color = "#ffffff";
                    }

                    importBtn.innerText = "Import from clipboard"

                    importBtn.onclick = () => {
                        Object.assign(localStorage, JSON.parse(clipboard.readText()));
                        window.location.reload();
                    }

                    document.getElementsByClassName('left')[0].appendChild(exportBtn);
                    document.getElementsByClassName('left')[0].appendChild(importBtn);

                    settingsButtonsAdded = true;

                }
            });
        });
    } catch {
    }
}).observe(document, {childList: true, subtree: true});


let oldLog = console.log;

console.log = (...arguments) => {
    if (typeof arguments[0] == "string" && arguments[0].includes("refresh") && arguments[0].includes("ad") && !arguments[0].includes("added")) {
        throw "ad's blocked by overengineered ad block " + Math.random().toString().split(".")[1];
    }
    oldLog(...arguments);
};


document.addEventListener("DOMContentLoaded", () => {

    if (customCss) {
        let cssLinkElem = document.createElement("link");
        cssLinkElem.href = settings.get('cssLink');
        cssLinkElem.rel = "stylesheet";
        document.head.append(cssLinkElem);
    }

    gui.id = "gui";

    gui.innerHTML += "<style>\n" +
        "        @import url('https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300&display=swap');\n" +
        "\n" +
        "        #gui {\n" +
        "            background-color: rgb(24, 25, 28);\n" +
        "            border: solid rgb(24, 25, 28) 5px;\n" +
        "            box-shadow: 0 0 8px 2px #000000;\n" +
        "            position: absolute;\n" +
        "            left: 200px;\n" +
        "            top: 100px;\n" +
        "            z-index: 300;\n" +
        "            color: rgb(255, 255, 255);\n" +
        "            padding: 6px;\n" +
        "            font-family: \"Titillium Web\", serif;\n" +
        "            line-height: 1.6;\n" +
        "            border-radius: 3px\n" +
        "        }\n" +
        "\n" +
        "        input:disabled {\n" +
        "            background: rgb(255, 255, 255);\n" +
        "            border: solid rgb(0, 0, 0) 1px;\n" +
        "            width: 50px;\n" +
        "        }\n" +
        "\n" +
        "        .heading {\n" +
        "            width: 300px;\n" +
        "            height: 40px;\n" +
        "            display: flex;\n" +
        "            justify-content: center;\n" +
        "            align-items: center;\n" +
        "            background-color: rgb(24, 25, 28);\n" +
        "            margin: -9px -6px 8px;\n" +
        "            font-family: \"Titillium Web\", serif;\n" +
        "            font-weight: bold;\n" +
        "            text-align: center;\n" +
        "            font-size: 24px;\n" +
        "            border-bottom: solid rgb(140, 140, 140) 2px;\n" +
        "        }\n" +
        "\n" +
        "        .footer {\n" +
        "            width: 300px;\n" +
        "            height: 20px;\n" +
        "            display: flex;\n" +
        "            justify-content: center;\n" +
        "            align-items: center;\n" +
        "            background-color: rgb(24, 25, 28);\n" +
        "            margin: 6px -6px -10px;\n" +
        "            font-family: \"Titillium Web\", serif;\n" +
        "            font-weight: bold;\n" +
        "            text-align: center;\n" +
        "            font-size: 11px;\n" +
        "            position: relative;\n" +
        "            border-top: solid rgb(140, 140, 140) 2px;\n" +
        "        }\n" +
        "\n" +
        "        .module:hover {\n" +
        "            background-color: rgb(0, 0, 0, 0.1)\n" +
        "        }\n" +
        "\n" +
        "        .autojoin{\n" +
        "            display: none;\n" +
        "        }\n" +
        "\n" +
        "    </style>\n" +
        "    <div id=\"infi\" class=\"heading\">Client Settings</div>\n" +
        "\n" +
        "    <div class=\"module\">\n" +
        "        <input type=\"checkbox\" id=\"crosshair\" name=\"crosshair\">\n" +
        "        <label for=\"crosshair\">Perm. Crosshair</label>\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"module\">\n" +
        "        <input type=\"checkbox\" id=\"customCSS\" name=\"customCSS\">\n" +
        "        <label for=\"customCSS\">CSS Link: </label>\n" +
        "        <input type=\"text\" id=\"cssLink\" placeholder=\"Paste CSS Link Here\">\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"module\">\n" +
        "        <input type=\"checkbox\" id=\"hideweap\" name=\"hideweap\">\n" +
        "        <label for=\"hideweap\">Hide Weapon ADS</label>\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"module\">\n" +
        "        <input type=\"checkbox\" id=\"arms\" name=\"arms\">\n" +
        "        <label for=\"arms\">Hide Arms</label>\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"module\">\n" +
        "        <input type=\"checkbox\" id=\"highlight\" name=\"highlight\">\n" +
        "        <label for=\"highlight\">Highlight Enemies</label>\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"module\">\n" +
        "        <input type=\"checkbox\" id=\"black\" name=\"black\">\n" +
        "        <label for=\"black\">Black Players</label>\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"module\">\n" +
        "        <input type=\"checkbox\" id=\"wireframeWeapons\" name=\"wireframeWeapons\">\n" +
        "        <label for=\"wireframeWeapons\">Wireframe Weapons</label>\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"module\">\n" +
        "        <input type=\"checkbox\" id=\"wireframeArms\" name=\"wireframeArms\">\n" +
        "        <label for=\"wireframeArms\">Wireframe Arms</label>\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"module\">\n" +
        "        <input type=\"checkbox\" id=\"rainbow\" name=\"rainbow\">\n" +
        "        <label for=\"rainbow\">Rainbow Colors</label>\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"module\">\n" +
        "        Inspect Key\n" +
        "        <button id=\"bindButton\" style=\"width: 100px\">click to bind</button>\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"module\">\n" +
        "        <input type=\"checkbox\" id=\"adspower\" name=\"adspower\">\n" +
        "        <label for=\"adspower\">0 ADS Power</label>\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"module\">\n" +
        "        <input type=\"checkbox\" id=\"autoJoin\" name=\"autoJoin\">\n" +
        "        <label for=\"autoJoin\">Auto-Joiner (Key F7)</label>\n" +
        "    </div>\n" +
        "\n" +
        "    <hr class=\"autojoin\">\n" +
        "\n" +
        "    <div class=\"module autojoin\">\n" +
        "        <input type=\"checkbox\" id=\"euLobbies\" name=\"euLobbies\">\n" +
        "        <label for=\"euLobbies\">EU Lobbies</label>\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"module autojoin\">\n" +
        "        <input type=\"checkbox\" id=\"naLobbies\" name=\"naLobbies\">\n" +
        "        <label for=\"naLobbies\">NA Lobbies</label>\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"module autojoin\">\n" +
        "        <input type=\"checkbox\" id=\"asiaLobbies\" name=\"asiaLobbies\">\n" +
        "        <label for=\"asiaLobbies\">ASIA Lobbies</label>\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"module autojoin\">\n" +
        "        <input type=\"checkbox\" id=\"ffaLobbies\" name=\"ffaLobbies\">\n" +
        "        <label for=\"ffaLobbies\">FFA Lobbies</label>\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"module autojoin\">\n" +
        "        <input type=\"checkbox\" id=\"tdmLobbies\" name=\"tdmLobbies\">\n" +
        "        <label for=\"tdmLobbies\">TDM Lobbies</label>\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"module autojoin\">\n" +
        "        <input type=\"checkbox\" id=\"parkourLobbies\" name=\"parkourLobbies\">\n" +
        "        <label for=\"parkourLobbies\">PARKOUR Lobbies</label>\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"module autojoin\">\n" +
        "        <label for=\"preferredFilter\">Prefered Filter:</label>\n" +
        "        <select id=\"preferredFilter\" name=\"preferredFilter\">\n" +
        "            <option value=\"Time\">Time</option>\n" +
        "            <option value=\"Players\">Players</option>\n" +
        "        </select>\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"module autojoin\">\n" +
        "        <input type=\"range\" id=\"minPlayers\" name=\"minPlayers\" min=\"0\" max=\"8\" value=\"0\" step=\"1\">\n" +
        "        <label id=\"minPlayersLab\" for=\"minPlayers\">min. Players</label>\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"module autojoin\">\n" +
        "        <input type=\"range\" id=\"maxPlayers\" name=\"maxPlayers\" min=\"0\" max=\"8\" value=\"0\" step=\"1\">\n" +
        "        <label id=\"maxPlayersLab\" for=\"maxPlayers\">max. Players</label>\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"module autojoin\">\n" +
        "        <input type=\"range\" id=\"minTimeLeft\" name=\"minTimeLeft\" min=\"0\" max=\"8\" value=\"0\" step=\"1\">\n" +
        "        <label id=\"minTimeLeftLab\" for=\"minTimeLeft\">min. Time Left</label>\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"module autojoin\">\n" +
        "        <input type=\"checkbox\" id=\"filterMaps\" name=\"filterMaps\">\n" +
        "        <label for=\"filterMaps\">Map Filter: </label>\n" +
        "        <input type=\"text\" id=\"mapFilterField\" placeholder=\"Map1, Map2, Map3, etc.\">\n" +
        "    </div>\n" +
        "\n" +
        "    <hr class=\"autojoin\">\n" +
        "\n" +
        "    <div class=\"module\">\n" +
        "        <input type=\"checkbox\" id=\"fpsCap\" name=\"fpsCap\">\n" +
        "        <label for=\"fpsCap\">Cap FPS</label>\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"module\">\n" +
        "        <input type=\"checkbox\" id=\"capture\" name=\"capture\">\n" +
        "        <label for=\"capture\">Window Capture</label>\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"footer\">Toggle With \"PageUp\" Key</div>";


    gui.onclick = (e) => {

        if (e.target.id === "crosshair") {
            permCrosshair = e.target.checked;
            settings.set('permCrosshair', permCrosshair);
        }

        if (e.target.id === "customCSS") {
            customCss = e.target.checked;
            settings.set('customCss', customCss);
        }

        if (e.target.id === "hideweap") {
            hideWeaponsAds = e.target.checked;
            settings.set('hideWeaponsAds', hideWeaponsAds);
        }

        if (e.target.id === "arms") {
            hideArms = e.target.checked;
            settings.set('hideArms', hideArms);
        }

        if (e.target.id === "highlight") {
            playerHighLight = e.target.checked;
            settings.set('playerHighLight', playerHighLight);
        }

        if (e.target.id === "black") {
            fullBlack = e.target.checked;
            settings.set('fullBlack', fullBlack);
        }

        if (e.target.id === "wireframeWeapons") {
            wireframeWeapons = e.target.checked;
            settings.set('wireframeWeapons', wireframeWeapons);
        }

        if (e.target.id === "wireframeArms") {
            wireframeArms = e.target.checked;
            settings.set('wireframeArms', wireframeArms);
        }

        if (e.target.id === "rainbow") {
            rainbow = e.target.checked;
            settings.set('rainbow', rainbow);
        }

        if (e.target.id === "adspower") {
            adspower = e.target.checked;
            settings.set('adspower', adspower);
        }

        if (e.target.id === "autoJoin") {
            autoJoin = e.target.checked;
            settings.set('autoJoin', autoJoin);
            for (let e of document.getElementsByClassName('autojoin')) {
                e.style.display = autoJoin ? 'block' : 'none'
            }
        }

        if (e.target.id === "euLobbies") {
            euLobbies = e.target.checked;
            settings.set('euLobbies', euLobbies);
        }

        if (e.target.id === "naLobbies") {
            naLobbies = e.target.checked;
            settings.set('naLobbies', naLobbies);
        }

        if (e.target.id === "asiaLobbies") {
            asiaLobbies = e.target.checked;
            settings.set('asiaLobbies', asiaLobbies);
        }

        if (e.target.id === "ffaLobbies") {
            ffaLobbies = e.target.checked;
            settings.set('ffaLobbies', ffaLobbies);
        }

        if (e.target.id === "tdmLobbies") {
            tdmLobbies = e.target.checked;
            settings.set('tdmLobbies', tdmLobbies);
        }

        if (e.target.id === "parkourLobbies") {
            parkourLobbies = e.target.checked;
            settings.set('parkourLobbies', parkourLobbies);
        }

        if (e.target.id === "filterMaps") {
            filterMaps = e.target.checked;
            settings.set('filterMaps', filterMaps);
        }

        if (e.target.id === "fpsCap") {
            fpsCap = e.target.checked;
            settings.set('fpsCap', fpsCap);
            alert("setting will apply after client restart");
        }

        if (e.target.id === "capture") {
            capture = e.target.checked;
            settings.set('capture', capture);
            alert("setting will apply after client restart");
        }

    };

    gui.style.display = "none";

    document.body.appendChild(gui);

    if (settings.get('menuOpen') === undefined || settings.get('menuOpen')) {
        toggleGui();
    }

    document.getElementById("crosshair").checked = permCrosshair;
    document.getElementById("customCSS").checked = customCss;
    document.getElementById("hideweap").checked = hideWeaponsAds;
    document.getElementById("arms").checked = hideArms;
    document.getElementById("highlight").checked = playerHighLight;
    document.getElementById("black").checked = fullBlack;
    document.getElementById("wireframeWeapons").checked = wireframeWeapons;
    document.getElementById("wireframeArms").checked = wireframeArms;
    document.getElementById("rainbow").checked = rainbow;
    document.getElementById("adspower").checked = adspower;

    maxPlayersLab = document.getElementById('maxPlayersLab');
    minPlayersLab = document.getElementById('minPlayersLab');
    minTimeLeftLab = document.getElementById('minTimeLeftLab');

    maxPlayerSlider = document.getElementById("maxPlayers");
    minPlayerSlider = document.getElementById("minPlayers");
    minTimeLeftSlider = document.getElementById("minTimeLeft");

    maxPlayerSlider.onchange = () => {
        settings.set('maxPlayers', Number.parseInt(maxPlayerSlider.value));
    }

    minPlayerSlider.onchange = () => {
        settings.set('minPlayers', Number.parseInt(minPlayerSlider.value));
    }

    minTimeLeftSlider.onchange = () => {
        settings.set('minTimeLeft', Number.parseInt(minTimeLeftSlider.value));
    }

    minPlayerSlider.value = minPlayers;
    maxPlayerSlider.value = maxPlayers;
    minTimeLeftSlider.value = minTimeLeft;

    if (autoJoin) {
        for (let e of document.getElementsByClassName('autojoin')) {
            e.style.display = autoJoin ? 'block' : 'none'
        }
    }

    document.getElementById("autoJoin").checked = autoJoin;
    document.getElementById("euLobbies").checked = euLobbies;
    document.getElementById("naLobbies").checked = naLobbies;
    document.getElementById("asiaLobbies").checked = asiaLobbies;
    document.getElementById("ffaLobbies").checked = ffaLobbies;
    document.getElementById("tdmLobbies").checked = tdmLobbies;
    document.getElementById("parkourLobbies").checked = parkourLobbies;

    let button = document.getElementById("bindButton");
    button.style.fontWeight = "800";
    button.onclick = () => {
        listening = true;
        button.innerText = "Press a Key"
    }

    button.innerText = settings.get('inspectKey').toUpperCase();

    let cssField = document.getElementById('cssLink');

    if (settings.get('cssLink') === undefined) settings.set('cssLink', '');

    cssField.value = settings.get('cssLink');

    cssField.oninput = () => {
        settings.set('cssLink', cssField.value);
    }

    let filter = document.getElementById("preferredFilter");

    filter.value = preferredFilter;

    filter.onchange = () => {
        preferredFilter = filter.value;
        settings.set('preferredFilter', filter.value);
    }

    document.getElementById("filterMaps").checked = filterMaps;

    let mapField = document.getElementById("mapFilterField");

    let mapString = "";
    for (let name of maps) {
        mapString += name + ", "
    }

    mapField.value = mapString.slice(0, -2);

    mapField.oninput = () => {
        maps = mapField.value.replaceAll(' ', '').toLowerCase().split(',');
        settings.set('maps', maps);
    }

    document.getElementById("fpsCap").checked = fpsCap;
    document.getElementById("capture").checked = capture;

});

window.addEventListener("mouseup", (e) => {
    if (e.button === 3 || e.button === 4)
        e.preventDefault();
});

const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        document.getElementsByClassName('hp-title')[0].innerText = hpNumber ? mutation.target.style.width.slice(0, -1) : "HP";
    });
});

let scoped = false;

document.addEventListener('mousedown', (e) => {
    if (e.button === 2) scoped = true;
});

document.addEventListener('mouseup', (e) => {
    if (e.button === 2) scoped = false;
});

let inspectedWeapon;

document.addEventListener('keydown', (e) => {

    if (listening) {
        settings.set('inspectKey', e.key);
        document.getElementById("bindButton").innerText = e.key.toUpperCase();
        listening = false;
    }

    if (e.key === settings.get("inspectKey").toLowerCase()) {
        inspecting = true;
        setTimeout(() => {
            inspecting = false
        }, 3000);
    }

    if (e.code === "PageUp") {
        toggleGui();
    }

});

let r = 255;
let g = 0;
let b = 0;

function animate() {
    window.requestAnimationFrame(animate);
    if (rainbow) {
        if (r > 0 && b === 0) {
            r--;
            g++;
        }
        if (g > 0 && r === 0) {
            g--;
            b++;
        }
        if (b > 0 && g === 0) {
            r++;
            b--;
        }
    } else {
        let color = hexToRgb("#ff0000");
        r = color.r;
        g = color.g;
        b = color.b;
    }

    if (menuVisible) {
        if (minPlayerSlider) {
            minPlayers = Number.parseInt(minPlayerSlider.value);
            minPlayersLab.innerText = minPlayerSlider.value + " min. Players";
        }
        if (maxPlayerSlider) {
            maxPlayers = Number.parseInt(maxPlayerSlider.value);
            maxPlayersLab.innerText = maxPlayerSlider.value + " max. Players";
        }

        if (minTimeLeftSlider) {
            minTimeLeft = Number.parseInt(minTimeLeftSlider.value);
            minTimeLeftLab.innerText = minTimeLeftSlider.value + " min. Time Left";
        }
    }

    if (crosshair && permCrosshair) crosshair.style = "visibility: visible !important; opacity: 1 !important; display: block !important;"

    try {

        let weap = document.getElementsByClassName('list-weapons')[0].children[0].children[0].innerText;
        let num = 4;

        if (weap === "Weatie" || weap === "MAC-10") num = 5;

        if (weap === "AR-9") num = 3;

        let arms = true;
        if ((scoped && hideWeaponsAds) || hideArms) {
            arms = false;
        }

        const weaponModel = scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["35"]["weapons"][weap]["model"];
        const armsMaterial = weaponModel["parent"]["children"]["0"]["material"];
        const weaponMaterial = weaponModel["children"][num]["material"];

        armsMaterial.visible = arms;

        if (hideWeaponsAds) weaponMaterial.visible = !scoped;

        if (inspecting) {
            if (!prevInsp) {
                prevInspectPos = weaponModel.position.clone();
                prevInspectRot = weaponModel.rotation.clone();
                if (weaponModel) inspectedWeapon = weaponModel;
            }
            weaponModel.rotation.x = 0;
            weaponModel.rotation.y = -0.3;
            weaponModel.rotation.z = -0.4;

            weaponModel.position.y = 0.05;
            weaponModel.position.z = -0.08;
        } else {
            if (prevInsp) {
                inspectedWeapon.rotation.x = prevInspectRot.x;
                inspectedWeapon.rotation.y = prevInspectRot.y;
                inspectedWeapon.rotation.z = prevInspectRot.z;

                inspectedWeapon.position.y = prevInspectPos.y;
                inspectedWeapon.position.z = prevInspectPos.z;
            }
        }

        prevInsp = inspecting;

        if (wireframeArms) {
            armsMaterial.wireframe = true;
            armsMaterial.color.r = r / 255;
            armsMaterial.color.g = g / 255;
            armsMaterial.color.b = b / 255;
            armsMaterial.emissive.r = r / 255;
            armsMaterial.emissive.g = g / 255;
            armsMaterial.emissive.b = b / 255;
        } else if (prevWireframeArms) {
            armsMaterial.wireframe = false;
            armsMaterial.color.r = 1;
            armsMaterial.color.g = 1;
            armsMaterial.color.b = 1;
            armsMaterial.emissive.r = 0;
            armsMaterial.emissive.g = 0;
            armsMaterial.emissive.b = 0;
        }

        if (wireframeWeapons) {
            weaponMaterial.wireframe = true;
            weaponMaterial.color.r = r / 255;
            weaponMaterial.color.g = g / 255;
            weaponMaterial.color.b = b / 255;
            weaponMaterial.emissive.r = r / 255;
            weaponMaterial.emissive.g = g / 255;
            weaponMaterial.emissive.b = b / 255;
        } else if (prevWireframeWeapons) {
            weaponMaterial.wireframe = false;
            weaponMaterial.color.r = 1;
            weaponMaterial.color.g = 1;
            weaponMaterial.color.b = 1;
            weaponMaterial.emissive.r = 0;
            weaponMaterial.emissive.g = 0;
            weaponMaterial.emissive.b = 0;
        }

        prevWireframeWeapons = wireframeWeapons;
        prevWireframeArms = wireframeArms;

    } catch {
    }
    try {
        for (let i = 0; i < scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["2"]["_queries"]["animationEntities"]["entities"].length; i++) {

            let localPlayerClass = scene["children"]["0"]["parent"]["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["0"]["_queries"]["player"]["entities"]["0"]["_components"]["38"].wnWmN;
            let player = scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["2"]["_queries"]["animationEntities"]["entities"][i]["_components"];
            let mat = scene["entity"]["_entityManager"]["mWnwM"]["systemManager"]["_systems"]["2"]["_queries"]["animationEntities"]["entities"][i]["_components"][0].value.children[0].children[0].children[1].material;

            if ((mat.color.r === 1 && mat.color.g < 1 && mat.color.b < 1) || !playerHighLight) continue;

            //let color = hexToRgb("#0000ff");
            if (!localPlayerClass.team || localPlayerClass.team !== player["50"].team) {
                color = hexToRgb("#ff0000");
                if (fullBlack) color = hexToRgb('#000000')
                
                let r = color.r * Number.MAX_SAFE_INTEGER;
                let g = color.g * Number.MAX_SAFE_INTEGER;
                let b = color.b * Number.MAX_SAFE_INTEGER;

                mat.map = null;
                mat.color.r = r;
                mat.color.g = g;
                mat.color.b = b;

                mat.needsUpdate = true;
            }

        }
    } catch {
    }

}

animate();


XMLHttpRequest = class extends XMLHttpRequest {

    open(method, url) {
        if (url === "https://api.kirka.io/api/inventory") this.invReq = true;
        return super.open(...arguments);
    }

    get responseText() {
        if (this.invReq) {
            this.invReq = false;
            let entries = JSON.parse(this.responseText);
            let sortedItems = {legendary: [], epic: [], rare: [], common: []};

            for (let entry of entries) {
                sortedItems[entry.item.rarity.toLowerCase()].push(entry);
            }

            let editEntries = [];
            for (let rarity in sortedItems) {
                editEntries = [].concat(editEntries, sortedItems[rarity]);
            }

            return JSON.stringify(editEntries);
        }

        return super.responseText;
    }
}


function minutesLeft(e) {
    return Math.ceil((480 - (Date.now() - Date.parse(e)) / 1000));
}

document.onkeydown = event => {
    if (event.key === "F7" && autoJoin) {
        responseCount = 0;
        allLobbyData = [];

        fetch('https://eu1.kirka.io/matchmake')
            .then(response => response.json())
            .then(dataEU => {

                for (let i = 0; i < dataEU.length; i++) {
                    dataEU[i].region = "EU";
                }
                if (euLobbies) {
                    for (let i = 0; i < dataEU.length; i++) {
                        allLobbyData.push(dataEU[i]);
                    }
                }
                responseCount++;
                checkSearchLobby();
            });
        fetch('https://na1.kirka.io/matchmake')
            .then(response => response.json())
            .then(dataNA => {

                for (let i = 0; i < dataNA.length; i++) {
                    dataNA[i].region = "NA";
                }
                if (naLobbies) {
                    for (let i = 0; i < dataNA.length; i++) {
                        allLobbyData.push(dataNA[i]);
                    }
                }
                responseCount++;
                checkSearchLobby();
            });
        fetch('https://asia1.kirka.io/matchmake')
            .then(response => response.json())
            .then(dataASIA => {

                for (let i = 0; i < dataASIA.length; i++) {
                    dataASIA[i].region = "ASIA";
                }
                if (asiaLobbies) {
                    for (let i = 0; i < dataASIA.length; i++) {
                        allLobbyData.push(dataASIA[i]);
                    }
                }
                responseCount++;
                checkSearchLobby();
            });
    }
}

function checkSearchLobby() {
    if (responseCount < 3) return;

    console.log(allLobbyData);

    if (parkourLobbies) {
        gameModes.push('ParkourRoom');
    }
    if (ffaLobbies) {
        gameModes.push('DeathmatchRoom');
    }
    if (tdmLobbies) {
        gameModes.push('TeamDeathmatchRoom');
    }

    let fittingLobbies = [];
    for (let i = 0; i < allLobbyData.length; i++) {
        if (allLobbyData[i].locked === false && allLobbyData[i].clients >= minPlayers && allLobbyData[i].clients <= maxPlayers && gameModes.includes(allLobbyData[i].name) && minutesLeft(allLobbyData[i].createdAt) >= minTimeLeft && (maps.includes(allLobbyData[i].metadata.mapName.toLowerCase()) || !filterMaps)) {
            if (avoidSameLobby) {
                if (!currentURL.includes(allLobbyData[i].roomId)) {
                    fittingLobbies.push(allLobbyData[i]);
                }
            } else {
                fittingLobbies.push(allLobbyData[i]);
            }
        }
    }

    if (fittingLobbies.length !== 0) {
        bestLobby = fittingLobbies[0];
        if (fittingLobbies.length > 0) {
            for (let i = 0; i < fittingLobbies.length; i++) {
                if (bestLobby.clients < fittingLobbies[i].clients) {
                    bestLobby = fittingLobbies[i];
                } else if (bestLobby.clients === fittingLobbies[i].clients) {
                    if (minutesLeft(bestLobby.createdAt) < minutesLeft(fittingLobbies[i].createdAt)) {
                        bestLobby = fittingLobbies[i];
                    }
                }
            }
        }
    } else if (preferredFilter === 'Time') {
        bestLobby = fittingLobbies[0];
        if (fittingLobbies.length > 0) {
            for (let i = 0; i < fittingLobbies.length; i++) {
                if (minutesLeft(bestLobby.createdAt) < minutesLeft(fittingLobbies[i].createdAt)) {
                    bestLobby = fittingLobbies[i];
                }
            }
        }
    }
    if (fittingLobbies.length !== 0 && bestLobby !== '') {
        let joinURL = 'https://kirka.io/games/' + bestLobby.region + '~' + bestLobby.roomId;
        window.open(joinURL);
    } else alert('No Lobby found - consider changing your settings'); //popup ohne alert?
}


function toggleGui() {
    menuVisible = !menuVisible;
    if (menuVisible) {
        document.exitPointerLock();
        gui.style.display = 'inline-block';
    } else {
        gui.style.display = 'none';
    }
    settings.set('menuOpen', menuVisible);
}

function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

let oldDefine = Object.defineProperty;
Object.defineProperty = (...args) => {
    if (args[0] && args[1] && args[1] === 'renderer' && args[0].constructor.name.startsWith('_0x')) {
        if (args[0].WnNMwm) {
            Object.defineProperty(args[0].camera, "fov", {
                get() {
                    return adspower ? args[0].WnNMwm.fov : this.vFov;
                },
                set(v) {
                    this.vFov = v;
                }
            });
        }
    }
    return oldDefine(...args);
}

const proxy = Function.prototype.constructor;
Function.prototype.constructor = function (...args) {
    if (args[0] === 'while (true) {}' || args[0] === 'debugger') return proxy.apply(this);
    return proxy.apply(this, arguments);
}
