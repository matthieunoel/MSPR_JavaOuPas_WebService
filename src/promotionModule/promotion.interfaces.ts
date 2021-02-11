export interface IPromotionRootResult {
    status: string,
    performanceMs: number,
    responseSize: number,
    response?: any[]
    errors?: any[]
}

export interface IPromotion {
    codePromo: string,
    libelle: string,
    sujet: string,
    description: string,
    valeurPromo: number,
    typePromo: number,
    imgPath?: string,
    img?: string
}