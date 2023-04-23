function reducer(state = { todos: [] }, action) {
  switch (action.type) {
    case "ADD_TODO":
      return { ...state, todos: [...state.todos, action.todo] };

    default:
      return state;
  }
}

function createStore() {
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

const store = createStore();
store.dispatch({
  type: "ADD_TODO",
  todo: {
    id: 0,
    name: "Learn Node",
    complete: false,
  },
});
