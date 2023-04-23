function createStore(reducer) {
  let state;
  let listeners = [];

  const getState = () => state;

  const subscribe = (listener) => {
    listeners.push(listener);

    // unsubscribe
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  const dispatch = (action) => {
    state = reducer(state, action);

    listeners.forEach((listener) => listener());
  };

  return {
    getState,
    subscribe,
    dispatch,
  };
}

// Constants
const ADD_TODO = "ADD_TODO";
const REMOVE_TODO = "REMOVE_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";

const ADD_GOAL = "ADD_GOAL";
const REMOVE_GOAL = "REMOVE_GOAL";

// Action creators
function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    todo,
  };
}

function removeTodoAction(id) {
  return {
    type: REMOVE_TODO,
    id,
  };
}

function toggleTodoAction(id) {
  return {
    type: TOGGLE_TODO,
    id,
  };
}

function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal,
  };
}

function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id,
  };
}

// Reducers
function todoReducer(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [...state, action.todo];

    case REMOVE_TODO:
      return state.filter((todo) => todo.id !== action.id);

    case TOGGLE_TODO:
      return state.map((todo) =>
        todo.id !== action.id ? todo : { ...todo, complete: !todo.complete }
      );

    default:
      return state;
  }
}

function goalReducer(state = [], action) {
  switch (action.type) {
    case ADD_GOAL:
      return [...state, action.goal];

    case REMOVE_GOAL:
      return state.filter((goal) => goal.id !== action.id);

    default:
      return state;
  }
}

function rootReducer(state = {}, action) {
  return {
    todos: todoReducer(state.todos, action),
    goals: goalReducer(state.goals, action),
  };
}

// Store
const store = createStore(rootReducer);

// Utils
function generateId() {
  return (
    Math.random().toString(36).substring(2) + new Date().getTime().toString(36)
  );
}

// DOM code
document.querySelector("#addTodoBtn").addEventListener("click", addTodo);
document.querySelector("#addGoalBtn").addEventListener("click", addGoal);

function createRemoveButton(onClick) {
  const btn = document.createElement("button");
  btn.textContent = "X";
  btn.addEventListener("click", onClick);
  return btn;
}

function addTodo() {
  const input = document.querySelector("#todo");
  const name = input.value;
  input.value = "";

  store.dispatch(
    addTodoAction({
      id: generateId(),
      name,
      complete: false,
    })
  );
}

function toggleTodo(id) {
  store.dispatch(toggleTodoAction(id));
}

function removeTodo(id) {
  store.dispatch(removeTodoAction(id));
}

function addGoal() {
  const input = document.querySelector("#goal");
  const name = input.value;
  input.value = "";

  store.dispatch(
    addGoalAction({
      id: generateId(),
      name,
    })
  );
}

function removeGoal(id) {
  store.dispatch(removeGoalAction(id));
}

const unsubscribe = store.subscribe(() => {
  const { todos, goals } = store.getState();

  document.querySelector("#todos").textContent = "";
  document.querySelector("#goals").textContent = "";

  todos.forEach(addTodoToDOM);
  goals.forEach(addGoalToDOM);
});

function addTodoToDOM(todo) {
  const node = document.createElement("li");
  node.textContent = todo.name;

  node.style.textDecoration = todo.complete ? "line-through" : "none";
  node.style.cursor = "pointer";
  node.style.color = todo.complete ? "gray" : "black";

  node.addEventListener("click", () => {
    toggleTodo(todo.id);
  });

  const removeBtn = createRemoveButton(() => {
    removeTodo(todo.id);
  });
  node.appendChild(removeBtn);

  document.querySelector("#todos").appendChild(node);
}

function addGoalToDOM(goal) {
  const node = document.createElement("li");
  node.textContent = goal.name;

  const removeBtn = createRemoveButton(() => {
    removeGoal(goal.id);
  });
  node.appendChild(removeBtn);

  document.querySelector("#goals").appendChild(node);
}
