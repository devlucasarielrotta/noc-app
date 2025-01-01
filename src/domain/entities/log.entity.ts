export enum LogSeverityLevel {
    low     = 'low',
    medium  = 'medium',
    high    = 'high'
}
export interface LogEntityOptions {
     level: LogSeverityLevel;
     message: string;
     origin: string;
     createdAt?: Date;
 
}
export class LogEntity {
    public level: LogSeverityLevel;
    public message: string;
    public createdAt: Date;
    public origin: string;

    constructor(options:LogEntityOptions){
        const {message,level,origin, createdAt = new Date()} = options;
        this.message = message;
        this.level = level;
        this.origin = origin
        this.createdAt = createdAt;
    }

    static fromJson = (json:string ):LogEntity => {
        json = (json === '') ? '{}' : json;
        const {level,message,createdAt,origin}=JSON.parse(json);

        if(!message) throw new Error('Message is required');
        const log = new LogEntity({
            createdAt,
            message,
            level,
            origin
        });
        

        return log;
    }

    static fromObject = (object: {[key:string]:any}):LogEntity => {
        const {message,level,createdAt,origin} = object;
        const log = new LogEntity({
            level,message,origin,createdAt
        })
        return log;
    }
}