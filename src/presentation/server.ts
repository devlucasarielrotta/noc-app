import { CheckService } from "../domain/use-cases/checks/check-service";
import { CheckServiceMultiple } from "../domain/use-cases/checks/check-service-multiple";
import { SendEmailLogs } from "../domain/use-cases/email/send-logs";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { MongoLogDatasource } from "../infrastructure/datasources/mongo-log.datasource";
import { PostgresLogDatasource } from "../infrastructure/datasources/postgres.log.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository";
import { CronService } from "../presentation/cron/cron-service";
import { EmailService } from "./email.service";
const fileSystemLogRepository = new LogRepositoryImpl( new FileSystemDatasource())
const mongoLogRepository = new LogRepositoryImpl(new MongoLogDatasource())
const postgresLogRepository = new LogRepositoryImpl(new PostgresLogDatasource())
export class Server {
    public static  start(){
        const emailService = new EmailService( );
        // emailService.sendEmailWithFileSystemLogs(
        //      ['lucas.ariel.rotta@gmail.com'],
        // )
        new SendEmailLogs(
            emailService,
            mongoLogRepository
        ).execute(['lucas.ariel.rotta@gmail.com']);
        console.log('server started....');
        CronService.createJob(
            '*/5 * * * * *',
            () => {
                new CheckServiceMultiple(
                    [mongoLogRepository,fileSystemLogRepository,postgresLogRepository],
                    () => console.log('succes'),
                    (error) => console.log(error)
                ).execute('https://google.com')
            }
        )
    }
}