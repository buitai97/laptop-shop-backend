import app from '.'

const port = Number(process.env.PORT ?? 3000)
app.listen(port, () => {
  console.log(`Local: http://localhost:${port}`)
})