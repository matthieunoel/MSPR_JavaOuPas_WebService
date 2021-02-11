export interface IVoiceRootResult {
    status: string,
    performanceMs: number,
    responseSize: number,
    response?: any[]
    errors?: any[]
}