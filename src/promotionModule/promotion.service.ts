import { Logger } from '../logSystem'
import { IPromotion, IPromotionRootResult } from './promotion.interfaces'
import { performance } from 'perf_hooks'
import { Config } from '../app'
import { RootService } from '../root/root.service'
import { Utils } from '../utils'

const uuidv1 = require('uuid/v1')
const Database = require('better-sqlite3')

export class PromotionService {

    public reqPromotions(token: string, codePromo: string): Promise<IPromotionRootResult> {

        const perfStart = performance.now()
        const uuid: string = uuidv1()
        const logger: Logger = new Logger()

        return new Promise<IPromotionRootResult>(async (resolve, reject) => {

            try {

                // --

                const db = new Database(Config.dbName)
                let res: IPromotion[] = []
                let request: string

                if (codePromo != null) {

                    if (Config.authentication) {
                        if (!(await Utils.testToken(token, 2, true))) {
                            const perfEnd = performance.now() - perfStart
                            let errMsg = `The token is invalid or don't have the right permissions.`
                            if (token === undefined) {
                                errMsg = `The token is missing.`
                            }
                            logger.error(`reqPromotions[${uuid.slice(0, 6)}.] - ` + errMsg + ` - (${performance.now() - perfStart}ms)`)
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

                    request = `SELECT * FROM promotion WHERE codePromo = '${codePromo}';`

                    console.log('codePromo :', codePromo)

                }
                else {

                    if (Config.authentication) {
                        if (!(await Utils.testToken(token, 1, true))) {
                            const perfEnd = performance.now() - perfStart
                            let errMsg = `The token is invalid or don't have the right permissions.`
                            if (token === undefined) {
                                errMsg = `The token is missing.`
                            }
                            logger.error(`reqPromotions[${uuid.slice(0, 6)}.] - ` + errMsg + ` - (${performance.now() - perfStart}ms)`)
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

                    request = 'SELECT * FROM promotion;'


                }

                const reqRes: IPromotion[] = db.prepare(request).all()

                for (let promotion of reqRes) {
                    // promotion.img = promotion.imgPath
                    promotion.img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABrUlEQVRYR+2XzUrDQBSFz7TgD4XiD6JLQREtdSG4sAsfQOk7aZdCX8FV8QWkvoGL7kRJzcJNAtIWWmqtWlS0IxGnppnJZGYaycbZ5t57vnvuJNwQJHyIqT61ix0Ai14+2aoa1zFKpHaRcuAUA5KrZnQb0gIQCgcUdd1QAlARDnauCiIFMBHWBREC0PpBDql0XXeesvgwRziAOLoOBSGpLNk8f/I/HwH8qbDkoo4AmpU8ncrOYmFjOU7nuVq1UweFsjXSHQNg0Su7q7FDeMLsRALECeIX1gaYBEQkbAygA9Kq9+HUutIRKo9AVGVmPoO5tSWhgKxrf8JEACI3VIUnHoGobeda/4WJxQEmmywABZybJB1IGoBSwE3SgX+AeB042z7EkF7o3GkTAP83wNPiNqJmJf8JIKUC8vEO3NsqkQBJD/f3Tm4vuZ0xLN1bUKJKvw6A1l1UFMYWEGUAFigDeekBbTccIGi3KFLpv8BLFIH020C3wZdVEWZZygAiRx4awGP7F0BH2Bjgxw1v8usdF3jufZc6LpStUvRt4CO0HfCXuDrKv+2UrGkTYZbzBapd0iFRB/DCAAAAAElFTkSuQmCC'
                    promotion.imgPath = undefined
                    res.push(promotion)
                }

                // let res = ['Vous êtes bien dans le module des Promotions.']

                // --

                const perfEnd = performance.now() - perfStart
                logger.log(`reqPromotions[${uuid.slice(0, 6)}.] - ` + `Process completed successfully.` + ` - (${perfEnd}ms)`)
                return resolve({
                    'status': 'OK',
                    'performanceMs': perfEnd,
                    'responseSize': res.length,
                    'response': res
                })


            }
            catch (error) {
                // throw error
                const perfEnd = performance.now() - perfStart
                logger.error(`reqPromotions[${uuid.slice(0, 6)}.] - ` + error.name + ' ' + error.message + ` - (${perfEnd}ms)`)
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