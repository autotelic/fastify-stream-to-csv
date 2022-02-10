# Examples

## Basic

A basic example with a Readable stream created from an array.

- `cd examples/basic`
- `fastify start -l info -p 3001 -w index.js`
- browse to http://localhost:3001/report
- `basic-example.csv` will be downloaded

## Typesense

An example using an async generator to page through paginated Typesense results

- `cd examples/typesense-iterator`
- `docker compose up` to start Typesense
- initialize the Typesense client as described
[here](https://typesense.org/docs/guide/building-a-search-application.html#initializing-the-client)
with the api key `supersecretapikey`
- if it's a fresh image, create the collection & insert documents as described
[here](https://typesense.org/docs/guide/building-a-search-application.html#creating-a-books-collection)
(you can use curl as per the "Shell" example)
- `fastify start -l info -p 3002 -w index.js`
- browse to http://localhost:3001/book-report
- `typesense-example.csv` will be downloaded
