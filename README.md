# fastify-stream-to-csv

Stream CSVs from Fastify routes. Uses [fast-csv](https://c2fo.github.io/fast-csv/) for formatting.

## Installation

```sh
npm i -S @autotelic/fastify-stream-to-csv
```

## Usage

```js
const { fastifyStreamToCsv } = require('@autotelic/fastify-stream-to-csv')

const fastify = Fastify()

fastify.register(fastifyStreamToCsv)

fastify.get('/report', async function (req, reply) {
  // create a readable stream
  const readStream = Readable.from(Array.from(Array(100000).keys()))

  // create a row formatter
  const rowFormatter = num => {
    return [`a${num}`, `b${num}`, `c${num}`]
  }

  // these are fast-csv format options
  const csvOptions = {
    delimiter: '\t',
    headers: ['a', 'b', 'c']
  }

  // use reply decorator
  await reply
    .header('Content-disposition', 'attachment; filename=basic-example.csv')
    .streamToCsv(readStream, rowFormatter, { csvOptions })

  return reply
}
```

## Github Actions/Workflows

* Trigger the release workflow via release tag

  ```sh
  git checkout main && git pull
  npm version { minor | major | path }
  git push --follow-tags
  ```
