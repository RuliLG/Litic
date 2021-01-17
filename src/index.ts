import { TechSEO } from './classes/techseo'

const { ArgumentParser } = require('argparse')
const { version, description } = require('../package.json')

const parser = new ArgumentParser({ description })

parser.add_argument('-v', '--version', { action: 'version', version })
parser.add_argument('-u', '--url', { help: 'URL to run the tests against', required: true })
parser.add_argument('-k', '--keyword', { help: 'Keyword to run content check against' })

const args = parser.parse_args()

const techSeo = new TechSEO(args['url'], args)
techSeo.test()
    .then(async () => {
        if (techSeo.didFail()) {
            console.error('There was a problem running your tests')
        } else {
            console.log(techSeo.getResults())
        }
    })
