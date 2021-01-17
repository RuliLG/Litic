import * as lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'

export class LighthouseService {
    static shared?: LighthouseService = undefined
    private url: string
    private report?: object = undefined

    private constructor (url: string) {
        this.url = url
    }

    static get (url: string) {
        if (!LighthouseService.shared) {
            LighthouseService.shared = new LighthouseService(url)
        }

        return LighthouseService.shared
    }

    async run (): Promise<void> {
        if (this.report) {
            return
        }

        const chrome = await chromeLauncher.launch({
            chromeFlags: ['--headless']
        })
        const options = {
            output: 'json',
            onlyAudits: [
                'is-on-https',
                'redirects-http',
                'first-contentful-paint',
                'largest-contentful-paint',
                'first-meaningful-paint',
                'speed-index',
                'estimated-input-latency',
                'total-blocking-time',
                'max-potential-fid',
                'cumulative-layout-shift',
                'errors-in-console',
                'server-response-time',
                'first-cpu-idle',
                'interactive',
                'critical-request-chains',
                'redirects',
                'apple-touch-icon',
                'content-width',
                'image-aspect-ratio',
                'image-size-responsive',
                'preload-fonts',
                'deprecations',
                'mainthread-work-breakdown',
                'bootup-time',
                'uses-rel-preload',
                'uses-rel-preconnect',
                'font-display',
                'network-requests',
                'network-rtt',
                'network-server-latency',
                'main-thread-tasks',
                'metrics',
                'performance-budget',
                'timing-budget',
                'resource-summary',
                'third-party-summary',
                'third-party-facades',
                'largest-contentful-paint-element',
                'layout-shift-elements',
                'long-tasks',
                'no-unload-listeners',
                'non-composited-animations',
                'unsized-images',
                'valid-source-maps',
                'preload-lcp-image',
                'full-page-screenshot',
                'accesskeys',
                'aria-allowed-attr',
                'aria-command-name',
                'aria-hidden-body',
                'aria-hidden-focus',
                'aria-input-field-name',
                'aria-meter-name',
                'aria-progressbar-name',
                'aria-required-attr',
                'aria-required-children',
                'aria-required-parent',
                'aria-roles',
                'aria-toggle-field-name',
                'aria-tooltip-name',
                'aria-treeitem-name',
                'aria-valid-attr-value',
                'aria-valid-attr',
                'button-name',
                'bypass',
                'color-contrast',
                'definition-list',
                'dlitem',
                'document-title',
                'duplicate-id-active',
                'duplicate-id-aria',
                'form-field-multiple-labels',
                'frame-title',
                'heading-order',
                'html-has-lang',
                'html-lang-valid',
                'image-alt',
                'input-image-alt',
                'label',
                'link-name',
                'list',
                'listitem',
                'meta-refresh',
                'meta-viewport',
                'object-alt',
                'tabindex',
                'td-headers-attr',
                'th-has-data-cells',
                'valid-lang',
                'video-caption',
                'uses-long-cache-ttl',
                'total-byte-weight',
                'offscreen-images',
                'render-blocking-resources',
                'unminified-css',
                'unminified-javascript',
                'unused-css-rules',
                'unused-javascript',
                'uses-webp-images',
                'uses-optimized-images',
                'uses-text-compression',
                'uses-responsive-images',
                'efficient-animated-content',
                'duplicated-javascript',
                'legacy-javascript',
                'appcache-manifest',
                'doctype',
                'charset',
                'dom-size',
                'external-anchors-use-rel-noopener',
                'geolocation-on-start',
                'inspector-issues',
                'no-document-write',
                'no-vulnerable-libraries',
                'js-libraries',
                'notification-on-start',
                'password-inputs-can-be-pasted-into',
                'uses-http2',
                'uses-passive-event-listeners',
                'meta-description',
                'http-status-code',
                'font-size',
                'link-text',
                'crawlable-anchors',
                'is-crawlable',
                'robots-txt',
                'tap-targets',
                'hreflang',
                'plugins',
                'canonical'
            ],
            port: chrome.port
        }

        const runnerResult = await lighthouse(this.url, options)
        this.report = JSON.parse(runnerResult.report).audits

        await chrome.kill()
    }

    getReport () {
        return this.report
    }

    reset () {
        this.report = undefined
    }
}