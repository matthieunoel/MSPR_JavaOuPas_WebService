const uuidv1 = require('uuid/v1')
const fs = require('fs')
const fsPromise = require('fs').promises
const Database = require('better-sqlite3')

import { performance } from 'perf_hooks'
import { couldStartTrivia } from 'typescript'
import { Config } from '../app'
import { Utils } from '../utils'
import { IClient, IClientResult, IError, ILogin, ITokenResult, ITokenTestResponse, ITolenValidityResponse } from './root.interfaces'
import { Logger } from '../logSystem'

export class RootService {

    private logger: Logger = new Logger()

    public static async checkFolders() {

        try {
            fs.mkdirSync('./db/')
        } catch (error) {
            if (error.code !== 'EEXIST') {
                throw error
            }
        }

        try {
            fs.mkdirSync('./tmp/')
        } catch (error) {
            if (error.code !== 'EEXIST') {
                throw error
            }
        }

        try {
            fs.mkdirSync('./log/')
        } catch (error) {
            if (error.code !== 'EEXIST') {
                throw error
            }
        }

    }

    public static async initDB() {

        const perfStart = performance.now()
        const uuid: string = uuidv1()
        const logger: Logger = new Logger()

        try {

            logger.log(`initDB[${uuid.slice(0, 6)}] - ` + `Database initialisation.` + ` - (${performance.now() - perfStart}ms)`)

            const db = new Database(Config.dbName)
            let request: string = ''

            // Setting Token table
            request = 'CREATE TABLE IF NOT EXISTS token(id INTEGER PRIMARY KEY AUTOINCREMENT, token TEXT, permissions NUMERIC, expiration TEXT);'
            db.prepare(request).run()

            // Setting Promotion table
            request = 'CREATE TABLE IF NOT EXISTS promotion(codePromo TEXT PRIMARY KEY, libelle TEXT, sujet TEXT, description TEXT, valeurPromo NUMERIC, typePromo NUMERIC, dateDebut TEXT, dateFin TEXT, imgPath TEXT);'
            db.prepare(request).run()

            logger.log(`initDB[${uuid.slice(0, 6)}] - ` + `Table creation if don't exists executed successfully.` + ` - (${performance.now() - perfStart}ms)`)

            db.close()

            logger.log(`initDB[${uuid.slice(0, 6)}] - ` + `Process completed successfully.` + ` - (${performance.now() - perfStart}ms)`)

        } catch (error) {
            logger.error(`initDB[${uuid.slice(0, 6)}] - ` + error.toString() + ` - (${performance.now() - perfStart}ms)`)
            throw error
        }
    }

    public static cleanTokenTable() {
        const perfStart = performance.now()
        const uuid: string = uuidv1()
        const logger: Logger = new Logger()

        try {

            const db = new Database(Config.dbName)
            let request: string = `DELETE FROM token WHERE datetime(expiration) < datetime('now', 'localtime')`
            // datetime('now', 'localtime', '+${Config.tokenDuration} minutes'))
            db.prepare(request).run()

            db.close()

            logger.log(`cleanTokenTable[${uuid.slice(0, 6)}.] - ` + `Process completed successfully.` + ` - (${performance.now() - perfStart}ms)`)

        } catch (error) {
            logger.error(`cleanTokenTable[${uuid.slice(0, 6)}] - ` + error.toString() + ` - (${performance.now() - perfStart}ms)`)
            throw error
        }
    }

    public async getToken(login: string, password: string): Promise<ITokenResult> {

        const perfStart = performance.now()
        const uuid: string = uuidv1()

        return new Promise<ITokenResult>((resolve, reject) => {

            try {

                let loggedIn = false
                let authLevel = -1

                Config.loginList.forEach((item: ILogin, index) => {
                    if (item.login === login && item.password === password) {
                        loggedIn = true
                        authLevel = item.authLevel
                    }
                })

                if (loggedIn) {

                    const db = new Database(Config.dbName)
                    const token = uuidv1()
                    let request: string = `INSERT INTO token (token, permissions, expiration) VALUES ('${token}', ${authLevel}, datetime('now', 'localtime', '+${Config.tokenDuration} minutes'))`
                    db.prepare(request).run()

                    const perfEnd = performance.now() - perfStart
                    this.logger.log(`token[${uuid.slice(0, 6)}.] - ` + `Process completed successfully.` + ` - (${perfEnd}ms)`)
                    return resolve({
                        status: 'OK',
                        performanceMs: perfEnd,
                        token
                    })
                }
                else {
                    const perfEnd = performance.now() - perfStart
                    let errMsg = `The login or password is incorrect`
                    this.logger.error(`token[${uuid.slice(0, 6)}.] - ` + errMsg + ` - (${performance.now() - perfStart}ms)`)
                    return reject({
                        'status': 'KO',
                        'performanceMs': perfEnd,
                        'responseSize': 0,
                        'errors': [{
                            code: 11,
                            message: errMsg
                        }]
                    })
                }

            } catch (error) {
                const perfEnd = performance.now() - perfStart
                this.logger.error(`token[${uuid.slice(0, 6)}.] - ` + error.name + ' ' + error.message + ` - (${perfEnd}ms)`)
                return reject({
                    'status': 'KO',
                    'performanceMs': perfEnd,
                    'responseSize': 0,
                    'errors': [{
                        code: 10,
                        message: error.name + ' ' + error.message
                    }]
                })
            }


        })
    }

    // public async getClients(token: string, id: number, guid: string, first: string, last: string, street: string, city: string, zip: number): Promise<IClientResult> {

    //     const perfStart = performance.now()
    //     const uuid: string = uuidv1()

    //     return new Promise<IClientResult>(async (resolve, reject) => {

    //         try {

    //             const db = new Database(Config.dbName)
    //             let request: string = ''
    //             let conditions: string = ''
    //             let errors: IError[] = []

    //             if (Config.authentication) {
    //                 if (!(await Utils.testToken(token, 10, true))) {
    //                     const perfEnd = performance.now() - perfStart
    //                     let errMsg = `The token is invalid or don't have the right permissions.`
    //                     if (token === undefined) {
    //                         errMsg = `The token is missing.`
    //                     }
    //                     this.logger.error(`clients[${uuid.slice(0, 6)}.] - ` + errMsg + ` - (${performance.now() - perfStart}ms)`)
    //                     return reject({
    //                         'status': 'KO',
    //                         'performanceMs': perfEnd,
    //                         'responseSize': 0,
    //                         'errors': [{
    //                             code: 12,
    //                             message: errMsg
    //                         }]
    //                     })
    //                 }
    //             }

    //             if (isNaN(id) && id !== undefined) {
    //                 errors.push({
    //                     code: 21,
    //                     message: `La valeur passée via id n'est pas un nombre.`
    //                 })
    //             }
    //             if (isNaN(zip) && zip !== undefined) {
    //                 errors.push({
    //                     code: 27,
    //                     message: `La valeur passée via zip n'est pas un nombre.`
    //                 })
    //             }

    //             if (errors.length > 0) {
    //                 const perfEnd = performance.now() - perfStart
    //                 let errorMsg = ''
    //                 errors.forEach((item, index) => {
    //                     if (errorMsg === '') {
    //                         errorMsg = errors[index].message
    //                     }
    //                     else {
    //                         errorMsg += ', ' + errors[index].message
    //                     }
    //                 })
    //                 this.logger.error(`getClients[${uuid.slice(0, 6)}.] - ` + errorMsg + ` - (${performance.now() - perfStart}ms)`)
    //                 return reject({
    //                     'status': 'KO',
    //                     'performanceMs': perfEnd,
    //                     'responseSize': 0,
    //                     errors
    //                 })
    //             }

    //             request = 'SELECT * FROM client'

    //             if (id !== undefined) {
    //                 if (conditions === '') {
    //                     conditions = ` WHERE id=${id}`
    //                 }
    //                 else {
    //                     conditions += ` AND id=${id}`
    //                 }
    //             }
    //             if (guid !== undefined) {
    //                 if (conditions === '') {
    //                     conditions = ` WHERE guid='${Utils.formatStrForSQL(guid)}'`
    //                 }
    //                 else {
    //                     conditions += ` AND guid='${Utils.formatStrForSQL(guid)}'`
    //                 }
    //             }
    //             if (first !== undefined) {
    //                 if (conditions === '') {
    //                     conditions = ` WHERE first like '%${Utils.formatStrForSQL(first)}%'`
    //                 }
    //                 else {
    //                     conditions += ` AND first like '%${Utils.formatStrForSQL(first)}%'`
    //                 }
    //             }
    //             if (last !== undefined) {
    //                 if (conditions === '') {
    //                     conditions = ` WHERE last like '%${Utils.formatStrForSQL(last)}%'`
    //                 }
    //                 else {
    //                     conditions += ` AND last like '%${Utils.formatStrForSQL(last)}%'`
    //                 }
    //             }
    //             if (street !== undefined) {
    //                 if (conditions === '') {
    //                     conditions = ` WHERE street like '%${Utils.formatStrForSQL(street)}%'`
    //                 }
    //                 else {
    //                     conditions += ` AND street like '%${Utils.formatStrForSQL(street)}%'`
    //                 }
    //             }
    //             if (city !== undefined) {
    //                 if (conditions === '') {
    //                     conditions = ` WHERE city like '%${Utils.formatStrForSQL(city)}%'`
    //                 }
    //                 else {
    //                     conditions += ` AND city like '%${Utils.formatStrForSQL(city)}%'`
    //                 }
    //             }
    //             if (zip !== undefined) {
    //                 if (conditions === '') {
    //                     conditions = ` WHERE zip = ${zip}`
    //                 }
    //                 else {
    //                     conditions += ` AND zip = ${zip}`
    //                 }
    //             }

    //             request += conditions + ';'

    //             this.logger.log(`getClients[${uuid.slice(0, 6)}.] - ` + `Executing request : ${request}` + ` - (${performance.now() - perfStart}ms)`)

    //             let res: IClient[] = db.prepare(request).all()

    //             const perfEnd = performance.now() - perfStart
    //             this.logger.log(`getClients[${uuid.slice(0, 6)}.] - ` + `Process completed successfully.` + ` - (${perfEnd}ms)`)
    //             return resolve({
    //                 'status': 'OK',
    //                 'performanceMs': perfEnd,
    //                 'responseSize': res.length,
    //                 'response': res
    //             })

    //         }
    //         catch (error) {
    //             // throw error
    //             const perfEnd = performance.now() - perfStart
    //             this.logger.error(`getClients[${uuid.slice(0, 6)}.] - ` + error.name + ' ' + error.message + ` - (${perfEnd}ms)`)
    //             return reject({
    //                 'status': 'KO',
    //                 'performanceMs': perfEnd,
    //                 'responseSize': 0,
    //                 'errors': [{
    //                     code: 20,
    //                     message: error.name + ' ' + error.message
    //                 }]
    //             })
    //         }


    //     })


    // }

    async getLogs(token: string, paramUuid: string, all: boolean, dateStart: string, dateEnd: string) {

        const perfStart = performance.now()
        const uuid: string = uuidv1()

        return new Promise<string>(async (resolve, reject) => {
            try {

                if (Config.authentication) {
                    if (!(await Utils.testToken(token, 0, true))) {
                        const perfEnd = performance.now() - perfStart
                        let errMsg = `The token is invalid or don't have the right permissions.`
                        if (token === undefined) {
                            errMsg = `The token is missing.`
                        }
                        this.logger.error(`logs[${uuid.slice(0, 6)}.] - ` + errMsg + ` - (${performance.now() - perfStart}ms)`)
                        return reject({
                            'status': 'KO',
                            'performanceMs': perfEnd,
                            'responseSize': 0,
                            'errors': [{
                                code: 12,
                                message: errMsg
                            }]
                        })
                    }
                }

                let res: string = ''
                const month = await Utils.extendNumber(parseInt(('0' + (new Date(Date.now()).getMonth() + 1)).slice(-2), 10), 2)
                const year = await Utils.extendNumber(new Date(Date.now()).getFullYear(), 4)
                const actualLogPath: string = `./log/${year}-${month}.log`

                let logsList: string[] = []

                if (all) {

                    const files = await fsPromise.readdir('./log/')

                    for (let index = 0; index < files.length; index++) {
                        const file = files[index]
                        logsList.push(...(await fsPromise.readFile(`./log/${file}`)).toString().split('\r\n'))
                    }

                    this.logger.log(`logs[${uuid.slice(0, 6)}.] - ` + `Parameter "all" used succesfully` + ` - (${performance.now() - perfStart}ms)`)

                }
                else {

                    logsList.push(...(await fsPromise.readFile(actualLogPath)).toString().split('\r\n'))

                }

                if (paramUuid != undefined) {

                    const tmpList: string[] = logsList
                    logsList = []

                    for (let index = 0; index < tmpList.length; index++) {
                        const log = tmpList[index]
                        if (log.toString().includes(`[${paramUuid.slice(0, 6)}.]`)) {
                            logsList.push(log)
                        }
                    }

                    this.logger.log(`logs[${uuid.slice(0, 6)}.] - ` + `Parameters "guestId" or "uuid" used succesfully` + ` - (${performance.now() - perfStart}ms)`)

                }

                if (dateStart != undefined) {

                    const dateReference: Date = new Date(dateStart)

                    const tmpList: string[] = logsList
                    logsList = []

                    for (let index = 0; index < tmpList.length; index++) {
                        const log = tmpList[index]
                        const comparedDate: Date = new Date(tmpList[index].slice(6, 25).replace(' ', 'T'))
                        if (comparedDate >= dateReference) {
                            logsList.push(log)
                        }
                    }

                    this.logger.log(`logs[${uuid.slice(0, 6)}.] - ` + `Parameter "dateStart" used succesfully` + ` - (${performance.now() - perfStart}ms)`)

                }

                if (dateEnd != undefined) {

                    const dateReference: Date = new Date(dateEnd)

                    const tmpList: string[] = logsList
                    logsList = []

                    for (let index = 0; index < tmpList.length; index++) {
                        const log = tmpList[index]
                        const comparedDate: Date = new Date(tmpList[index].slice(6, 25).replace(' ', 'T'))
                        if (comparedDate <= dateReference) {
                            logsList.push(log)
                        }
                    }

                    this.logger.log(`logs[${uuid.slice(0, 6)}.] - ` + `Parameter "dateEnd" used succesfully` + ` - (${performance.now() - perfStart}ms)`)

                }

                if (logsList.length > 0) {

                    for (let index = 0; index < logsList.length; index++) {
                        const log = logsList[index]
                        if (log !== '') {
                            res += `${await Utils.extendNumber(index + 1, (logsList.length + 1).toString().split('').length)} - ${log}\r\n`
                        }
                    }

                } else {
                    res = 'There are no logs'
                }

                const perfEnd: number = performance.now() - perfStart
                this.logger.log(`logs[${uuid.slice(0, 6)}.] - ` + `Process completed successfully.` + ` - (${perfEnd}ms)`)

                return resolve(res)

            } catch (error) {

                this.logger.error(`logs[${uuid.slice(0, 6)}.] - ` + error.toString() + ` - (${performance.now() - perfStart}ms)`)
                return reject(`Erreur dans la lecture des logs : ${error.name} ${error.message}`)

            }
        })

    }

    public getTokenValidity(token: string) {
        const perfStart = performance.now()
        const uuid: string = uuidv1()

        return new Promise<ITolenValidityResponse>(async (resolve, reject) => {

            try {

                if (Config.authentication) {
                    const res: ITokenTestResponse = (await Utils.testToken(token, 10, false)) as ITokenTestResponse
                    if (Config.tokenDuration === 0) {
                        res.expiration = '-'
                    }
                    if (!res.validity) {
                        const perfEnd = performance.now() - perfStart
                        if (token === undefined) {
                            let errMsg = `The token is missing.`
                            this.logger.error(`getClients[${uuid.slice(0, 6)}.] - ` + errMsg + ` - (${performance.now() - perfStart}ms)`)
                            return reject({
                                'status': 'KO',
                                'performanceMs': perfEnd,
                                'responseSize': 0,
                                'errors': [{
                                    code: 12,
                                    message: errMsg
                                }]
                            })
                        }
                        else {
                            return resolve({
                                'status': 'OK',
                                'performanceMs': perfEnd,
                                'responseSize': 1,
                                'response': [{
                                    'validity': false,
                                    'deathDate': new Date(res.expiration)
                                }]
                            })
                        }
                    }
                    else {
                        const perfEnd = performance.now() - perfStart
                        this.logger.log(`getTokenValidity[${uuid.slice(0, 6)}.] - ` + `Process completed successfully.` + ` - (${perfEnd}ms)`)
                        return resolve({
                            'status': 'OK',
                            'performanceMs': perfEnd,
                            'responseSize': 1,
                            'response': [{
                                'validity': true,
                                'deathDate': new Date(res.expiration)
                            }]
                        })
                    }
                }
                else {
                    const perfEnd = performance.now() - perfStart
                    this.logger.log(`getTokenValidity[${uuid.slice(0, 6)}.] - ` + `Process completed successfully.` + ` - (${perfEnd}ms)`)
                    return resolve({
                        'status': 'OK',
                        'performanceMs': perfEnd,
                        'responseSize': 1,
                        'response': [{
                            'validity': true,
                            'deathDate': '-'
                        }]
                    })
                }
            }
            catch (error) {
                // throw error
                const perfEnd = performance.now() - perfStart
                this.logger.error(`getClients[${uuid.slice(0, 6)}.] - ` + error.name + ' ' + error.message + ` - (${perfEnd}ms)`)
                return reject({
                    'status': 'KO',
                    'performanceMs': perfEnd,
                    'responseSize': 0,
                    'errors': [{
                        code: 20,
                        message: error.name + ' ' + error.message
                    }]
                })
            }


        })
    }

}
