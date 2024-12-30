import { CheckService } from "../domain/use-cases/checks/check-service";
import { SendEmailLogs } from "../domain/use-cases/email/send-logs";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository";
import { CronService } from "../presentation/cron/cron-service";
import { EmailService } from "./email.service";
const fileSystemLogRepository = new LogRepositoryImpl( new FileSystemDatasource())

export class Server {
    public static  start(){
        const emailService = new EmailService( );
        // emailService.sendEmailWithFileSystemLogs(
        //      ['lucas.ariel.rotta@gmail.com'],
        // )
        new SendEmailLogs(
            emailService,
            fileSystemLogRepository
        ).execute(['lucas.ariel.rotta@gmail.com']);
        console.log('server started....');
        CronService.createJob(
            '*/5 * * * * *',
            () => {
                new CheckService(
                    fileSystemLogRepository,
                    () => console.log('succes'),
                    (error) => console.log(error)
                ).execute('https://google.com')
            }
        )
    }
}