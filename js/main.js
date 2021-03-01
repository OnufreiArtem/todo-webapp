let todoList = [
  {
    id: 0,
    text: "Go to school",
    done: false
  },
  {
    id: 1,
    text: "Brush teeth",
    done: false
  },
  {
    id: 2,
    text: "Go to bed",
    done: false
  },
  {
    id: 3,
    text: "Buy some food",
    done: true
  }
];

const taskTextInput = document.getElementById("task_text_input");
const addBtn = document.getElementById("add_btn");

const assignedListContainer = document.getElementById(
  "assigned_list_container"
);
const doneListContainer = document.getElementById("done_list_container");

const assignedHintText = document.getElementById("assigned_hint_text");
const doneHintText = document.getElementById("done_hint_text");

const nextId = () =>
  todoList.length <= 0 ? 0 : Math.max(...todoList.map((task) => task.id)) + 1;

const getTask = ({ id, text, done }) => {
  return `
        <div class="list-item ${done ? "done" : "assigned"}" id="task_${id}">
        <span class="list-item__btn-container">
        <button class="list-item__btn ic_edit${
          done ? "_green" : ""
        }" title="Edit task" id="task_edit_${id}" onclick="editTask(event)"></button>
        </span>
        <input type="text" class="list-item__text ${
          done ? "crossed-text" : ""
        }" value="${text}" id="task_input_${id}" readonly />
        <span class="list-item__btn-container">
            <button class="list-item__btn ${
              done ? "ic_restore" : "ic_done_green"
            }" title="${
    done ? "Restore" : "Set done"
  }" id="task_makedone_${id}" onclick="changeTaskState(event)"></button>
            <button class="list-item__btn ic_delete" title="Remove task" id="task_delete_${id}" onclick="deleteTask(event)"></button>
        </span>
    </div>
    `;
};

const updateLists = () => {
  assignedListContainer.innerHTML = "";
  doneListContainer.innerHTML = "";

  todoList.forEach((task) => {
    let listToAdd = task.done ? doneListContainer : assignedListContainer;
    listToAdd.innerHTML += getTask(task);
  });

  assignedHintText.style.display =
    assignedListContainer.innerHTML === "" ? "block" : "none";
  doneHintText.style.display =
    doneListContainer.innerHTML === "" ? "block" : "none";
};

const setTodoList = (list) => {
  todoList = list;
  updateLists();
};

const getNumFromEnd = (text) => {
  let parts = text.split("_");
  return Number.parseInt(parts[parts.length - 1], 10);
};

const addTaskWithText = (text) => {
  taskTextInput.value = "";
  if (text.trim() !== "") {
    todoList.push({
      id: nextId(),
      text: text,
      done: false
    });
    updateLists();
  }
};

const changeTaskStateWithId = (id) => {
  setTodoList(
    todoList.map((task) => {
      if (task.id === id) {
        task.done = !task.done;
      }
      return task;
    })
  );
};

const changeTaskTextWithId = (id, text) => {
  setTodoList(
    todoList.map((task) => {
      if (task.id === id) {
        task.text = text;
      }
      return task;
    })
  );
};

const removeTaskWithId = (id) => {
  setTodoList(
    todoList.reduce((acc, curr) => {
      return curr.id !== id ? [...acc, curr] : acc;
    }, [])
  );
};

//On click
function deleteTask(e) {
  console.log(`started to delete ${e.target.id}`);
  let numId = getNumFromEnd(e.target.id);
  removeTaskWithId(numId);
}

//On click
function changeTaskState(e) {
  console.log(`started to change ${e.target.id}`);
  let numId = getNumFromEnd(e.target.id);
  changeTaskStateWithId(numId);
}

//On click
function editTask(e) {
  console.log(`started to edit ${e.target.id}`);
  let numId = getNumFromEnd(e.target.id);
  let input = document.getElementById(`task_input_${numId}`);
  input.readOnly = false;
  input.focus();

  input.addEventListener("focusout", (_) => {
    if (input.value.trim() !== "") {
      changeTaskTextWithId(numId, input.value);
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") input.blur();
  });
}

taskTextInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTaskWithText(taskTextInput.value);
});

addBtn.addEventListener("click", () => {
  addTaskWithText(taskTextInput.value);
});

// On start
updateLists();
