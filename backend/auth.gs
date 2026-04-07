
function registerUser(e) {
  // Read from GET parameters
  const body = {
    name: e.parameter.name,
    email: e.parameter.email,
    password: e.parameter.password
  };

  if (!body.email || !body.password || !body.name) {
    return jsonResponse({ 
      success: false, 
      error: "Missing fields. 'email', 'password', 'name' required" 
    });
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("users");
  const data = sheet.getDataRange().getValues();
  const headers = data.shift(); // remove header

  // Check if email already exists
  if (data.some(row => row[headers.indexOf("email")] === body.email)) {
    return jsonResponse({ success: false, error: "Email already registered" });
  }

  const hashedPassword = hashPassword(body.password);
  const token = Utilities.getUuid();

  const newId = data.length + 1;

  const newRow = [
    newId,
    body.name,
    body.email,
    hashedPassword,
    token
  ];

  sheet.appendRow(newRow);

  return jsonResponse({
    success: true,
    token,
    user: { id: newId, name: body.name, email: body.email }
  });
}



function loginUser(e) {
  // Read email and password from GET parameters
  const body = {
    email: e.parameter.email,
    password: e.parameter.password
  };

  if (!body.email || !body.password) {
    return jsonResponse({ success: false, error: "Missing fields. 'email' and 'password' required" });
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("users");
  const data = sheet.getDataRange().getValues();
  const headers = data.shift(); // remove header row

  const emailIndex = headers.indexOf("email");
  const passwordIndex = headers.indexOf("password");
  const tokenIndex = headers.indexOf("token");

  // Find user with matching email and hashed password
  const userRowIndex = data.findIndex(
    row => row[emailIndex] === body.email && row[passwordIndex] === hashPassword(body.password)
  );

  if (userRowIndex === -1) {
    return jsonResponse({ success: false, error: "Invalid credentials" });
  }

  // Generate a new token
  const token = Utilities.getUuid();
  const rowIndex = userRowIndex + 2; // +2 because data array skips headers and Google Sheets is 1-indexed
  sheet.getRange(rowIndex, tokenIndex + 1).setValue(token);

  const userRow = data[userRowIndex];
  return jsonResponse({
    success: true,
    token,
    user: {
      id: userRow[headers.indexOf("id")],
      name: userRow[headers.indexOf("name")],
      email: userRow[emailIndex]
    }
  });
}


function validateToken(e){
  const token = e.parameter.token;
  if(!token) return jsonResponse({ success:false, error:"No token" });

  const user = getUserByToken(token);
  if(!user) return jsonResponse({ success:false, error:"Invalid token" });
  return jsonResponse({ success:true, user });
}
