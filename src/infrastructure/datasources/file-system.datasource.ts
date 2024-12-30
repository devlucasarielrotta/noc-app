import fs from 'fs';
import { LogDatasource } from "../../domain/datasources/log.datasource";
import { LogSeverityLevel, LogEntity } from "../../domain/entities/log.entity";


export class FileSystemDatasource implements LogDatasource{

    private readonly logPath        = 'logs/'
    private readonly allLogsPath    = 'logs/logs-low.log'
    private readonly mediumLogsPath = 'logs/logs-medium.log'
    private readonly errorLogsPath  = 'logs/logs-high.log'


    constructor(){
        this.createLogsFiles();
    }

    private createLogsFiles = () => {
        if(!fs.existsSync(this.logPath)){
            fs.mkdirSync(this.logPath)
        }

        [this.allLogsPath,this.mediumLogsPath,this.errorLogsPath].forEach( path => {
            if(fs.existsSync(path)) return;
            fs.writeFileSync(path,'')
        })
    }
    private getLogsFromFile = (path:string): LogEntity[] => {
        const content = fs.readFileSync(path,'utf-8');
        const stringLogs = content.split('\n').map(
            log => LogEntity.fromJson(log) 
        )

        return stringLogs
    }

    async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
        switch(severityLevel){
            case LogSeverityLevel.low:
                return this.getLogsFromFile(this.allLogsPath);

            case LogSeverityLevel.medium:
                return this.getLogsFromFile(this.mediumLogsPath);

            case LogSeverityLevel.high:
                return this.getLogsFromFile(this.errorLogsPath);

            default:
                throw new Error(`${severityLevel} not implemented`)
        }
    }

    async saveLog(newLog: LogEntity): Promise<void> {
        const logAsJson = `${JSON.stringify(newLog)} \n`
        fs.appendFileSync(this.allLogsPath, logAsJson)

        if(newLog.level === LogSeverityLevel.low) return ;

        if(newLog.level === LogSeverityLevel.medium){
            fs.appendFileSync(this.mediumLogsPath, logAsJson)
        }else{
            fs.appendFileSync(this.errorLogsPath, logAsJson)
        }

    }
}