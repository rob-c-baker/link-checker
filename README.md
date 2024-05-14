# Link Checker

## Usage

```shell
chmod +x ./link-checker.sh
./link-checker.sh [params here]
```

## Examples

### Crawl a site

```shell
./link-checker.sh crawl:site [url]
```

### Process a crawled site

```shell
./link-checker.sh crawl:process tmp/[hostname from url].json
```