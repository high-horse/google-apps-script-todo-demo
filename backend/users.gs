
function handleUsers(e, method) {
  if( method == "GET" && e.parameter.action === "register") return registerUser(e);
  if( method == "GET" && e.parameter.action === "login") return loginUser(e);
  if(action === "validateToken") return validateToken(e);
  
  if (method === "GET" ) {
    return jsonResponse({ success: true, message: "GET request received at /user", parameters: e.parameter });
  }

   if (method === "POST") {
    return jsonResponse({ success: true, message: "POST request received at /user", parameters: e.parameter });
  }

  return jsonResponse({ error: "Invalid method" });
}