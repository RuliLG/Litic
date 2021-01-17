import { TechSEO } from './classes/techseo'
import { ArgumentParser } from 'argparse'
import * as fs from 'fs'
const pkg = JSON.parse(fs.readFileSync('../package.json').toString())

const parser = new ArgumentParser({ description: pkg.description })

parser.add_argument('-v', '--version', { action: 'version', version: pkg.version })
parser.add_argument('-u', '--url', { help: 'URL to run the tests against', required: true })
parser.add_argument('-k', '--keyword', { help: 'Keyword to run content check against' })

const args = parser.parse_args()

const techSeo = new TechSEO(args.url, args)
techSeo.test()
    .then(async () => {
        if (techSeo.didFail()) {
            // eslint-disable-next-line
            console.error('There was a problem running your tests')
        } else {
            // eslint-disable-next-line
            console.log(techSeo.getResults())
        }
    })
