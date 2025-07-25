// Command Line Interface using Commander.js, Inquirer.js, and Chalk
const { Command } = require("commander")
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
    // TODO: Implement interactive menu
    console.log("Interactive mode coming soon...")
  }
}

module.exports = CLI