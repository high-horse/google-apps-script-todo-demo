const SPREADSHEET_ID = "1vm69FqRVl0lf8QoQuxziForEE4gKq18uI066FdQRKbA"

function doGet(e) {
  return handleRequest(e, "GET");
}

function doPost(e) {
  return handleRequest(e, "POST");
}

function handleRequest(e, method) {
  const route = e.parameter.route;

  switch(route) {
    case "user" :
      return handleUsers(e, method);

    case "todo":
      return handleTodos(e);

    default :
      return jsonResponse({error: "route not found"});
  }
}


