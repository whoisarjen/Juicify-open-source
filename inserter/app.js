const fs = require("fs");
const { Client } = require('pg')
const { v4 } = require('uuid')

const client = new Client({
  user: '',
  host: '',
  database: '',
  password: '',
  port: 5432,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 0,
})
client.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});
const lastIndex = 610420
fs.readFile("products.json", async (err, data) => {
  if (err) throw err;
  let products = JSON.parse(data);

  const date = new Date().toISOString()
  const l = products.length
  for (let i = lastIndex + 1; i < l; i++) {
    let failed = false
    if (!products[i].user_ID && !products[i].checkMe && !products[i].deleted) {
      // console.log(JSON.stringify([products[i].name, products[i].p || 0, products[i].c || 0, products[i].s || 0, products[i].f || 0, products[i].fi || 0, products[i].na || 0, products[i].ethanol || 0, products[i].code || 0, products[i].v || false, date, date, false, false]))
      await client.query(
        `INSERT INTO products_product("id","name","proteins","carbs","sugar","fats","fiber","sodium","ethanol","barcode","is_verified","created_at","updated_at", "is_deleted", "is_expecting_check") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [v4(), products[i].name, products[i].p?.toFixed(0) || 0, products[i].c?.toFixed(0) || 0, products[i].s?.toFixed(0) || 0, products[i].f?.toFixed(0) || 0, products[i].fi?.toFixed(0) || 0, products[i].na?.toFixed(0) || 0, products[i].ethanol?.toFixed(0) || 0, products[i].code || 0, products[i].v || false, date, date, false, false]
      )
        .catch((err) => {
          failed = true
          console.log('catch', err)
        })
      console.log(i, 'left:', l - i, 100 - ((l - i) / l * 100), "%")
      console.log('index: ', i)
      // if (failed) break
    }
  }
});