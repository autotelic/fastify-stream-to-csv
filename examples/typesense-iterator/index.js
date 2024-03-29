/* eslint-disable camelcase */
const { Readable } = require('stream')

const Typesense = require('typesense')

const { fastifyStreamToCsv } = require('../../')

const client = new Typesense.Client({
  nodes: [{
    host: 'localhost',
    port: '8108',
    protocol: 'http'
  }],
  apiKey: 'supersecretapikey',
  connectionTimeoutSeconds: 2
})

// async generator we can turn into a Readable
async function * searchPager () {
  let total, shown
  let page = 1
  const per_page = 5

  do {
    const searchResults = await client.collections('books')
      .documents()
      .search({
        q: 'harry potter',
        query_by: 'title',
        sort_by: 'ratings_count:desc',
        page,
        per_page
      })
    const {
      found,
      hits
    } = searchResults
    total = found
    shown = page * per_page
    page = page + 1

    // we want to yield each hit to be a csv row
    for (const hit of hits) {
      yield hit
    }
  } while (shown < total)
}

module.exports = async function csv (fastify, options) {
  fastify.register(fastifyStreamToCsv)

  fastify.get('/book-report', async function report (req, reply) {
    // create a readable stream from our search pager
    const readStream = Readable.from(searchPager())

    // create a row formatter
    const rowFormatter = hit => {
      const {
        document: {
          title,
          authors
        }
      } = hit
      return [title, authors]
    }

    // these are fast-csv format options
    const csvOptions = {
      delimiter: '\t',
      headers: ['title', 'authors']
    }

    // use reply decorator
    reply
      .header('Content-disposition', 'attachment; filename=typesense-example.csv')
      .streamToCsv(readStream, rowFormatter, { csvOptions })

    return reply
  })
}
