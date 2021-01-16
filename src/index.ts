import { TechSEO } from './classes/techseo'

if (!process.argv[2]) {
    throw new Error('Missing url')
}

const techSeo = new TechSEO(process.argv[2])
techSeo.test()
    .then(async () => {
        console.log(techSeo.results())
    })
