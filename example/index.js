const g2j = require('../dist')
const fs = require('fs')
const fp = require('path')

async function main() {
  const filename = fp.join(__dirname, 'example.graphql')
  const schemaText = fs.readFileSync(filename, 'utf-8')
  const jsonSchema = await g2j.parseGraphQL(schemaText, filename)
  console.log(JSON.stringify(jsonSchema, null, 2))
}

main()
