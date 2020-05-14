const Discord = require("discord.js");
const Token = require("./auth.json");
const fs = require("fs");
const path = require("path");
const bot = new Discord.Client();

const Tasks = require("./tasks.json");

var taskList = {
  tasks: {}
};




bot.once("ready", () => {
  console.log("bot initialized");
});

bot.login(Token.token);

bot.on('message', message => {
  msg = message.content;
  if (msg.startsWith("?")) {
    msg = msg.replace(/\*|\,|\'|\?|\!|\.|\:|\;|\`|\-|\_|\{|\}|\[|\]|\"/g, '');
    switch (true) {
      case msg === "ping":
        message.channel.send("pong");
        break;
      case msg.startsWith("task "):
        msg = msg.replace('task ', '');
        switch (true) {
          case msg.startsWith("add"):
            msg = msg.replace('add ', '');
            taskList.tasks[msg] = "incomplete";
            jsonTaskList = JSON.stringify(taskList);
            fs.writeFile("./tasks.json", jsonTaskList, 'utf8', function(err) {
              if (err) console.log(err);
            });
            message.channel.send(msg + " added");
            break;
          case msg === "list":
            fs.readFile('./tasks.json', 'utf8', function readFileCallback(err, data) {
              if (err) {
                console.log(err);
              } else {
                taskList = JSON.parse(data);
                taskString = "";
                for (x in taskList["tasks"]) {
                  taskString += "`" + x + ": " + taskList["tasks"][x] + "";
                  if (taskList["tasks"][x] === "complete") {
                    taskString += " ✅`\n";
                  }
                  else {
                    taskString += " ❌`\n";
                  }
                }
                if (taskString === "") {
                  message.channel.send("`no current tasks`");
                }
                else {
                  message.channel.send(taskString);
                }
              }
            });
            break;
          case msg.startsWith("remove"):
            msg = msg.replace('remove ', '');
            if (taskList.tasks[msg] != undefined) {
              delete taskList.tasks[msg];
              jsonTaskList = JSON.stringify(taskList);
              fs.writeFile("./tasks.json", jsonTaskList, 'utf8', function(err) {
                if (err) console.log(err);
                console.log("did the thing");
              });
              message.channel.send(msg + " removed");
            }
            else {
              message.channel.send("task not found");
            }
            break;
          case msg.startsWith("complete"):
            msg = msg.replace('complete ', '');
            if (taskList.tasks[msg] != undefined) {
              taskList.tasks[msg] = "complete";
              jsonTaskList = JSON.stringify(taskList);
              fs.writeFile("./tasks.json", jsonTaskList, 'utf8', function(err) {
                if (err) console.log(err);
                console.log("did the thing");
              });
              message.channel.send(msg + " completed");
            }
            else {
              message.channel.send("task not found");
            }
            break;
          case msg === "help":
            message.channel.send("Task Commands:\n\n add (taskname), remove (taskname), complete (taskname), and list");
            break;
        }
        break;
    }
  }
});
