<?php declare(strict_types=1);

namespace alanrogers\linkchecker\app\Commands;

use alanrogers\linkchecker\app\Exceptions\InvalidURL;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'crawl:site',
    description: 'Crawl supplied website and writes a JSON report to storage.'
)]
class CrawlSite extends Command
{
    /**
     * @throws InvalidURL
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $url = $input->getArgument('url');
        if (!$url || filter_var($url, FILTER_VALIDATE_URL) === false) {
            throw new InvalidURL('Invalid URL');
        }

        $output_filename = $input->getOption('output-file');
        if (!$output_filename) {
            $output_filename = parse_url($url, PHP_URL_HOST) . '.json';
        }

        $output_path = '/crawl-data/' . $output_filename;

        $katana_command = sprintf(
            'docker compose run katana -u %s -j -omit-raw -omit-body > %s',
            escapeshellarg($url),
            escapeshellarg($output_path)
        );

        exec($katana_command, $output, $result);

        return $result === 0 ? Command::SUCCESS : Command::FAILURE;
    }

    protected function configure(): void
    {
        $this->addArgument(
            'url',
            InputArgument::REQUIRED,
            'The URL to crawl.'
        );

        $this->addOption(
            'output-file',
            'of',
            InputOption::VALUE_OPTIONAL,
            'The file to write the JSON output to - defaults to [hostname].json.'
        );
    }
}