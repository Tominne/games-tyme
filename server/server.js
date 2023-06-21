import express from 'express'
const app = express()
import dotenv from 'dotenv'
import fetch from 'node-fetch'
dotenv.config()

app.get('/api/weather/:location', async (req, res) => {
  const location = req.params.location
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
    mode: 'no-cors',
  })
  const data = await response.json()
  res.header('Access-Control-Allow-Origin', '*')
  res.json(data)
})

app.listen(3001, () => {
  console.log('Server listening on port 3000')
})
/*app.get('/config', (req: any, res: any) => {
  res.json({
    apiKey: process.env.apiKey,
  })
})

const weather = {
  method: 'GET',
  apiKey,
}
*/
