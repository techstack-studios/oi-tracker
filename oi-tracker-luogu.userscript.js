// ==UserScript==
// @name         luogu Timer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.luogu.com.cn/problem/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// ==/UserScript==

window.addEventListener('load', function() {
    let styleSheet = `
.Button {
    background-color: #e7e7e7;
    border: none;
    color: black;
    padding: 8px 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 3px;
    transition-duration: 0.4s;
    margin-right: 5px;
    margin-top: 10px;
}

.Button:hover {
  background-color: rgb(52, 152, 219); /* Green */
  color: white;
}

.ButtonGroup {
    margin: auto;
    margin-bottom: 30px;
    width: 90%;
}

.displayTxt {
    margin-top: 0px;
    margin-bottom: 10px;
    display: block;
}

.Time {
    float: right;
}
`;

    let s = document.createElement('style');
    s.type = "text/css";
    s.innerHTML = styleSheet;
    (document.head || document.documentElement).appendChild(s);




    function insertAfter(newNode, referenceNode, parentNode) {
        console.log(referenceNode);
        if(referenceNode == null) {
            parentNode.insertBefore(newNode, referenceNode);
        }
        else {
            parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }

    }


    // Button

    function Button(name, target) {
        this.btn = document.createElement("button");
        this.btn.innerHTML = name;
        this.name = name;
        this.btn.className = "Button";
        console.log(target);
        insertAfter(this.btn, target.lastChild, target);
    };


    // TimeDisplay

    function TimeDisplay(item, target) {
        this.name = item;
        this.txt = document.createElement("div");
        this.txt.className = "displayTxt";
        this.itemTxt = document.createElement("text");
        this.itemTxt.innerHTML = item + ": ";
        this.itemTxt.className = "Item";
        this.timeTxt = document.createElement("text");
        this.timeTxt.className = "Time";
        this.timeTxt.innerHTML = "N/A";
        console.log(target.lastChild.parentNode);
        this.txt.insertBefore(this.timeTxt, this.txt.lastChild);
        this.txt.insertBefore(this.itemTxt, this.txt.lastChild);
        insertAfter(this.txt, target.lastChild, target);
    };

    TimeDisplay.prototype.logTime = function () {
        console.log(this);
        const d = new Date();
        let timeString = d.toLocaleString();
        this.timeTxt.innerHTML = timeString;

    };

    TimeDisplay.prototype.clearTime = function () {
        this.timeTxt.innerHTML = "N/A";
    };


    // Manager

    function Manager(target) {

        this.startDisplay = new TimeDisplay("start", target);
        this.thinkDisplay = new TimeDisplay("think", target);
        this.codeDisplay = new TimeDisplay("code", target);
        this.debugDisplay = new TimeDisplay("debug", target);

        this.buttonGroup = document.createElement("div");
        this.buttonGroup.className = "ButtonGroup";

        console.log(this.buttonGroup);
        insertAfter(this.buttonGroup, target, target.parentNode);

        this.startButton = new Button("start", this.buttonGroup);
        this.thinkButton = new Button("think", this.buttonGroup);
        this.codeButton = new Button("code", this.buttonGroup);
        this.debugButton = new Button("debug", this.buttonGroup);
        this.clearButton = new Button("clear", this.buttonGroup);



        this.startButton.btn.addEventListener("click", this.startDisplay.logTime.bind(this.startDisplay));
        this.thinkButton.btn.addEventListener("click", this.thinkDisplay.logTime.bind(this.thinkDisplay));
        this.codeButton.btn.addEventListener("click", this.codeDisplay.logTime.bind(this.codeDisplay));
        this.debugButton.btn.addEventListener("click", this.debugDisplay.logTime.bind(this.debugDisplay));

        this.clearButton.btn.addEventListener("click", this.startDisplay.clearTime.bind(this.startDisplay));
        this.clearButton.btn.addEventListener("click", this.thinkDisplay.clearTime.bind(this.thinkDisplay));
        this.clearButton.btn.addEventListener("click", this.codeDisplay.clearTime.bind(this.codeDisplay));
        this.clearButton.btn.addEventListener("click", this.debugDisplay.clearTime.bind(this.debugDisplay));

    }

    var targetTag = document.getElementsByClassName("info-rows")[0];
    console.log(targetTag);

    var main = new Manager(targetTag);
});
