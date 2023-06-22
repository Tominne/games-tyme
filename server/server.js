import express from 'express'
const app = express()
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { configDotenv } from 'dotenv'
import { process } from 'dotenv'
dotenv.config()

app.get('/api/weather/:location', async (req, res) => {
  const location = req.params.location
  const callback = req.query.callback
  const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${location}`
  if (!process.env.API_KEY || !process.env.API_HOST) {
    res.status(500).json({ error: 'API key or host not defined' })
    return
  }
  const response = await fetch(url, {
    headers: {
      'x-rapidapi-key': process.env.API_KEY,
      'x-rapidapi-host': process.env.API_HOST,
    },
  })
  const data = await response.json()
  res.header('Content-type', 'application/javascript')
  res.send(`${callback}(${JSON.stringify(data)})`)
})

app.listen(3002, () => {
  console.log('Server listening on port 3002')
})
