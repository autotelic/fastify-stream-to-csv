import { Readable } from 'stream'

import { FormatterOptionsArgs } from '@fast-csv/format'
import type { FastifyPluginCallback } from 'fastify'

export interface StreamToCsvOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  csvOptions?: FormatterOptionsArgs<any, any>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RowFormatterFunction = (row: any) => any[]

declare module 'fastify' {
  interface FastifyReply {
    streamToCsv(
      readStream: Readable,
      rowFormatter: RowFormatterFunction,
      options?: StreamToCsvOptions
    ): void
  }
}

declare const fastifyStreamToCsv: FastifyPluginCallback<StreamToCsvOptions>

export default fastifyStreamToCsv
export { fastifyStreamToCsv }
