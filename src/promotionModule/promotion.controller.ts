import { Get, Res, ContentType, JsonController, QueryParam, Post, BodyParam } from 'routing-controllers'
import { Response } from 'express'
import { PromotionService } from './promotion.service'
import bodyParser = require('body-parser')
import { Logger } from '../logSystem'
import { IPromotion, IPromotionRootResult } from './promotion.interfaces'

const fs = require('fs')

@JsonController()
export class PromotionController {

    private logger: Logger = new Logger()

    constructor(
        private promotionService: PromotionService
    ) { }


    // @Post('/print')
    // async print(
    //     @UploadedFile('file', { options: { limits: { fieldSize: 1024 * 1024 * 1024 }, required: true } }) file: any,
    //     @BodyParam('first', { required: true }) first: string,
    //     @BodyParam('last', { required: true }) last: string,
    //     @BodyParam('top', { required: true }) top: string,
    //     @BodyParam('host', { required: true }) host: string,
    //     @BodyParam('corp', { required: true }) corp: string
    // ): Promise<IResult> {
    //     this.logger.reqLog('Request at "/print"')
    //     const form: IPrint = { first, last, file, top, corp, host }
    //     const durationMs = await this.rootService.print(form)
    //     return {
    //         status: 'ok',
    //         durationMs
    //     }
    // }


    // var bodyParser = require('body-parser');
    // app.use(bodyParser.json()); // support json encoded bodies
    // app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

    // // With body-parser configured, now create our route. We can grab POST 
    // // parameters using req.body.variable_name

    // // POST http://localhost:8080/api/books
    // // parameters sent with 
    // app.post('/api/books', function(req, res) {
    //     var book_id = req.body.id;
    //     var bookName = req.body.token;
    //     //Send the response back
    //     res.send(book_id + ' ' + bookName);
    // });


    @ContentType('application/json')
    @Get('/promotion')
    GETpromotion(
        @QueryParam('token', { required: false }) token: string,
        @QueryParam('codePromo', { required: false }) codePromo: string
    ): Promise<IPromotionRootResult> {
        this.logger.reqLog(`Request GET at "/promotion". Parameters are : {token: ${token}, codePromo: ${codePromo}}`)
        return this.promotionService.reqPromotions(token, codePromo)
    }

    @ContentType('application/json')
    @Post('/promotion')
    async POSTpromoton(
        @BodyParam('token', { type: 'application/*+json' }) token: string,
        @BodyParam('promotions', { type: 'application/*+json' }) promotions: IPromotion[]
    ): Promise<IPromotionRootResult> {
        this.logger.reqLog(`Request POST at "/promotion". Parameters are : {token: ${token}}`)
        return this.promotionService.reqAddPromotions(token, promotions)
    }

}