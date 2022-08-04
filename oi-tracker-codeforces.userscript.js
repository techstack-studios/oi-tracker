// ==UserScript==
// @name         oi-tracker-codeforces
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  for oiers, by oiers;
// @author       shap
// @match        https://codeforces.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codeforces.com
// @grant        none
// ==/UserScript==

window.addEventListener('load', function() {
    let styleSheet = `
.Tracker {
    margin-right: 2.8px;
    margin-left: 2.8px;
}

.Tracker:hover {
    background-color: light gray;
}

.Title {
    font-size: 18px;
    display: inline-block;
    margin: 0px 0px 10px;
}

.Export {
    background-color: rgb(52, 152, 219);
    color: white;
    border: none;
    float: right;
    float: top;
    display: inline-block;
    font-size: 14px;
    border-radius: 3px;
    padding: 1px, 3px;
    margin-top: 1px;
    margin-bottom: 10px;
    margin-right: 10px;

}

Button:hover {
    cursor: pointer;
}


.Export:hover {
    opacity: 85%;
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
    margin-left: 0px;
}

.Time {
    float: right;
}

.padding-default {
    margin-bottom: 20.8px;
    padding: 20.8px;
}

.info-rows {
    margin: 10px;
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
        this.name = name;
        this.btn.className = type + " Button";
        this.span = document.createElement("span");
        this.span.innerHTML = name;
        insertAfter(this.span, this.btn.lastChild, this.btn);
        console.log(target);
        insertAfter(this.btn, target.lastChild, target);
    };


    // timeDisplay

    var TimeDisplay = function(item, target) {
        this.time = new Date();
        this.duration = 0; // minutes
        this.txt = document.createElement("div");
        this.txt.className = "DisplayTxt";
        this.itemTxt = document.createElement("text");
        this.itemTxt.innerHTML = item + ": ";
        this.itemTxt.className = "Item";
        this.timeTxt = document.createElement("text");
        this.timeTxt.className = "Time";
        this.timeTxt.innerHTML = "N/A";
        //console.log(target.lastChild.parentNode);
        //this.txt.insertBefore(this.timeTxt, this.txt.lastChild);
        //this.txt.insertBefore(this.itemTxt, this.txt.lastChild);
        insertAfter(this.itemTxt, this.txt.lastChild, this.txt);
        insertAfter(this.timeTxt, this.txt.lastChild, this.txt);
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
        this.box.className = "roundbox sidebox";
        insertAfter(this.box, target, target.parentNode);

        this.roundedCornerLeft = document.createElement("div");
        this.roundedCornerLeft.className = "roundbox-lt";
        this.roundedCornerLeft.innerHTML = "&nbsp";
        insertAfter(this.roundedCornerLeft, this.box.lastChild, this.box);


        this.Title = document.createElement("div");
        this.Title.innerHTML = "→ Time usage";
        this.Title.className = "caption titled";
        insertAfter(this.Title, this.box.lastChild, this.box);
        this.exportButton = new Button("export", "Export", this.box.lastChild);

        this.roundedCornerRight = document.createElement("div");
        this.roundedCornerRight.className = "roundbox-rt";
        this.roundedCornerRight.innerHTML = "&nbsp";
        insertAfter(this.roundedCornerRight, this.box.lastChild, this.box);

        this.infoBox = document.createElement("div");
        this.infoBox.className = "info-rows";
        insertAfter(this.infoBox, this.box.lastChild, this.box);



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


    var targetTag = document.getElementById("sidebar").getElementsByClassName("roundbox sidebox")[0];
    console.log(targetTag);

    var main = new Manager(targetTag);
});
