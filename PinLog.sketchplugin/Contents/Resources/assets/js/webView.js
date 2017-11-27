// Disable the context menu
document.addEventListener("contextmenu", function(e) {
  e.preventDefault();
});

const states = {
  showPin: "pin",
  showNumber: "number",
};
var ul = document.querySelector("#list");
var editPin = null;
//方法
function pressDelete(id){
  var data = {
    "type": "deletePin",
    "index": id,
    "date": new Date().getTime()
  };
  window.location.hash = encodeURIComponent(JSON.stringify(data));
}

function pressEdit(id,info) {
  var data = {
    "type": "editPin",
    "index": id,
    "info": info,
    "date": new Date().getTime()
  };
  window.location.hash = encodeURIComponent(JSON.stringify(data));
}


function liAddListener(li) {
    li.addEventListener("click", function (e) {
      if (e.target.className != "edit" && e.target.className != "delete") {
        var state = li.getAttribute("data-state");
        if (state == states.showNumber) {
          [].forEach.call(document.querySelectorAll(".pin"), function (pin) {
            pin.className = "index";
            pin.parentNode.dataset.state = states.showNumber;
          });
          li.childNodes[1].className = "pin";
          li.dataset.state = states.showPin;
        }
      } else if (e.target.className == "edit") {
        var id = e.target.getAttribute("data-index");
        var info = e.target.getAttribute("data-info");
        editPin = li;
        pressEdit(id, info);
      } else if (e.target.className == "delete") {
        var id = e.target.getAttribute("data-index");
        pressDelete(id);
        li.className = "hideLi";
        li.addEventListener("animationend", function () { 
          li.remove();
          [].forEach.call(document.querySelectorAll(".cell"), function (li, id) {
            li.childNodes[1].innerHTML = `${id + 1}.`;
            li.childNodes[2].childNodes[0].dataset.index = `${id}`;
            li.childNodes[2].childNodes[1].dataset.index = `${id}`;
          });
        });
      }
    });
}

function bottomAddListener() {
  var addPin = document.querySelector("#left-btn");
  addPin.addEventListener("click", function (e) {
    var data = {
      "type": "addPin",
      "date": new Date().getTime()
    };
    window.location.hash = encodeURIComponent(JSON.stringify(data));
  });

  var clearAll = document.querySelector("#right-btn");
  clearAll.addEventListener("click", function (e) {
    var data = {
      "type": "clearAll",
      "date": new Date().getTime()
    };
    window.location.hash = encodeURIComponent(JSON.stringify(data));
    [].forEach.call(document.querySelectorAll(".cell"), function (li, id) {
      li.className = "hideLi";
      li.addEventListener("animationend", function () {
        ul.innerHTML = "";
      });
    });
  });
}

function addPin(position,id) {
  var li = document.createElement("li");
  li.className = "cell";
  li.dataset.position = JSON.stringify(position);
  li.dataset.state = states.showNumber;
  var span = document.createElement("span");
  var div = document.createElement("div");
  var tool = document.createElement("div");

  var editBtn = document.createElement("button");
  editBtn.dataset.index = `${id}`;
  editBtn.dataset.info = position.info;

  var deleteBtn = document.createElement("button");
  deleteBtn.dataset.index = `${id}`;

  tool.className = "tool";
  editBtn.className = "edit";
  deleteBtn.className = "delete";
  div.className = "index";

  editBtn.innerHTML = "Edit";
  deleteBtn.innerHTML = "Delete";
  div.innerHTML = `${id + 1}.`;
  span.innerHTML = position.info;

  li.addEventListener("click", function (e) {
    if (e.target.className != "edit" && e.target.className != "delete") {
      var data = {
        "type": "goPosition",
        "position": position,
        "date": new Date().getTime()
      };
      window.location.hash = encodeURIComponent(JSON.stringify(data));
    }
  });
  li.appendChild(span);
  li.appendChild(div);
  li.appendChild(tool);
  tool.appendChild(deleteBtn);
  tool.appendChild(editBtn);
  liAddListener(li);
  ul.appendChild(li);
}

//addPin from Bottom
function addLastPin(positionString){
  var positions = JSON.parse(positionString);
  var id = positions.length - 1;
  var position = positions[id];
  addPin(position, id);
  ul.scrollTop = ul.scrollHeight;
}

//editPin f
function updateEditPin(positionInfo) {
  var info = JSON.parse(positionInfo);
  // [].forEach.call(document.querySelectorAll(".cell"), function (li, id) {
  //   li.innerHTML = "positionInfo";
  // });
  editPin.childNodes[0].innerHTML = info.info;
  editPin.childNodes[2].childNodes[1].dataset.info = info.info;
}

function updatePreview(positionString) {
  bottomAddListener();
  var positions = JSON.parse(positionString);
  positions.forEach((position,id) => {
    addPin(position, id);
  });
}





