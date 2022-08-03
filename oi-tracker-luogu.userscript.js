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
.Tracker {
    background-color: #e7e7e7;
    border: none;
    color: black;
    padding: 8px 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 3px;
    margin: auto;
    transition-duration: 0.4s;
    margin-right: 5px;
    margin-left: 5px;
    margin-top: 10px;
}

.Tracker : hover {
  background-color: rgb(52, 152, 219);
  color: white;
}

.Title {
    font-size: 18px;
    display: inline-block;
    margin-bottom: ;
}

.Export {
    background-color: rgb(52, 152, 219);
    color: white;
    border: none;
    float: right;
    display: inline-block;
    font-size: 14px;
    border-radius: 3px;
    padding: 1px, 3px;
    margin-bottom: 10px;
}

.ButtonGroup {
    margin: auto;
    width: 100%;
}

.DisplayTxt {
    margin-top: 0px;
    margin-bottom: 10px;
    display: block;
}

.Item {
    margin-left: 20px;
}

.Time {
    float: right;
}

.padding-default {
    margin-bottom: 20.8px;
    padding: 20.8px;
}

.info-rows {

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


// button

var Button = function(name, type, target) {
    this.btn = document.createElement("button");
    this.btn.innerHTML = name;
    this.name = name;
    this.btn.className = type + " Button";
    console.log(target);
    insertAfter(this.btn, target.lastChild, target);
};


// timeDisplay

var TimeDisplay = function(item, target) {
    this.time = new Date();
    this.duration = 0;  // minutes
    this.txt = document.createElement("div");
    this.txt.className = "DisplayTxt";
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
    const d = new Date();
    this.duration = ((d - this.time) / (1000 * 60));

    this.time = d;
    let timeString = d.toLocaleString();
    this.timeTxt.innerHTML = timeString;

};

TimeDisplay.prototype.clearTime = function () {
    this.timeTxt.innerHTML = "N/A";
};

TimeDisplay.prototype.getTime = function() {
    return this.timeTxt.innerHTML;
}

TimeDisplay.prototype.getDuration = function() {
    return this.duration;
}

// managerObject

var Manager = function(target) {

    this.box = document.createElement("div");
    this.box.className = "card padding-default";
    insertAfter(this.box, target, target.parentNode);

    this.infoBox = document.createElement("div");
    this.infoBox.className = "info-rows";
    insertAfter(this.infoBox, this.box.lastChild, this.box);

    this.Title = document.createElement("h3");
    this.Title.innerHTML = "Time usage: ";
    this.Title.className = "Title";
    insertAfter(this.Title, this.infoBox.lastChild, this.infoBox);
    this.exportButton = new Button("export", "Export", this.infoBox);
    this.startDisplay = new TimeDisplay("start", this.infoBox);
    this.thinkDisplay = new TimeDisplay("think", this.infoBox);
    this.codeDisplay = new TimeDisplay("code", this.infoBox);
    this.debugDisplay = new TimeDisplay("debug", this.infoBox);

    this.buttonGroup = document.createElement("div");
    this.buttonGroup.className = "ButtonGroup";

    console.log(this.buttonGroup);
    insertAfter(this.buttonGroup, this.infoBox.lastChild, this.infoBox);

    this.startButton = new Button("start", "Tracker", this.buttonGroup);
    this.thinkButton = new Button("think", "Tracker", this.buttonGroup);
    this.codeButton = new Button("code", "Tracker", this.buttonGroup);
    this.debugButton = new Button("debug", "Tracker", this.buttonGroup);
    this.clearButton = new Button("clear", "Tracker", this.buttonGroup);


    //createjson
    this.timeJson = null;

    console.log(this.timeJson);

    this.startButton.btn.addEventListener("click", this.startDisplay.logTime.bind(this.startDisplay));
    this.thinkButton.btn.addEventListener("click", this.thinkDisplay.logTime.bind(this.thinkDisplay));
    this.codeButton.btn.addEventListener("click", this.codeDisplay.logTime.bind(this.codeDisplay));
    this.debugButton.btn.addEventListener("click", this.debugDisplay.logTime.bind(this.debugDisplay));

    this.clearButton.btn.addEventListener("click", this.startDisplay.clearTime.bind(this.startDisplay));
    this.clearButton.btn.addEventListener("click", this.thinkDisplay.clearTime.bind(this.thinkDisplay));
    this.clearButton.btn.addEventListener("click", this.codeDisplay.clearTime.bind(this.codeDisplay));
    this.clearButton.btn.addEventListener("click", this.debugDisplay.clearTime.bind(this.debugDisplay));

    this.exportButton.btn.addEventListener("click", this.exportJson.bind(this));
}

Manager.prototype.exportJson = function() {
    this.timeJson = {
        startTime: this.startDisplay.getTime(),
        thinkTime: this.thinkDisplay.getTime(),
        codeTime: this.codeDisplay.getTime(),
        debugTime: this.debugDisplay.getTime(),

        startDuration: this.startDisplay.getDuration(),
        thinkDuration: this.thinkDisplay.getDuration() - this.startDisplay.getDuration(),
        codeDuration: this.codeDisplay.getDuration() - this.thinkDisplay.getDuration(),
        debugDuration: this.debugDisplay.getDuration() - this.codeDisplay.getDuration()
    };
    console.log(this.timeJson);
    navigator.clipboard.writeText(JSON.stringify(this.timeJson));
}


var targetTag = document.getElementsByClassName("side")[0].firstChild;
console.log(targetTag);




var main = new Manager(targetTag);
});
