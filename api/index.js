const express = require('express')
const  cors  = require('cors') 

const app = express()
app.use(cors())

const port = 3000

const operations = [
  {
    "activeSelect": "BTC/USDT",
    "shortLongInput": "long",
    "investmentInput": "100",
    "commissionInput": "0",
    "entrancePriceInput": "95000",
    "exitPriceInput": "103000",
    "entryDateInput": "2025-02-28",
    "exitDateInput": "2025-06-20",
    "operationId": 1
  },
  {
    "activeSelect": "ETH/USDT",
    "shortLongInput": "long",
    "investmentInput": "100",
    "commissionInput": "0",
    "entrancePriceInput": "95000",
    "exitPriceInput": "103000",
    "entryDateInput": "2025-02-28",
    "exitDateInput": "2025-06-20",
    "operationId": 2
  }
]


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/operations', (req, res) => {
  res.send(operations)
})

app.get('/operations/:id', (req, res) => {
  const operationId = req.params.id
  const selectedOperation = operations.filter(trasaction => trasaction.operationId == operationId)
  res.send(selectedOperation)
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})