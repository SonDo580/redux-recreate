function todoReducer(state = [], action) {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, action.todo];

    case "REMOVE_TODO":
      return state.filter((todo) => todo.id !== action.id);

    case "TOGGLE_TODO":
      return state.map((todo) =>
        todo.id !== action.id ? todo : { ...todo, complete: !todo.complete }
      );

    default:
      return state;
  }
}

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

// Using the store
const store = createStore(reducer);

const unsubscribe = store.subscribe(() =>
  console.log("New state: ", store.getState())
);

store.dispatch({
  type: "ADD_TODO",
  todo: {
    id: 0,
    name: "Learn Node",
    complete: false,
  },
});

store.dispatch({
  type: "ADD_TODO",
  todo: {
    id: 1,
    name: "Learn Go",
    complete: false,
  },
});

unsubscribe();
store.dispatch({
  type: "ADD_TODO",
  todo: {
    id: 2,
    name: "Learn GraphQL",
    complete: false,
  },
});
