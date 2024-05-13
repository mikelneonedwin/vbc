var shell = new ActiveXObject("WScript.Shell");
var fso = new ActiveXObject("Scripting.FileSystemObject");

// enable JSON
var json2 = fso.OpenTextFile("json2.js", 1)
eval(json2.ReadAll())
json2.close();


function getJSON(path, def) {
    var sourceFileStream = fso.OpenTextFile(path, 1);
    var sourceJSON = sourceFileStream.ReadAll();
    sourceFileStream.close();
    try {
        return JSON.parse(sourceJSON);
    } catch (e) {
        if (def) return def;
        else throw e
    }
}

function saveJSON(path, data) {
    var outFile = fso.CreateTextFile(path, true);
    outFile.WriteLine(JSON.stringify(data));
    outFile.close();
}


// enable console
var console = {
    log: function (t) {
        WScript.Echo(t)
    }
}

// read from source json
var source = getJSON("info.json");

{
    var taskPath = shell.ExpandEnvironmentStrings("%appdata%") + "\\Code\\User\\tasks.json";
    var tasks = getJSON(taskPath, {});
    var hasTask = false;
    // set tasks property
    tasks.tasks || (tasks.tasks = []);
    // set version
    tasks.version || (tasks.version = "2.0.0");
    if (tasks.tasks.length) {
        for (var i = 0; i < tasks.tasks.length; i++) {
            tasks.tasks[i].label === "VBC" &&
                (hasTask = i)
        }
    }
    hasTask === false && (hasTask = tasks.tasks.length);
    tasks.tasks[hasTask] = source.task;
    saveJSON(taskPath, tasks);
    console.log("Modified VS Code Tasks successfully");
}

{
    var keyPath = shell.ExpandEnvironmentStrings("%appdata%") + "\\Code\\User\\keybindings.json";
    var keys = getJSON(keyPath, []);
    var hasKey = false;
    if (keys.length) {
        for (var i = 0; i < keys.length; i++) {
            keys[i].key == "f5" &&
                keys[i].command == "workbench.action.tasks.runTask" &&
                typeof keys[i].args == "object" &&
                keys[i].args.task == "VBC" &&
                (hasKey = i);
            }
        }
        hasKey === false && (hasKey = keys.length);
        keys[hasKey] = source.key;
        saveJSON(keyPath, keys);
        console.log("Modified VS Code Key bindings successfully");
    }