const whois = require('whois')

export class WhoisService {
    private domain: string
    private response?: { [key: string]: string } = null

    constructor (domain: string) {
        this.domain = domain
    }

    async fetch (): Promise<void> {
        return new Promise((resolve, reject) => {
            whois.lookup(this.domain, (err, data) => {
                if (err) {
                    reject(new Error(`Could not check ${this.domain} against WHOIS`))
                } else if (data) {
                    this.response = {}
                    const lines = data.split('\n')
                    for (const line of lines) {
                        const colonIndex = line.indexOf(':')
                        const name = line.substring(0, colonIndex)
                        const value = line.substring(colonIndex + 1)
                        this.response[name] = value ? value.trim() : undefined
                    }
                }

                resolve()
            })
        })
    }

    getData (): { [key: string]: string } {
        return this.response
    }
}
