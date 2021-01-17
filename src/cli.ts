import { Litic } from './classes/litic'
import { ArgumentParser } from 'argparse'
import * as fs from 'fs'

const parser = new ArgumentParser({ description: 'Perform technical SEO analysis to your website.' })

parser.add_argument('-u', '--url', { help: 'URL to run the tests against', required: true })
parser.add_argument('-k', '--keyword', { help: 'Keyword to run content check against' })

const args = parser.parse_args()

const litic = new Litic(args.url, args)
litic.test()
    .then(async () => {
        if (litic.didFail()) {
            // eslint-disable-next-line
            console.error('There was a problem running your tests')
        } else {
            // eslint-disable-next-line
            console.log(litic.getResults())
        }
    })
