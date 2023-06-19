import express from 'express'
const app = express()
import request from 'superagent'
import dotenv from 'dotenv'
dotenv.config()

const apiKey = process.env.apiKey
const hostKey = process.env.hostKey

app.get('/config', (req: any, res: any) => {
  res.json({
    apiKey: process.env.apiKey,
  })
})

const weather = {
  method: 'GET',
  apiKey,
  hostKey,
}
