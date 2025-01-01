import 'dotenv/config'
import { Server } from "./presentation/server";
import { MongoDatabase } from './data/mongo/init';
import { envs } from './config/plugins/envs.plugin';
import { LogModel } from './data/mongo/models/log.model';
import { PrismaClient } from '@prisma/client';

(async () => {

    await MongoDatabase.connect({dbName: envs.MONGO_DB_NAME,mongoUrl:envs.MONGO_URL})
    const newLog = await LogModel.create({
        message: 'Test messagesa desde Mongo',
        origin:  'app.ts',
        level:   'low'
    })
    const prisma = new PrismaClient();
    const prismaLog = await prisma.logModel.create({
        data: {
            level: 'HIGH',
            message: 'Test message ',
            origin: 'App.ts'
        }
    })
    console.log(prismaLog)
    await newLog.save();
    // main();
})()


function main(){
    Server.start()
  
    
}