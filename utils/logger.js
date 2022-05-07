const chalk = require('chalk') // requires chalk@4.1.2

const colors = {
    GET: chalk.hex("#61AFFE"),
    OPTIONS: chalk.hex("#0D5AA7"),
    HEAD: chalk.hex("#9012FE"),
    POST: chalk.hex("#49CC90"),
    PATCH: chalk.hex("#50E3C2"),
    DELETE: chalk.hex("#F93E3E"),
    PUT: chalk.hex("#FCA131")
}

const logger = (req, res, next) => {
    const date = new Date()
    const time = chalk.cyan(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
    const path = chalk.yellow(req.originalUrl)
    const method = chalk.bold(colors[req.method](req.method))

    console.log(time, method, path)

    if (["POST", "PATCH", "PUT", "DELETE"].includes(req.method)) {
        if (Object.keys(req.body).length > 0) {
            console.table(req.body)
        }
    }

    next()
}

module.exports = logger