# Litic
JS library to perform technical SEO and best practices analysis to your projects.

> Note: This tool functionality relies on Google Lighthouse. It's such a great tool to test your web projects!

## Install

Just run the npm install command:

```bash
npm i litic -g
```

After the installation, you can use it via:

```bash
litic -u "https://example.com/test-url" -k "my keyword" -o "output.csv"
```

## Tests
Litic currently analyses your website against 45 different tests, divided by category:

Category|Test name
---|----
Performance | HTTP/2
Performance | Server Response Time
Performance | Largest Contentful Paint
Performance | Cumulative Layout Shift
Performance | First Contentful Paint
Performance | Time to Interactive
Performance | HTML Minification
Performance | Minified CSS
Performance | Minified JS
Performance | Optimized caching strategy
Performance | Uses Text Compression
Performance | Reduced DOM Size
Performance | Lazy-load offscreen images
Robots | Page is crawlable
Accessibility | Jump to Main Content
Accessibility | Matching HTML Language
Accessibility | Color Contrast
Accessibility | Image Alternative Text
Accessibility | Appropiate size for tap targets
Accessibility | Font size is greater than 12px
Best Practices | HTML is valid
Best Practices | Console errors
Best Practices | &lt;!DOCTYPE html&gt;
Best Practices | &lt;html&gt; has [lang] attribute
Best Practices | Apple Touch Icon
Best Practices | Javascript Links
Best Practices | Empty Anchor Links
Meta-tags | &lt;meta charset="utf-8"&gt; is used
Meta-tags | &lt;meta name="viewport"&gt; is correctly used
Meta-tags | &lt;title&gt; tag is present
Meta-tags | meta[name="description"]
Meta-tags | Canonical URL is defined
Meta-tags | Document has a valid hreflang
Content | Heading structure
Content | Content Width
Content | Text Readability
Content | Keywords (Text Rank)
Content | BERT Score
Security | No plain text emails
Security | HTTPS
Security | HTTPS Redirection
Security | External links use [rel="noopener"] or [rel="noreferrer"]
Security | Protect against MIME Sniffing
Security | Protect against Clickjacking
Other | Domain expiration

Each test comes with a description, and most of them will also offer you a link with more information.

## Usage

To use Litic, you can just run an analysis with `litic -u "https://your-url.com/"`. The results of this analysis will be printed on your console:

![Litic screenshot](https://user-images.githubusercontent.com/3358390/105087404-5011c900-5a92-11eb-87bc-7954584ae7f8.png)

Additionally, you can also use other parameters, such as `-o` to specify the path where you want to store the results, or `-k` to specify a keyword to run content checks against.

Short name | Long name | Description | Required
---|---|---|---
-u|--url|URL to run the tests against|Yes
-k|--keyword|Keyword to run content checks against|No
-o|--output|Output path for a CSV file with the results|No

## Running remote
If running under a low-resource environment, you can run the lighthouse analysis using [Google PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started).
To do this, you just need to set the `PAGESPEED_TOKEN` environment variable to your API token, and Litic will use it to perform the remote analysis.

```bash
PAGESPEED_TOKEN={YOUR_TOKEN} litic -u "https://example.com"
```

## Smart tests
There are a few tests that rely on [Silver Diamond](https://silverdiamond.io) to execute. To use them, please register and set an environment variable named `SD_KEY` to your api key.

```bash
SD_KEY={API_KEY} litic -u "https://example.com"
```

## Roadmap
There are a lot of tests I want to include in Litic, as well as making it possible to provide a list of URLs (or even an excel with tons of URLs) and run the tests against each one of them.

## Contributions
Please, feel free to contribute to this repository, making pull requests or opening new issues.

## License
Copyright © 2021 Raúl López and contributors

Licensed under the MIT license, see LICENSE for details.
