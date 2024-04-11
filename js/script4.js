const taskText = document.querySelector('#tasktext');
const taskTextMobile = document.querySelector('#tasktextmobile');
const taskAdd = document.querySelector('#taskadd');
const taskArea = document.querySelector('#taskarea');
const doneTaskArea = document.querySelector('#donetask');

// Adding the task
taskAdd.addEventListener('click', (e) => {
  // Get the value from the visible input field
  let task = taskText.value.trim() || taskTextMobile.value.trim();
  if (!task) {
    alert('Task cannot be empty!');
    return;
  }

  let newTask = document.createElement('div');
  newTask.className = "task mx-auto outline-blue-500 rounded-md px-2 sm:px-5 py-2 font-serif bg-blue-200 my-5 flex flex-col sm:flex-row space-x-0 space-y-3 sm:space-x-4";
  newTask.innerHTML = `
    <input type="checkbox" class="done" name="done">
    <p>${task}</p>
    <div class="flex">
      <select name="priority" class="priority rounded-lg h-8 mx-auto bg-inherit text-gray-600 focus:outline-blue-600 active:outline-blue-600 hover:bg-blue-100">
        <option value="" disabled selected>--Select priority--</option>
        <option value="low" class="text-blue-400">Low priority</option>
        <option value="medium" class="text-yellow-300">Medium Priority</option>
        <option value="high" class="text-red-600">High Priority</option>
      </select>
    </div>`;
  taskArea.insertAdjacentHTML('beforeend', newTask.outerHTML);
  // Clear both input fields
  taskText.value = "";
  taskTextMobile.value = "";
  console.log('task added');
});

//priority setter (same as before)
taskArea.addEventListener('change', (e) => {
  if (e.target.classList.contains('priority')) {
    let task = e.target.closest('.task');
    task.classList.remove("bg-blue-200");
    switch (e.target.value) {
      case 'low':
        task.classList.add("bg-blue-400");
        console.log('Priority set to low');
        break;
      case 'medium':
        task.classList.add("bg-yellow-200");
        console.log('Priority set to medium');
        break;
      case 'high':
        task.classList.add("bg-red-400");
        console.log('Priority set to high');
        break;
    }
  }
});

taskText.addEventListener('keydown', (e) => {
  if (event.key === "Enter") {
    let task = taskText.value.trim();
    if (!task) {
      alert("Task cannot be empty");
    }

    let newTask = document.createElement('div');
    newTask.className = "task mx-auto outline-blue-500 rounded-md px-2 sm:px-5 py-2 font-serif bg-blue-200 my-5 flex flex-col sm:flex-row space-x-0 space-y-3 sm:space-x-4";
    newTask.innerHTML = `<input type="checkbox" class="done" name="done">
    <p>${task}</p>
    <div class="flex">
      <select name="priority" class="priority rounded-lg h-8 mx-auto bg-inherit text-gray-600 focus:outline-blue-600 active:outline-blue-600 hover:bg-blue-100">
        <option value="" disabled selected>--Select priority--</option>
        <option value="low" class="text-blue-400">Low priority</option>
        <option value="medium" class="text-yellow-300">Medium Priority</option>
        <option value="high" class="text-red-600">High Priority</option>
      </select>
    </div>`;
    taskArea.insertAdjacentHTML('beforeend', newTask);
    taskText.value = "";
    console.log("task added");
  }

  taskText.addEventListener('keydown', (e) => {
    if (event.key === "Enter") {
      let task = taskText.value.trim();
      if (!task) {
        alert("Task cannot be empty");
      }
  
      let newTask = document.createElement('div');
      newTask.className = "task mx-auto outline-blue-500 rounded-md px-2 sm:px-5 py-2 font-serif bg-blue-200 my-5 flex flex-col sm:flex-row space-x-0 space-y-3 sm:space-x-4";
      newTask.innerHTML = `<input type="checkbox" class="done" name="done">
      <p>${task}</p>
      <div class="flex">
        <select name="priority" class="priority rounded-lg h-8 mx-auto bg-inherit text-gray-600 outline-none border-none focus:outline-blue-600 active:outline-blue-600 hover:bg-blue-100">
          <option value="" disabled selected> --Select priority-- </option>
          <option value="low" class="text-blue-400">Low priority</option>
          <option value="medium" class="text-yellow-300">Medium Priority</option>
          <option value="high" class="text-red-600">High Priority</option>
        </select>
      </div>`;
      taskArea.appendChild(newTask);
      taskText.value = "";
      console.log("task added");
    }
  });
});

//implementing completed element (same as before)
taskArea.addEventListener('click', (e) => {
  if (e.target.classList.contains('done')) {
    let taskElement = e.target.parentElement;
    let task = taskElement.querySelector('p').innerText;
    taskElement.remove();
    doneTaskArea.insertAdjacentHTML('beforeend', `<div class="donetask mx-auto outline-blue-500 rounded-md px-5 py-2 font-serif line-through text-gray-300 bg-green-100 my-5 flex">${task}</div>`);
    console.log('moved task to donetask section');
  }
});
