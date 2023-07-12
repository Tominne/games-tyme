import express from 'express'
import request from 'superagent'
const app = express()
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { configDotenv } from 'dotenv'
import 'dotenv/config'
//import { process } from 'dotenv'
dotenv.config()

app.get('/api/weather/:location', async (req, res) => {
  try {
  const location = req.params.location
  const callback = req.query.callback
  const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${location}`
  if (!process.env.API_KEY || !process.env.API_HOST) {
    res.status(500).json({ error: 'API key or host not defined' })
    return
  }
  const response = await request
    .get(url)
    .set('x-rapidapi-key', process.env.API_KEY)
    .set('x-rapidapi-host', process.env.API_HOST)
  res.header('Content-type', 'application/javascript')
  res.send(`${callback}(${response.body})`)
  } catch(error) {
    console.log(error)
    res.send(`There was an error`)
  }
})

export default app
