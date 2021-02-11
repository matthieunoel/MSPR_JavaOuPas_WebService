import { Config } from './app'
import { ITokenTestResponse } from './root/root.interfaces'

const Database = require('better-sqlite3')

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

    public static async testToken(token: string, permissionAsked: number, onlyBooleanReturn: boolean): Promise<boolean | ITokenTestResponse> {

        return new Promise<boolean | ITokenTestResponse>((resolve, reject) => {

            if (token === undefined) {
                return resolve(false)
            }
            else {

                let validity: boolean

                token = Utils.formatStrForSQL(token)

                const db = new Database(Config.dbName)
                const request: string = `SELECT permissions, expiration FROM token WHERE token = '${token}';`
                const res: ITokenTestResponse[] = db.prepare(request).all()

                if (res.length === 0) {
                    validity = false
                }
                else if ((Config.tokenDuration > 0) && (permissionAsked < res[0].permissions || new Date(res[0].expiration) < new Date())) {
                    validity = false
                }
                else {
                    validity = true
                }

                if (onlyBooleanReturn) {
                    return resolve(validity)
                }
                else {
                    if (validity) {
                        res[0].validity = validity
                    }
                    else {
                        res.push({
                            expiration: '-',
                            permissions: -1
                        })
                        res[0].validity = validity
                    }

                    return resolve(res[0])
                }

            }


        })
    }

}