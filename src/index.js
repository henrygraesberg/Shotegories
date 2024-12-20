import express from 'express'
import dotenv from 'dotenv'
import fs from 'node:fs'
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
dotenv.config()

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

app.get('/index_html.css', (req, res) => {
  res.sendFile(__dirname + '/css/index_html.css')
})

app.get('/index_html.js', (req, res) => {
  res.sendFile(__dirname + '/js/index_html.js')
})

app.get('/api', (req, res) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  try {
    const categories = fs.readFileSync(__dirname + '/data/categories.json')

    const parsed = JSON.parse(categories)

    const category = parsed[Math.floor(Math.random() * parsed.length)]

    const letter = req.query.withLetter == "true" ? alphabet[Math.floor(Math.random() * alphabet.length)] : null

    if (letter) {
      res.send({
        category: category,
        letter: letter
      })
    } else {
      res.send({
        category: category
      })
    }
  } catch (err) {
    res.status(500).send({
      message: "There was an error reading the categories file.",
      errorStack: err
    })
  }
})

app.get("*", (req, res) => {
  res.status(404).sendFile(__dirname + '/views/404.html')
})

const httpPort = process.env.HTTP_PORT || 3000

app.listen(httpPort, () => {
  console.log(
    `Server is running at:      http://localhost:${httpPort}`
  )
  console.log(
    `API endpoint at:           http://localhost:${httpPort}/api`
  )
})
