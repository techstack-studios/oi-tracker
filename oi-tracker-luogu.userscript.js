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

.Text {
    margin-top: 0px;
    margin-bottom: 10px;
    display: block;
}
`;

let s = document.createElement('style');
s.type = "text/css";
s.innerHTML = styleSheet;
(document.head || document.documentElement).appendChild(s);




function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function button(name) {
    this.btn = document.createElement("button");
    this.btn.innerHTML = name;
    this.name = name;
    this.btn.className = "Button";
    insertAfter(this.btn, targetTag.lastChild);

    this.btn.onclick = () => {
        updateTimer(this.name);
        console.log("test");
    }
};


function updateTimer(name) {
    const d = new Date();
    let text = d.toLocaleString();
    if (name == "start") {
        startTime.innerHTML = "start: " + text;
    }
    if (name == "think") {
        thinkTime.innerHTML = "thinking done: " + text;
    }
    if (name == "code") {
        codeTime.innerHTML = "coding done: " + text;
    }
    if (name == "debug") {
        debugTime.innerHTML = "debugging done: " + text;
    }
    if (name == "clear") {
        startTime.innerHTML = "start: ";
        thinkTime.innerHTML = "thinking done: ";
        codeTime.innerHTML = "coding done: ";
        debugTime.innerHTML = "debugging done: ";
    }
}


var targetTag = document.getElementsByClassName("info-rows")[0];
console.log(targetTag);




var startTime = document.createElement("text");
startTime.className = "Text";
startTime.innerHTML = "start: ";

var thinkTime = document.createElement("text");
thinkTime.className = "Text";
thinkTime.innerHTML = "thinking done: ";

var codeTime = document.createElement("text");
codeTime.className = "Text";
codeTime.innerHTML = "coding done: ";

var debugTime = document.createElement("text");
debugTime.className = "Text";
debugTime.innerHTML = "debugging done: ";


insertAfter(startTime, targetTag.lastChild);

insertAfter(thinkTime, targetTag.lastChild);

insertAfter(codeTime, targetTag.lastChild);

insertAfter(debugTime, targetTag.lastChild);

let startButton = new button("start");
let thinkButton = new button("think");
let codeButton = new button("code");
let debugButton = new button("debug");
let clearButton = new button("clear");










});
