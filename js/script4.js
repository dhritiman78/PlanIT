const taskText = document.querySelector('#tasktext');
const taskTextMobile = document.querySelector('#tasktextmobile');
const taskAdd = document.querySelector('#taskadd');
const taskArea = document.querySelector('#taskarea');
const doneTaskArea = document.querySelector('#donetask');

//adding the task
taskAdd.addEventListener('click', (e) => {
  let task = taskText.value;
  let taskMobile = taskTextMobile.value;
  if (task.trim() === '') {
    alert('Task cannot be empty!');
    return;
  }
  if (taskTextMobile.trim() === '') {
    alert('Task cannot be empty!');
    return;
  }
  if (task) {
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
    taskArea.appendChild(newTask);
    taskText.value = "";
    console.log('task added');
  }

  if (taskMobile) {
    let newTask = document.createElement('div');
    newTask.className = "task mx-auto outline-blue-500 rounded-md px-2 sm:px-5 py-2 font-serif bg-blue-200 my-5 flex flex-col sm:flex-row space-x-0 space-y-3 sm:space-x-4";
    newTask.innerHTML = `
    <input type="checkbox" class="done" name="done">
    <p>${taskMobile}</p>
    <div class="flex">
      <select name="priority" class="priority rounded-lg h-8 mx-auto bg-inherit text-gray-600 focus:outline-blue-600 active:outline-blue-600 hover:bg-blue-100">
        <option value="" disabled selected>--Select priority--</option>
        <option value="low" class="text-blue-400">Low priority</option>
        <option value="medium" class="text-yellow-300">Medium Priority</option>
        <option value="high" class="text-red-600">High Priority</option>
      </select>
    </div>`;
    taskArea.appendChild(newTask);
    taskTextMobile.value = "";
    console.log('task added');
  }


  //priority setter
  taskArea.addEventListener('change', (e) => {
    if (e.target.id === 'priority' && e.target.value === 'low') {
      let task = e.target.closest('.task');
      task.classList.remove("bg-blue-200");
      task.classList.add("bg-blue-400");
      console.log('Priority set to low');
    }
  })

  taskArea.addEventListener('change', (e) => {
    if (e.target.id === 'priority' && e.target.value === 'medium') {
      let task = e.target.closest('.task');
      task.classList.remove("bg-blue-200");
      task.classList.add("bg-yellow-200");
      console.log('Priority set to medium');
    }
  })

  taskArea.addEventListener('change', (e) => {
    if (e.target.id === 'priority' && e.target.value === 'high') {
      let task = e.target.closest('.task');
      task.classList.remove("bg-blue-200");
      task.classList.add("bg-red-400");
      console.log('Priority set to high');
    }
  })
})


taskText.addEventListener('keydown', (e) => {
  if (event.key == "Enter") {
    let task = taskText.value;
    if (task.trim() === '') {
      alert('Task cannot be empty!');
      return;
    }
    let prevHtml = taskArea.innerHTML;
    taskArea.innerHTML = prevHtml + `<div
  class="task mx-auto outline-blue-500 rounded-md px-2 sm:px-5 py-2 font-serif bg-blue-200 my-5 flex flex-col sm:flex-row space-x-0 space-y-3 sm:space-x-4">
  <input type="checkbox" class="done" name="done">
  <p>${task}</p>
  <div class="flex">
    <select name="priority" id="priority" class="rounded-lg h-8 mx-auto bg-inherit text-gray-600 focus:outline-blue-600 active:outline-blue-600 hover:bg-blue-100">
      <option value="" disabled selected>--Select priority--</option>
      <option value="low" class="text-blue-400">Low priority</option>
      <option value="medium" class="text-yellow-300">Medium Priority</option>
      <option value="high" class="text-red-600">High Priority</option>
    </select>
  </div>
  </div>`;
    taskText.value = "";
    console.log('task added');
  }

  //priority setter
  taskArea.addEventListener('change', (e) => {
    if (e.target.id === 'priority' && e.target.value === 'low') {
      let task = e.target.closest('.task');
      task.classList.remove("bg-blue-200");
      task.classList.add("bg-blue-400");
      console.log('Priority set to low');
    }
  })

  taskArea.addEventListener('change', (e) => {
    if (e.target.id === 'priority' && e.target.value === 'medium') {
      let task = e.target.closest('.task');
      task.classList.remove("bg-blue-200");
      task.classList.add("bg-yellow-200");
      console.log('Priority set to medium');
    }
  })

  taskArea.addEventListener('change', (e) => {
    if (e.target.id === 'priority' && e.target.value === 'high') {
      let task = e.target.closest('.task');
      task.classList.remove("bg-blue-200");
      task.classList.add("bg-red-400");
      console.log('Priority set to high');
    }
  })
})

//implementing completed element
taskArea.addEventListener('click', (e) => {
  if (e.target.classList.contains('done')) {
    let childElement = e.target.parentElement.children;
    let task = childElement[1].innerText;
    e.target.parentElement.remove();
    let prevHtml = doneTaskArea.innerHTML;
    doneTaskArea.innerHTML = prevHtml + `<div class="donetask mx-auto outline-blue-500 rounded-md px-5 py-2 font-serif line-through text-gray-300 bg-green-100 my-5 flex">${task}</div>`;
    console.log('moved task to donetask section');
  }
});