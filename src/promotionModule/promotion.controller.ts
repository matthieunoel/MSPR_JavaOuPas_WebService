import { Get, Res, ContentType, JsonController, QueryParam } from 'routing-controllers'
import { Response } from 'express'
import { PromotionService } from './promotion.service'
import bodyParser = require('body-parser')
import { Logger } from '../logSystem'
import { IPromotionRootResult } from './promotion.interfaces'

const fs = require('fs')

@JsonController()
export class PromotionController {

    private logger: Logger = new Logger()

    constructor(
        private promotionService: PromotionService
    ) { }

    @ContentType('application/json')
    @Get('/promotion')
    root(
        @QueryParam('token', { required: false }) token: string,
        @QueryParam('codePromo', { required: false }) codePromo: string
    ): Promise<IPromotionRootResult> {
        this.logger.reqLog(`Request at "/promotion". Parameters are : {token: ${token}, codePromo: ${codePromo}}`)
        return this.promotionService.reqPromotions(token, codePromo)
    }

}