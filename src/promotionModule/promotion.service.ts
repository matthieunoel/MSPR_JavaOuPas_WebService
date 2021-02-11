import { Logger } from '../logSystem'
import { IPromotion, IPromotionRootResult } from './promotion.interfaces'
import { performance } from 'perf_hooks'
import { Config } from '../app'
import { RootService } from '../root/root.service'
import { Utils } from '../utils'

const uuidv1 = require('uuid/v1')
const Database = require('better-sqlite3')

export class PromotionService {

    public reqPromotions(token: string): Promise<IPromotionRootResult> {

        const perfStart = performance.now()
        const uuid: string = uuidv1()
        const logger: Logger = new Logger()

        return new Promise<IPromotionRootResult>(async (resolve, reject) => {

            try {

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

                // --

                const db = new Database(Config.dbName)
                const request: string = 'SELECT * FROM promotion;'
                const res: IPromotion[] = db.prepare(request).all()

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