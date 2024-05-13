var sourceFile = "info.json"
var shell = new ActiveXObject("WScript.Shell");
var destinationFile = shell.ExpandEnvironmentStrings("%appdata%") + "\\Code\\User\\tasks.json"
var fso = new ActiveXObject("Scripting.FileSystemObject");
var json2 = fso.OpenTextFile("json2.js", 1)
eval(json2.ReadAll())
json2.close();
var sourceJson;
try {
    var sourceFileStream = fso.OpenTextFile(sourceFile, 1);
    sourceJson = sourceFileStream.ReadAll();
    sourceFileStream.close();
} catch (e) {
    WScript.Echo("Error reading source JSON File: " + e.message);
    WScript.Quit(1);
}
var destinationJson;
try {
    var destinationFileStream = fso.OpenTextFile(destinationFile, 1);
    destinationJson = destinationFileStream.ReadAll();
    destinationFileStream.close();
} catch (e) {
    destinationJson = JSON.stringify({
        version: "2.0.0"
    })
}
var sourceObj;
var destinationObj;
try {
    sourceObj = JSON.parse(sourceJson);
    destinationObj = JSON.parse(destinationJson);
} catch (e) {
    WScript.Echo("Error parsing JSON: " + e.message);
    WScript.Quit(1)
}
if (!sourceObj.hasOwnProperty("tasks")) {
    WScript.Echo("Source JSON does not have a tasks property.")
    WScript.Quit(1)
}
if (!destinationObj.hasOwnProperty("tasks")) {
    destinationObj.tasks = []
}
destinationObj.tasks = destinationObj.tasks.concat(sourceObj.tasks);
var destinationJsonString = JSON.stringify(destinationObj);
try {
    var outFile = fso.CreateTextFile(destinationFile, true);
    outFile.WriteLine(destinationJsonString);
    outFile.close();
    WScript.Echo("VS Code Tasks appended successfully")
} catch (e) {
    WScript.Echo("Error appending VS Code tasks: " + e.message);
    WScript.Quit(1)
}
destinationFile = shell.ExpandEnvironmentStrings("%appdata%") + "\\Code\\User\\keybindings.json"
destinationJson = "[]";
try {
    var destinationFileStream = fso.OpenTextFile(destinationFile, 1);
    destinationJson = destinationFileStream.ReadAll();
    destinationFileStream.close();
} catch (e) { }
try {
    destinationObj = JSON.parse(destinationJson);
} catch (e) {
    destinationObj = [];
}
destinationObj.push(sourceObj.key);
destinationJsonString = JSON.stringify(destinationObj);
try {
    var outFile = fso.CreateTextFile(destinationFile, true);
    outFile.WriteLine(destinationJsonString);
    outFile.close();
    WScript.Echo("VS Code key bindings appended successfully");
} catch (e) {
    WScript.Echo("Error appending VS Code key bindings: " + e.message)
    WScript.Quit(1);
}