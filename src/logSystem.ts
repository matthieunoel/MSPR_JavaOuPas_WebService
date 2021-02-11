import { Utils } from './utils'

const fsPromise = require('fs').promises

export class Logger {

    public log(message: any) {
        console.log(message)
        this.saveLog('Log ', message.toString())
    }

    public warn(message: any) {
        console.warn(message)
        this.saveLog('Warn', message.toString())
    }

    public error(message: any) {
        console.error(message)
        this.saveLog('Err ', message.toString())
    }

    public reqLog(message: any) {
        console.log(message)
        this.saveLog('Req ', message.toString())
    }

    private async saveLog(level: string, message: string) {

        try {

            const month = Utils.extendNumber(parseInt(('0' + (new Date(Date.now()).getMonth() + 1)).slice(-2), 10), 2)
            const year = Utils.extendNumber(new Date(Date.now()).getFullYear(), 4)
            const file: string = `./log/${year}-${month}.log`

            let text = `${level} [${Utils.getDate()}] ${message}\r\n`
            await fsPromise.appendFile(file, text)

        } catch (error) {
            console.warn('An error has been avoided in the logging system.', error)
        }

    }

}