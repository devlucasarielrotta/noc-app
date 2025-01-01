import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log.repository";

interface CheckServiceUseCase {
    execute(url:string):Promise<boolean>;
}
type SuccessCallback = (() => void) | undefined ;
type ErrorCallback = ((error:string) => void) | undefined;

export class CheckServiceMultiple implements CheckServiceUseCase {

    constructor(
        private readonly logRepository: LogRepository[],
        private readonly successCallback: SuccessCallback,
        private readonly errorCallback: ErrorCallback,
        
    ){

    }

    private callLogs (log:LogEntity){
        this.logRepository.forEach(logRepository => {
            logRepository.saveLog(log);
        })
    }

    public async execute(url:string):Promise<boolean>{

        try{
            const req = await fetch(url);
            if(!req.ok){
                throw new Error(`Error on check service ${url}`)
            }
            const log = new LogEntity({
                level: LogSeverityLevel.low,
                message: `Service ${url} working`,
                origin: 'check-service.ts',
            });

            this.callLogs(log);
            this.successCallback && this.successCallback() ;
            return true;
        }catch(error){

            const erorMessage= `${error}`;
            const log = new LogEntity({
                level: LogSeverityLevel.high,
                message: erorMessage,
                origin: 'check-service.ts',
            });
            this.callLogs(log);
            this.errorCallback && this.errorCallback(erorMessage)
            return false;
        }
        
    }
}