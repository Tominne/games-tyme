import request from 'superagent'

const url = 'https://weatherapi-com.p.rapidapi.com/current.json?q=53.1%2C-0.13'

export async function getWeather() {
  try {
    const response = await fetch('/config')
    const result = await response.json()
    const apiKey = result.apiKey
    console.log(result)
  } catch (error) {
    return 'no weather at all'
  }
}
