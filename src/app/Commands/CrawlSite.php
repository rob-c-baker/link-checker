<?php declare(strict_types=1);

namespace alanrogers\linkchecker\app\Commands;

use alanrogers\linkchecker\app\Exceptions\InvalidURL;
use alanrogers\linkchecker\app\Services\Sentry;
use InvalidArgumentException;
use RuntimeException;
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
    private Sentry $sentry;

    /**
     * @throws InvalidURL
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $url = $input->getArgument('url');
        if (!$url || filter_var($url, FILTER_VALIDATE_URL) === false) {
            throw new InvalidURL('Invalid URL');
        }

        try {
            $check_robots = (bool) $input->getOption('check-robots-txt');
        } catch (InvalidArgumentException) {
            $check_robots = false;
        }

        $output_sub_path = $input->getOption('output-path');
        if (!$output_sub_path) {
            $output_sub_path = parse_url($url, PHP_URL_HOST);
        }

        // path on docker container volume (see docker-compose.yml)
        $output_path = 'output/' . $output_sub_path . '/';

        // ensure the path exists:
        if (!is_dir($output_path)) {
            if (!mkdir($output_path, 0755, true)) {
                throw new RuntimeException(sprintf('Unable to create directory: %s', $output_path));
            }
        }

        $html_file = $output_path . 'report.html';
        $json_file = $output_path . 'output.json';
        $text_file = $output_path . 'output.txt';

        $katana_command = sprintf(
            'docker compose run --remove-orphans --build crawler --url=%s --output-html-report=%s --output-json-file=%s --output-text-file=%s',
            escapeshellarg($url),
            escapeshellarg($html_file),
            escapeshellarg($json_file),
            escapeshellarg($text_file),
        );

        // robots.txt state
        $katana_command .= $check_robots ? '' : ' --ignore-robots-txt';

        passthru($katana_command, $result);

        if ($result === 0) {
            $output->writeln('Crawl files created here: ' . $output_path . '...');
            $output->writeln('HTML:  ' . $html_file);
            $output->writeln('JSON:  ' . $json_file);
            $output->writeln('TEXT:  ' . $text_file);
            return  Command::SUCCESS;
        }

        $output->writeln('An error occurred: ' . $result);

        return Command::FAILURE;
    }

    protected function configure(): void
    {
        $this->sentry = new Sentry(); // @todo init

        $this->addArgument(
            'url',
            InputArgument::REQUIRED,
            'The URL to crawl.'
        );

        $this->addOption(
            'output-path',
            'op',
            InputOption::VALUE_OPTIONAL,
            'The directory to write the JSON, HTML and TXT output reports to. Will be a sub-directory of ./output.'
        );

        $this->addOption(
            'check-robots-txt',
            'cr',
            InputOption::VALUE_OPTIONAL,
            'Whether to check the robots.txt file.',
        );
    }
}