var readFileSync = require("fs").readFileSync;
var writeFileSync = require("fs").writeFileSync;
var parse = require("jsonc-parser").parse;

function getJSON(path, def) {
    try {
        var file = readFileSync(path, "utf-8");
        return parse(file);
    } catch {
        return def;
    }
}

function saveJSON(path, data) {
    return writeFileSync(path, JSON.stringify(data), "utf-8");
}

var source = getJSON("info.json");

{
    var taskPath = process.env.appdata + "\\Code\\User\\tasks.json";
    console.log(taskPath)
    var tasks = getJSON(taskPath, {});
    tasks.tasks || (tasks.tasks = []);
    tasks.version || (tasks.version = "2.0.0");
    var hasTask = false;
    if (tasks.tasks.length) {
        var vbcTask = tasks.tasks.find(function (task) {
            return task.label === "VBC";
        })
        hasTask = tasks.tasks.indexOf(vbcTask);
    }
    hasTask === false && (hasTask = tasks.tasks.length);
    tasks.tasks[hasTask] = source.task;
    saveJSON(taskPath, tasks);
    console.log("Modified VS Code Tasks successfully");
}

{
    var keyPath = process.env.appdata + "\\Code\\User\\keybindings.json";
    var keys = getJSON(keyPath, []);
    var hasKey = false;
    if (keys.length) {
        var key = keys.find(function (key) {
            return key.key == "f5" &&
                key.command == "workbench.action.tasks.runTask" &&
                typeof key.args == "object" &&
                key.args.task == "VBC"
        })
        hasKey = keys.indexOf(key);
    }
    hasKey === false && (hasKey = keys.length);
    keys[hasKey] = source.key;
    saveJSON(keyPath, keys);
    console.log("Modified VS Code Key bindings successfully");
}