
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}


function hashPassword(password) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password);
  return digest.map(b => ('00' + (b & 0xFF).toString(16)).slice(-2)).join('');
}

function requireAuth(e) {
  const token = e.parameter.token;
  if (!token) return null;

  const userStr = PropertiesService.getScriptProperties().getProperty(token);
  if (!userStr) return null;

  return JSON.parse(userStr); // authenticated user object
}

function getRequestBody(e) {
  // e.postData.contents exists for JSON POSTs
  if (!e.postData || !e.postData.contents) return {};
  return JSON.parse(e.postData.contents);
}


function getUserByToken(token){
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("users");
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const tokenIndex = headers.indexOf("token");
  const userRowIndex = data.findIndex(r=>r[tokenIndex]===token);
  if(userRowIndex==-1) return null;
  const row = data[userRowIndex];
  return { id: row[headers.indexOf("id")], name: row[headers.indexOf("name")], email: row[headers.indexOf("email")] };
}