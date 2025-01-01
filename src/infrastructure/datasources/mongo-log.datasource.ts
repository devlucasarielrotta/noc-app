import { LogModel } from "../../data/mongo/models/log.model";
import { LogDatasource } from "../../domain/datasources/log.datasource";
import { LogSeverityLevel, LogEntity } from "../../domain/entities/log.entity";

export class MongoLogDatasource implements LogDatasource{

    
    async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
        const logs = await LogModel.find({
            level: severityLevel
        });

        return logs.map(LogEntity.fromObject)
    }

    async saveLog(log: LogEntity): Promise<void> {
        const newLog = await LogModel.create(log);
        console.log('mongo log created', newLog.id);
    }
}