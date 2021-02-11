import { Logger } from "../logSystem"
import { IVoiceRootResult } from "./voice.interfaces"
import { performance } from 'perf_hooks'
import { couldStartTrivia } from 'typescript'
import { Config } from '../app'
import { Utils } from '../utils'
import { exception } from "console"

const uuidv1 = require('uuid/v1')

export class VoiceService {

    // Ok, l'idée c'est former une url pour translate.google.com avec le text, les langues et tout.
    // Ensuite, avec Puppeteer on record la video, on clique sur le bouton du haut parleur
    // On arrête l'enregistrement
    // On prends juste le son de la video
    // On renvoie le son sous le bon format en tant que res



    public reqVoice(): Promise<IVoiceRootResult> {
        // return {
        //     module: 'Voice',
        //     help: 'Parameters : token, lang, text'
        // }

        // ---

        const perfStart = performance.now()
        const uuid: string = uuidv1()
        const logger: Logger = new Logger()

        return new Promise<IVoiceRootResult>(async (resolve, reject) => {

            try {

                let res = ['Vous êtes bien dans le module voice.']

                const perfEnd = performance.now() - perfStart
                logger.log(`getClients[${uuid.slice(0, 6)}.] - ` + `Process completed successfully.` + ` - (${perfEnd}ms)`)
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
                logger.error(`getClients[${uuid.slice(0, 6)}.] - ` + error.name + ' ' + error.message + ` - (${perfEnd}ms)`)
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

        // ---

    }

}