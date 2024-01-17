import { Elysia, t } from 'elysia'

import { Database } from "bun:sqlite";

const DB = new Database("mydb.sqlite", { create: true })
DB.query(
  `CREATE TABLE IF NOT EXISTS MESSAGES(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message TEXT
);`
).run()

const app = new Elysia()

app.get('/', () => {
  const query = DB.query(`SELECT * FROM MESSAGES;`)
  const result = query.all()

  return new Response(JSON.stringify({ messages: result }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  })
})

app.post(
  '/add',
  (req) => {
    const message = req.body.message
    const query = DB.query(`INSERT INTO MESSAGES (message) VALUES (?1)`)
    query.run(message)

    return new Response(JSON.stringify({ message: "Added" }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })
  }, {
    body: t.Object({
      message: t.String()
    })
  })

app.listen(8000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
