const reminderText = document.querySelector('#remindertext');
const reminderAdd = document.querySelector('#reminderadd');
const reminderArea = document.querySelector('#reminderarea');
const completedReminder = document.querySelector('#completedreminder');

//reminder adding
reminderAdd.addEventListener('click', (e) => {
  let reminder = reminderText.value;
  console.log(reminder);
  let prevHtml = reminderArea.innerHTML;
  reminderArea.innerHTML = prevHtml + `<div class="reminder mx-auto outline-blue-500 rounded-md px-5 py-2 font-serif bg-blue-200 my-5 flex space-x-4"><input type="checkbox" class="done" name="done">${reminder}</div>`;
  console.log('Reminder added');
  reminderText.value = "";
})

//implementing enter to add
//implementing enter to add
reminderText.addEventListener("keydown", (e) => {
  if (event.key == "Enter") {
    let reminder = reminderText.value;
    console.log(reminder);
    let prevHtml = reminderArea.innerHTML;
    reminderArea.innerHTML = prevHtml + `<div class="reminder mx-auto outline-blue-500 rounded-md px-5 py-2 font-serif bg-blue-200 my-5 flex"><input type="checkbox" class="done" name="done">${reminder}</div>`;
    console.log('Reminder added');
    reminderText.value = "";
  }
})

//implementing completed element
reminderArea.addEventListener('click', (e) => {
  if (e.target.classList.contains('done')) {
    let reminder = e.target.parentElement.innerText;
    e.target.parentElement.remove();
    let prevHtml = completedReminder.innerHTML;
    completedReminder.innerHTML = prevHtml + `<div class="donereminder mx-auto outline-blue-500 rounded-md px-5 py-2 font-serif line-through text-gray-300 bg-green-100 my-5 flex">${reminder}</div>`;
    console.log('moved reminder to donereminder section');
  }
})