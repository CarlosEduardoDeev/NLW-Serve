import express from "express"
import { PrismaClient }  from "@prisma/client"
import { convertHoursInStringToMinutes } from "./utils/convert-hours-string-to-minuts"
import { convertMinutesInStringToHours } from "./utils/convert-minutes-string-to-hours"
import cors from 'cors'

const app = express()
app.use(cors())

app.use(express.json())
const prisma = new PrismaClient({
    log:['query']
})

app.get('/games',  async(req, res) => {
    const games =  await prisma.game.findMany({
            include:{
                _count:{
                    select:{
                        Ads:true
                    }
                }
            }
    })
    return res.json(games)
})
app.post('/games/:id/ads', async (req, res) => {
    const gameId = req.params.id
    const body = req.body
    
    const result = await prisma.ad.create({
        data:{
            gameId,
            name: body.name,
            yearsPlaying:body.yearsPlaying,
            discord:body.discord,
            weekDays:body.weekDays.join(','),
            hourStart: convertHoursInStringToMinutes(body.hourStart),
            hourEnd:convertHoursInStringToMinutes(body.hourEnd),
            useVoiceChannel:body.useVoiceChannel,
            
        }
    })

    return res.status(201).json(result)
})

app.get("/games/:id/ads",async (req, res) => {

    const gameId = req.params.id

    const result = await prisma.ad.findMany({
        select:{
            id:true,
            name:true,
            weekDays:true,
            useVoiceChannel:true,
            yearsPlaying:true,
            hourStart:true,
            hourEnd:true,
        },
        where:{
            gameId,
        },
        orderBy:{
            createdAt:'desc'
        }
    })
    return res.json(result.map(ad =>{
        return{
            ...ad,
            weekDays:ad.weekDays.split(','),
            hourStart:convertMinutesInStringToHours(ad.hourStart),
            hourEnd:convertMinutesInStringToHours(ad.hourEnd), 
        }
    }))
})

app.get("/ads/:id/discord", async (req, res) => {
    const adId = req.params.id

    const result = await prisma.ad.findUnique({
        where:{
            id:adId
        },
        select:{
            discord:true
        }
    })
    return res.json(result)

})

app.listen(3000)
