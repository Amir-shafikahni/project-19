let $ = document;

////////////////////////////

// variables /////////////////////////
const body = $.body;
const mainContainer = $.querySelector(".container");
const inputElem = $.querySelector(".form-control");
const inputValidationAlert = $.querySelector(".inputValidationAlert");
const addTodoBtn = $.querySelector(".addTodoBtn");
const clearTodoListBtn = $.querySelector(".clearListBtn");

// fucntions//////////////////////////

function domUpdaterOnLoad() {
  var localStorageTodoInfos = JSON.parse(localStorage.getItem("all todo Texts"));
  
  if (localStorageTodoInfos) {
    localStorageTodoInfos.forEach(function (todoInfo) {
      if (todoInfo.status === "complete") {
        creatTemplate(todoInfo.content, "complete");
      } else {
        creatTemplate(todoInfo.content, "completed");
      }
    });
  }
  const todoStatusBtns = $.querySelectorAll(".status")
  todoStatusBtns.forEach(function(statusBtn){
    if(statusBtn.innerHTML === "completed"){
      statusBtn.previousElementSibling.classList.add("completed")
    }
  })
}
domUpdaterOnLoad();

// to update the minheight of user browser
function liveUserScreenHeightUpdater() {
  let liveScreenHeight = visualViewport.height + "px";
  body.style.minHeight = liveScreenHeight;
}

// to focus on the input bty pressing the Enter Btn on keyboard
function inputFocus(event) {
  if (event.key === "Enter") {
    inputElem.focus();
  }
}

// to validate that if Enter Btn is pressed or not
function keyValidation(event) {
  if (event.key === "Enter") {
    inputValidation();
  }
}

// to validate input value lenght and give access to creat a new todo
function inputValidation(event) {
  if (inputElem.value.length > 2 && inputElem.value.length < 30) {
    addTodo();
  } else {
    inputElem.value = ""
    
    inputValidationAlert.style.display = "block";
    setTimeout(function () {
      inputValidationAlert.style.transform = "translateX(0px)";
      inputValidationAlert.style.opacity = "1";
    }, 1);
    setTimeout(function () {
      inputValidationAlert.style.transform = "translateX(-400px)";
      inputValidationAlert.style.opacity = "0";
    }, 5001);
    setTimeout(function () {
      inputValidationAlert.style.display = "none";
    }, 5700);
  }
}

// to creat a complete template for the new todo
function addTodo() {
  creatTemplate(inputElem.value, "complete");

  localStorageAddTodoAction();

  inputElem.value = "";
}

// to just creat a template for the new todo
function creatTemplate(MainTodoText, status) {
  let todoContainer = $.createElement("div");
  let todoText = $.createElement("div");
  let statusBtn = $.createElement("button");
  let deleteBtn = $.createElement("button");

  todoContainer.className = "todoContainer d-flex shadow mb-4";
  todoText.className = "todoText";
  statusBtn.className = "status btn btn-success me-2";
  deleteBtn.className = "delete btn btn-danger";

  todoText.innerHTML = MainTodoText;
  statusBtn.innerHTML = status;
  deleteBtn.innerHTML = "Delete";

  todoContainer.append(todoText);
  todoContainer.append(statusBtn);
  todoContainer.append(deleteBtn);

  mainContainer.append(todoContainer);

  eventListenerForDeleteBtns();

  eventListenerForTodoStatusBtns();
}

// to get all deleteBtns and add event listener
function eventListenerForDeleteBtns() {
  let todoDeleteBtns = $.querySelectorAll(".delete");
  todoDeleteBtns.forEach(function (todoDeleteBtn) {
    todoDeleteBtn.addEventListener("click", deleteTodo);
  });
}

// the delete action
function deleteTodo(event) {
  event.target.parentElement.remove();

  localStorageDeleteAction(event);
}

// to get all statusBtns and add event listener
function eventListenerForTodoStatusBtns() {
  let todoStatusBtns = $.querySelectorAll(".status");
  todoStatusBtns.forEach(function (todoStatusBtn) {
    todoStatusBtn.addEventListener("click", changeStatus);
  });
}

// the change status action
function changeStatus(event) {
  let todoTextElem = event.target.previousElementSibling;
  let selectedTodotext = event.target.previousElementSibling.innerHTML;
  let localStorageInfo = JSON.parse(localStorage.getItem("all todo Texts"));
  let selectedTodoTextIndex = localStorageInfo.findIndex(function (todoInfo) {
    return todoInfo.content === selectedTodotext;
  });

  if (event.target.innerHTML === "completed") {
    localStorageInfo[selectedTodoTextIndex].status = "complete";
    event.target.innerHTML = "complete";
  } else {
    localStorageInfo[selectedTodoTextIndex].status = "completed";
    event.target.innerHTML = "completed";
  }

  todoTextElem.classList.toggle("completed");

  localStorage.setItem("all todo Texts", JSON.stringify(localStorageInfo));
}

// to add an event listener to "clear todo list" btn and its process
function clearList() {
  let todoContainers = $.querySelectorAll(".todoContainer");
  todoContainers.forEach(function (todoContainer) {
    todoContainer.remove();
  });

  localStorage.clear("all todo Texts");
}

// local storage fucntions //////////////
function localStorageAddTodoAction() {
  let allTodoInfos = [];
  let allTodoElems = $.querySelectorAll(".todoText");
  allTodoElems.forEach(function (todoText) {
    let todoInfo = { content: todoText.innerHTML, status: todoText.nextElementSibling.innerHTML };
    allTodoInfos.push(todoInfo);
  });
  localStorage.setItem("all todo Texts", JSON.stringify(allTodoInfos));
}

function localStorageDeleteAction(event) {
  let deletedTodoText =
    event.target.previousElementSibling.previousElementSibling.innerHTML;
  let localStorageInfo = JSON.parse(localStorage.getItem("all todo Texts"));
  let deletedTodoTextIndex = localStorageInfo.findIndex(function (todoInfo) {
    return todoInfo.content === deletedTodoText;
  });

  localStorageInfo.splice(deletedTodoTextIndex, 1);
  localStorage.setItem("all todo Texts", JSON.stringify(localStorageInfo));
}

// event listeners//////////////////////////
setInterval(liveUserScreenHeightUpdater, 100);
body.addEventListener("keydown", inputFocus);
inputElem.addEventListener("keydown", keyValidation);
addTodoBtn.addEventListener("click", inputValidation);
clearTodoListBtn.addEventListener("click", clearList);