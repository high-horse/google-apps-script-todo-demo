
// -------------------
// Todos Handling
// -------------------
function handleTodos(e) {
  const action = e.parameter.action;
  const token = e.parameter.token;
  if(!token) return jsonResponse({ success:false, error:"No token" });

  const user = getUserByToken(token);
  if(!user) return jsonResponse({ success:false, error:"Invalid token" });

  if(action === "get") return getTodos(user);
  if(action === "add") return addTodo(e, user);
  if(action === "delete") return deleteTodo(e, user);
  if(action === "updateStatus") return updateTodoStatus(e, user);

  return jsonResponse({ success:false, error:"Invalid todo action" });
}
