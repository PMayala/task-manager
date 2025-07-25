// Command Line Interface using Commander.js, Inquirer.js, and Chalk
const { Command } = require("commander")
const inquirer = require("inquirer")
const chalk = require("chalk")
const TaskManager = require("./TaskManager")

class CLI {
  constructor() {
    this.taskManager = new TaskManager()
    this.program = new Command()
    this.setupCommands()
  }

  setupCommands() {
    this.program
      .name("task-manager")
      .description("A comprehensive task management CLI application")
      .version("1.0.0")

    this.program
      .command("start")
      .description("Start the interactive task manager")
      .action(() => this.startInteractive())

    this.program
      .command("add")
      .description("Add a new task")
      .action(() => this.addTaskCommand())
  }

  async start() {
    console.log(chalk.blue.bold("\n🎯 Welcome to Task Manager!"))
    console.log(chalk.blue("====================================="))

    try {
      await this.taskManager.initialize()

      // If no arguments provided, start interactive mode
      if (process.argv.length <= 2) {
        await this.startInteractive()
      } else {
        this.program.parse()
      }
    } catch (error) {
      console.error(chalk.red("Failed to initialize task manager:"), error.message)
    }
  }

  async startInteractive() {
    while (true) {
      try {
        const { action } = await inquirer.prompt([
          {
            type: "list",
            name: "action",
            message: chalk.cyan("What would you like to do?"),
            choices: [
              { name: "➕ Add Task", value: "add" },
              { name: "📋 View All Tasks", value: "view" },
              { name: "👋 Exit", value: "exit" },
            ],
          },
        ])

        if (action === "exit") {
          console.log(chalk.green("\n👋 Thank you for using Task Manager!"))
          process.exit(0)
        }

        await this.handleAction(action)
      } catch (error) {
        console.error(chalk.red("❌ Error:"), error.message)
      }
    }
  }

  async handleAction(action) {
    switch (action) {
      case "add":
        await this.addTaskFlow()
        break
      case "view":
        console.log("View tasks coming soon...")
        break
      default:
        console.log("Feature not implemented yet.")
    }
  }

  async addTaskFlow() {
    console.log(chalk.yellow("\n➕ Add New Task"))
    console.log(chalk.yellow("================"))

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "Task title:",
        validate: (input) => input.trim().length > 0 || "Title is required",
      },
      {
        type: "input",
        name: "description",
        message: "Description (optional):",
      },
      {
        type: "list",
        name: "priority",
        message: "Priority:",
        choices: ["High", "Medium", "Low"],
        default: "Medium",
      },
      {
        type: "input",
        name: "dueDate",
        message: "Due date (YYYY-MM-DD, optional):",
        validate: (input) => {
          if (!input) return true
          const date = new Date(input)
          return !isNaN(date.getTime()) || "Invalid date format"
        },
      },
      {
        type: "input",
        name: "category",
        message: "Category:",
        default: "General",
      },
      {
        type: "list",
        name: "taskType",
        message: "Task type:",
        choices: ["regular", "work", "personal"],
        default: "regular",
      },
    ])

    try {
      const task = await this.taskManager.addTask(
        answers.title,
        answers.description,
        answers.priority,
        answers.dueDate || null,
        answers.category,
        answers.taskType,
      )
      console.log(chalk.green(`✅ Task "${task.title}" added successfully!`))
    } catch (error) {
      console.log(chalk.red(`❌ ${error.message}`))
    }
  }

  // Command-line specific methods
  async addTaskCommand() {
    await this.taskManager.initialize()
    await this.addTaskFlow()
  }
}

module.exports = CLI