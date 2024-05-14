<?php declare(strict_types=1);

namespace alanrogers\linkchecker\app\Services;

use alanrogers\linkchecker\app\Exceptions\InvalidFile;

class CrawlProcessor
{
    private array $errors = [];

    private array $broken_links = [];

    public function __construct(
        private readonly string $filename,
        private readonly Sentry $sentry
    ) {}

    /**
     * @throws InvalidFile
     */
    public function process(): bool
    {
        $f = fopen($this->filename, 'r');
        if ($f === false) {
            throw new InvalidFile('File does not exist or is not readable.');
        }

        $line = 0;
        $errors = 0;

        // Each line is a separate JSON file
        while ($json_data = fgets($f)) {

            $line++;

            $data = json_decode($json_data, true);
            if ($data === null) {
                $errors++;
                $this->addError('Invalid JSON.', $line);
                continue;
            }

            $this->processJSONData($data);
        }

        return $errors === 0;
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public function addError(string $error, int $line=0, bool $report=false): void
    {
        $err = sprintf(
            '[%d] %s',
            $line,
            $error
        );
        $this->errors[] = $err;
        if ($report) {
            $this->sentry->report($err);
        }
    }

    private function processJSONData(array $data): void
    {
        $source_url = (string) $data['request']['source'];
        $target_url = (string) $data['request']['endpoint'];
        $status     = (int) $data['response']['status_code'];

        if ($status === 200) {
            // OK - link worked
            return;
        }

        $this->addBrokenLink($source_url, $target_url, $status);
    }

    private function addBrokenLink(string $source_url, string $target_url, int $status): void
    {
        $this->broken_links[] = [
            $source_url,
            $target_url,
            $status
        ];
    }

    public function getBrokenLinks(): array
    {
        return $this->broken_links;
    }

    public function brokenLinkCSVHeader(): array
    {
        return [
            'Source',
            'Target',
            'Status'
        ];
    }

    public function formatBrokenLinkReport(array $link): string
    {
        return sprintf(
            '[%d] Source: %d || Target: %s',
            $link[2] ?? 0,
            $link[0] ?? '[Unknown]',
            $link[1] ?? '[Unknown]'
        );
    }
}