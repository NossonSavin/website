(function () {
    'use strict';

    let socket;
    const pageTabs = ['Day', 'Night', 'Messages', 'Wifi', 'Settings'];
    const animationBtns = ['Fill', 'Wipe', 'Push', 'Trail', 'RGB', 'Dual', 'Random', 'Fire'];
    const toggleBtns = ['Back and Forth', 'Revers', 'Vertical'];
    const colorTabs = ['Color 1', 'Color 2', 'Color 3', 'Color 4', 'Color 5'];
    const colorPickerKeyName = ['First Color', 'Second Color'];
    const colorPickElem = [getElem('#redNum'), getElem('#redRange'), getElem('#greenNum'), getElem('#greenRange'), getElem('#blueNum'), getElem('#blueRange'),];
    const colorPickerElem = getElem('#colorPicker');
    const blackOut = getElem('.blackOut');
    const loading = getElem('#loading');
    const wifiPwd = getElem('#wifiPwd');
    const debugDisplay = getElem('#debugDisplay');
    let colorPickerValTexts;
    let espData;
    let activeClass = [];
    let toggleBtnElem = [];
    let activeBlackOutIndex;
    let pages = document.querySelectorAll('.page');

    //----- EVENT Handlers ---------------------------------------------------------------  
    getElem('body').addEventListener('click', e => {
        const elem = e.target;
        const theClass = elem.classList;
        const data = getData(elem);
        const activeAnimationPage = getData(activeClass[0]);

        switch (theClass[0]) {
            case 'button':
                switch (theClass[1]) {
                    case 'debugPrint':
                        if (socket) {
                            elem.innerText = "Start";
                            activeOff(elem)
                            socket.close();
                            socket = null;
                        } else {
                            elem.innerText = "Stop";
                            activeOn(elem);
                            socket = new WebSocket(`ws://${window.location.hostname}/data`);
                            socket.onmessage = e => {
                                debugDisplay.innerText += e.data + "\n";
                            };
                        }
                        break;

                    case 'toggle':
                        if (elem.classList.contains('myActive')) {
                            activeOff(elem);
                            sendData(elem.innerText, activeAnimationPage, 0);
                        } else {
                            activeOn(elem);
                            sendData(elem.innerText, activeAnimationPage, 1);
                        }
                        break;

                    case 'animation':
                        setActiveClass(elem);
                        sendData(theClass[1], activeAnimationPage, data);
                        break;

                    default:
                        sendData(theClass[1], data);
                        break;
                }
                break;

            case 'myColor':
                activeBlackOutIndex = data
                blackOut.style.display = 'grid';
                break;

            case 'colorMsg':
                blackOut.style.display = 'none';
                setColorPickerText(colorPickerValTexts[activeBlackOutIndex], data);
                sendData('colorPicker' + activeAnimationPage, +activeBlackOutIndex, data);
                break;

            case 'blackOut':
                blackOut.style.display = 'none';
                break;

            case 'nav':
                setActiveClass(elem);

                pages.forEach(e => {
                    e.style.display = 'none';
                });

                pages[data > 0 ? data - 1 : data].style.display = 'block'
                refreshPageData(getData(activeClass[0]));
                break;

            case 'colorTabs':
                setActiveClass(elem);
                setColors(data);
                break;

            case 'scanWifi':
                scanNetworks();
                break;

            case 'wifiList':
                wifiPwd.style.display = 'flex';
                elem.appendChild(wifiPwd);
                break;

            case 'saveWifi':
                e.preventDefault();
                const ssid = elem.parentNode.previousSibling.textContent.trim();
                const password = elem.previousElementSibling.value;
                sendData("wifi", ssid, password);
                break;

            default:
                break;
        }

    });

    getElem('body').addEventListener('change', e => {
        const elem = e.target;
        const data = getData(elem);
        const theClass = elem.className;
        const activeAnimationPage = getData(activeClass[0]);

        if (theClass === 'animationTimes') {
            const value = elem.id === 'animationDelay' ? elem.value * 1000 : elem.value;
            sendData(elem.id, activeAnimationPage, value)
        }

        else if (theClass === 'colorPick') {
            const index = getData(activeClass[2]);
            let RGB = 0;
            let val = elem.value;
            val = val > 255 ? 255 : val;
            val = val < 0 ? 0 : val;
            val = Math.trunc(val);

            colorPickElem[data].value = val;
            elem.value = val;

            RGB += colorPickElem[0].value * 65536;
            RGB += colorPickElem[2].value * 256;
            RGB += colorPickElem[4].value * 1;

            espData.colors[index] = RGB;
            sendData('setColor', index, RGB);
        }
    });

    // ------- Div Creating --------------------------------------------------------
    createDiv(getElem('nav'), 'nav', pageTabs, null, 0)
    createDiv(getElem('#animationBtns'), 'button animation', animationBtns, null, 1)
    createDiv(getElem('#colorTabs'), 'colorTabs', colorTabs, null, 2)
    createDiv(getElem('#colorMsgBox'), 'colorMsg', colorTabs)
    createDiv(getElem('#toggleBtn'), 'button toggle', toggleBtns, toggleBtnElem)

    colorPickerKeyName.forEach((e, index) => {
        colorPickerElem.innerHTML += `
        <div class="myColor colorPicker" data-elemData="${index}">
        <div class="myColor key" data-elemData="${index}">${e}:</div>
        <div class="myColor val" data-elemData="${index}"></div>
        </div>`;
    });

    // ---- Functions -----------------------------------------------------------
    function createDiv(elem, className, array, saveArray, activeIndex) {
        array.forEach((name, index) => {
            const template = document.createElement('template');
            template.innerHTML = `
            <div ${className ? `class="${className}"` : ""} data-elemData="${index}" ${activeIndex !== undefined ? `data-activeIndex="${activeIndex}"` : ""}>
            ${name}
            </div>`;

            if (saveArray) {
                saveArray.push(template.content.firstElementChild)
            }
            elem.appendChild(template.content.firstElementChild)
        });
    }

    function getData(elem) {
        return elem.getAttribute("data-elemData");
    }

    async function scanNetworks() {
        wifiList.innerHTML = "";
        scanWifi.style.display = 'none';
        const msgIntervalID = msgInterval(loadMsg);
        wifiMsgBox.style.display = 'block';
        let data;

        while (!data) {
            try {
                const response = await fetch("http://192.168.1.14/wifiNetworks");
                if (response.status === 204) {
                    console.log(response.status, "retrying");
                    continue;
                }
                data = await response.json()

                createDiv(wifiList, 'wifiList', data.networks)

            } catch {
                console.log('Search Failed');
                break;
            }
        }
        scanWifi.style.display = 'block';
        clearInterval(msgIntervalID);
        wifiMsgBox.style.display = 'none';
    }

    function getActiveIndex(elem) {
        return elem.getAttribute("data-activeIndex");
    }

    function getElem(name) {
        return document.querySelector(name);
    }

    function sendData(name, data1, data2) {
        fetch(`http://192.168.1.14/updateData?output=${name}&state=${data1}${data2 !== undefined ? `&state2=${data2}` : ''}`);
    }

    function getState() {
        // fetch('http://192.168.1.14/getState')
            // .then(e => e.json())
            // .then(e => {
                espData = {"animationNum":[1,0],"colors":[2565,65536,3080225,657928,5575947],"animationSpeed":[30,500],"animationDelay":[2000,2000],"colorPicker0":[0,1],"colorPicker1":[1,4],"toggle":[[0,0],[0,0],[1,1]]};
                refreshPageData(0);
                setColors(0);
                loading.style.display = 'none';
                blackOut.style.display = 'none';
                colorMsgBox.style.display = 'flex';
            // });
    }

    function setColorPickerText(item, num) {
        item.innerText = colorTabs[num];
    }

    function setColors(index) {
        const color = espData.colors[index];
        const r = Math.floor(color / 65536);
        const g = Math.floor(color / 256 % 256);
        const b = Math.floor(color % 256);

        colorPickElem[0].value = r;
        colorPickElem[1].value = r;
        colorPickElem[2].value = g;
        colorPickElem[3].value = g;
        colorPickElem[4].value = b;
        colorPickElem[5].value = b;
    }

    function refreshPageData(num) {
        toggleBtnElem.forEach((item, index) => {
            if (espData.toggle[index][num]) {
                item.classList.add('myActive');
            }
        });

        setActiveClass(getElem('#animationBtns').children[espData.animationNum[num]]);
        getElem('#animationSpeed').value = espData.animationSpeed[num];
        getElem('#animationDelay').value = espData.animationDelay[num] / 1000;

        colorPickerValTexts.forEach((item, index) => {
            setColorPickerText(item, num === 0 ? espData.colorPicker0[index] : espData.colorPicker1[index]);
        })
    }

    function setActiveClass(elem) {
        const index = getActiveIndex(elem);

        if (activeClass[index]) {
            activeClass[index].classList.remove('myActive');
        }
        activeClass[index] = elem;
        activeClass[index].classList.add('myActive');
    }

    function activeOn(elem) {
        elem.classList.add('myActive');
    }

    function activeOff(elem) {
        elem.classList.remove('myActive');
    }

    colorPickerValTexts = document.querySelectorAll('.val');
    setActiveClass(getElem('nav').children[0]);
    setActiveClass(getElem('#colorTabs').firstElementChild);
    getState();

    //----Wifi Page------------------------------------------------------------------------

    const wifiList = getElem('#wifiList');
    const wifiMsgBox = getElem('.wifiMsgBox');
    const scanWifi = getElem('#scanWifi');
    let animationCounter = 0;
    const loadMsg = "Scanning Networs";

    function msgInterval(msg) {
        return setInterval(() => {
            wifiMsgBox.innerText = (msg + animationDots());
        }, 500);
    }

    function animationDots() {
        let dots = "\n.";
        for (let i = 0; i < animationCounter % 14; i++) {
            dots += ".";
        }
        animationCounter += 2;
        return dots;
    }

})();