

function getTodos(user){
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("todos");
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const idIndex = headers.indexOf("id");
  const userIndex = headers.indexOf("user_id");
  const todoIndex = headers.indexOf("todo");
  const statusIndex = headers.indexOf("status");

  const todos = data.filter(r => r[userIndex]==user.id)
    .map(r => ({ id:r[idIndex], todo:r[todoIndex], status:r[statusIndex] }));

  return jsonResponse({ success:true, todos });
}

function addTodo(e,user){
  const text = e.parameter.todo;
  if(!text) return jsonResponse({ success:false, error:"Todo text required" });

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("todos");

  const lastRow = sheet.getLastRow();
  const newId = lastRow>1 ? parseInt(sheet.getRange(lastRow,1).getValue())+1 : 1;

  sheet.appendRow([newId,user.id,text,"pending"]);
  return jsonResponse({ success:true });
}

function deleteTodo(e,user){
  const id = parseInt(e.parameter.id);
  if(!id) return jsonResponse({ success:false, error:"Invalid id" });

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("todos");
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();

  const idIndex = headers.indexOf("id");
  const userIndex = headers.indexOf("user_id");

  const rowIndex = data.findIndex(r=>r[idIndex]==id && r[userIndex]==user.id);
  if(rowIndex==-1) return jsonResponse({ success:false, error:"Todo not found" });

  sheet.deleteRow(rowIndex+2);
  return jsonResponse({ success:true });
}

function updateTodoStatus(e,user){
  const id = parseInt(e.parameter.id);
  const status = e.parameter.status;
  if(!id || !status) return jsonResponse({ success:false, error:"ID & status required" });

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("todos");
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();

  const idIndex = headers.indexOf("id");
  const userIndex = headers.indexOf("user_id");
  const statusIndex = headers.indexOf("status");

  const rowIndex = data.findIndex(r=>r[idIndex]==id && r[userIndex]==user.id);
  if(rowIndex==-1) return jsonResponse({ success:false, error:"Todo not found" });

  sheet.getRange(rowIndex+2,statusIndex+1).setValue(status);
  return jsonResponse({ success:true });
}
