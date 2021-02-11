export class Utils {

    // To prevent some SQL Injections
    public static formatStrForSQL(input: string): string {
        return decodeURIComponent(input).replace(/'/g, '\'\'')
    }

    public static async extendNumber(value: number, extraZero: any) {
        const valueStr: string = value.toString()
        if (valueStr.length < extraZero) {
            let zeroStr: string = ''
            for (let index = 0; index < extraZero - valueStr.length; index++) {
                zeroStr += '0'
            }
            return zeroStr + valueStr
        }
        else {
            // this.logger.warn(`It would be time to purge the base, this warning appears only if the id value is higher than a number with ${extraZero} numerals`)
            return valueStr
        }
    }

    public static getDate() {

        let dateOb = new Date()
        let day = this.extendNumber(parseInt(('0' + dateOb.getDate()).slice(-2), 10), 2)
        let month = this.extendNumber(parseInt(('0' + (dateOb.getMonth() + 1)).slice(-2), 10), 2)
        let year = this.extendNumber(dateOb.getFullYear(), 4)
        let hours = this.extendNumber(dateOb.getHours(), 2)
        let minutes = this.extendNumber(dateOb.getMinutes(), 2)
        let seconds = this.extendNumber(dateOb.getSeconds(), 2)

        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
    }

}