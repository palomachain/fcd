import * as apidoc from 'apidoc-core'
import * as path from 'path'
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'fs'
import * as yargs from 'yargs'

import config from 'config'

import { apiLogger as logger } from 'lib/logger'

const templateDir = './apidoc-template/'
const templateName = 'index.html'

const options = {
  simulate: true,
  src: path.join(__dirname, '..', 'controller'),
  silent: true
}

const packageInfo = {
  name: 'Paloma FCD',
  version: '1.0.0',
  description: 'Paloma FCD API Docs',
  title: 'Paloma FCD API Docs',
  url: `${config.FCD_URI}/v1` || 'https://fcd.palomachain.com/v1'
}

type UrlItem = {
  type: string
  url: string
  title: string
  name: string
  group: string
}

type ApiDoc = {
  data: string
  project: string
}
;(async function generateApiDoc() {
  const argv = await yargs.options({
    o: {
      type: 'string',
      alias: 'output',
      default: 'static',
      description: 'Output file name'
    }
  }).argv

  apidoc.setLogger(logger)
  apidoc.setPackageInfos(packageInfo)

  const parsedDoc: ApiDoc = apidoc.parse(options)
  const dest = path.join(__dirname, '..', '..', argv.o)

  if (!existsSync(dest)) {
    mkdirSync(dest)
  }

  const template = path.join(__dirname, '..', '..', templateDir, templateName)
  const outputFile = path.join(dest, templateName)
  console.log(template)
  console.log(outputFile)
  writeFileSync(
    outputFile,
    readFileSync(template)
      .toString()
      .replace('__API_DATA__', parsedDoc.data)
      .replace('__API_PROJECT__', parsedDoc.project)
  )
})()
