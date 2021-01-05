let mainBg = document.getElementById('mainBg');
let checkList = document.getElementById('checkList');
let listInput = document.getElementById('listInput');
let info = document.getElementById('info');
let saveBtn = document.getElementById('saveBtn');
let addBtn = document.getElementById('addBtn');
let settings = document.getElementById('settings');
let mainPage = document.getElementById('mainPage');
let todListPage = document.getElementById('todListPage');
let username = document.getElementById('username');
let userInfo = document.getElementById('userInfo');
let uid = 0;

let themes = [{
        light: '#EDE7F6',
        mid: '#D1C4E9',
        high: '#512DA8',
    },
    {
        light: '#fff9f4',
        mid: '#f9e3cf',
        high: '#fc8a25',
    },
    {
        light: '#E3F2FD',
        mid: '#90CAF9',
        high: '#0D47A1',
    },
    {
        light: '#F1F8E9',
        mid: '#C5E1A5',
        high: '#689F38',
    }
]

function showMainPage() {
    mainPage.classList.remove('d-none');
    todoListPage.classList.add('d-none');
}

function showListPage() {
    mainPage.classList.add('d-none');
    todoListPage.classList.remove('d-none');
}

function getStarted() {
    if (username.value === '') {
        alert('Enter your name!');
        return;
    } else {
        localStorage.setItem('username', username.value);
        showListPage();
        userInfo.textContent = 'User: ' + username.value;
    }
}

function getData() {
    let getTodoList = localStorage.getItem('todoList');
    let todoList = null;

    if (getTodoList === null) {
        todoList = [];
    } else {
        let parsedTodoList = JSON.parse(getTodoList);
        todoList = parsedTodoList;
    }
    console.log(todoList)
    return todoList
}

function createItem(content, uid, checked) {
    let listElement = document.createElement('li');
    listElement.id = 'listid' + uid;
    listElement.classList.add('form-check', 'form-check-inline', 'mb-3');
    checkList.appendChild(listElement);

    let inputElement = document.createElement('input');
    inputElement.classList.add('form-check-input', 'big-checkbox');
    inputElement.type = 'checkbox';
    inputElement.id = 'checkboxId' + uid;

    inputElement.onclick = function() {
        labelElement.classList.toggle('checked');
        oncheck(inputElement.id)
        console.log(labelElement.textContent, inputElement.checked);
    };
    listElement.appendChild(inputElement);

    let divElement = document.createElement('div');
    divElement.id = 'div' + uid;
    divElement.classList.add('label-style', 'font-weight-bold', 'd-flex', 'flex-row');

    let themeChoice = localStorage.getItem('themeChoice');
    if (themeChoice === null) {
        themeChoice = 1;
    }
    console.log(themeChoice)
    divElement.style.backgroundColor = themes[themeChoice].mid;
    divElement.style.borderColor = themes[themeChoice].high;

    listElement.appendChild(divElement);

    let labelElement = document.createElement('label');
    labelElement.classList.add('label', 'form-check-label', 'd-flex', 'flex-column', 'justify-content-center');
    labelElement.setAttribute('for', inputElement.id);
    labelElement.textContent = content; // + '   ' + String(inputElement.id);
    labelElement.id = 'labelId' + uid;
    divElement.appendChild(labelElement);


    if (checked === true) {
        inputElement.checked = true;
        labelElement.classList.toggle('checked');
    }

    let anchorElement = document.createElement('a');
    anchorElement.classList.add('fa', 'fa-trash-alt', 'text-dark', 'ml-auto', 'p-3');
    anchorElement.id = 'anchorId' + uid;

    anchorElement.onclick = function() {
        removeItem(anchorElement.id)
    };
    divElement.appendChild(anchorElement);
}

saveBtn.onclick = function() {
    let stringifiedTodoList = JSON.stringify(todoList);
    localStorage.setItem('todoList', stringifiedTodoList);
}

function addItem() {
    if (listInput.value === '') {
        alert('Please enter valid text');
    } else {
        createItem(listInput.value, uid);

        let todoObject = {
            'todo': listInput.value,
            'uid': uid,
            'checked': false
        }
        todoList.push(todoObject);

        listInput.value = '';
        uid += 1;
    }
    console.log(todoList)
    todoListStatus();
}

function removeItem(id) {
    let eid = parseInt(id.slice(8, ));
    listElement = document.getElementById('listid' + eid);
    console.log(id);
    checkList.removeChild(listElement);
    todoList.splice(eid, 1);
    if (todoList.length == 0) {
        checkList.remove();
    }
    todoListStatus();
    console.log(todoList)
}

function oncheck(id) {
    let eid = parseInt(id.slice(10, ));
    let box = document.getElementById(id);
    todoList[eid].checked = box.checked;
    todoListStatus();
    console.log(todoList);
}

function todoListStatus() {
    if (todoList.length === 0) {
        info.textContent = 'No active todo items';
        // saveBtn.classList.add('d-none');
    } else {
        info.textContent = '';
        // saveBtn.classList.remove('d-none');
    }
}

function getUser() {
    let user = localStorage.getItem('username');
    if (user != null) {
        showListPage();
        userInfo.textContent = 'User: ' + user;
    } else {
        showMainPage();
    }
}

function main() {
    getUser();
    todoList = getData();
    if (todoList.length != 0) {
        for (let item in todoList) {
            console.log(item);
            createItem(todoList[item].todo, uid, todoList[item].checked);
            todoList[item].uid = uid;
            uid += 1;
        }
    }
    todoListStatus();

    let themeChoice = localStorage.getItem('themeChoice');
    console.log('theme', themeChoice);
    if (themeChoice === null) {
        changeTheme(1);
    } else {
        changeTheme(themeChoice);
    }
}

function changeTheme(choice) {
    mainBg.style.backgroundColor = themes[choice].light;
    addBtn.style.backgroundColor = themes[choice].high;
    for (let each in todoList) {
        console.log(each)
        let ele = document.getElementById('div' + each)
        ele.style.backgroundColor = themes[choice].mid;
        ele.style.borderColor = themes[choice].high;
        console.log(ele)
    }
    localStorage.setItem('themeChoice', choice);
}

function clearTasks() {
    checkList.remove();
    localStorage.removeItem('todoList');
    main();
}

function clearAll() {
    localStorage.clear();
    checkList.remove();
    alert('Please reload the page!');
}

main();
