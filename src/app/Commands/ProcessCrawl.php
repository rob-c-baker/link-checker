<?php declare(strict_types=1);

namespace rbaker\linkchecker\app\Commands;

use rbaker\linkchecker\app\Exceptions\InvalidFile;
use rbaker\linkchecker\app\Services\CrawlProcessor;
use rbaker\linkchecker\app\Services\Sentry;
use DateTime;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'crawl:process',
    description: 'Processes a report generated by the `crawl:site` command.'
)]
class ProcessCrawl extends Command
{
    private Sentry $sentry;

    /**
     * @throws InvalidFile
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $input_file = $input->getArgument('file');
        if (!$input_file) {
            throw new InvalidFile('Invalid file');
        }

        $output_file = $input->getArgument('output-file');
        $output_to_stdout = (bool) $input->getOption('output-to-stdout');

        $processor = new CrawlProcessor($input_file, $this->sentry);

        $result = $processor->process();
        $errors = $processor->getErrors();

        if ($errors) {
            // dump errors to a file
            $error_file = $input->getOption('error-file');
            file_put_contents($error_file, implode("\r\n", $errors));
        }

        $broken = $processor->getBrokenLinks();

        if ($broken) {

            $f = null;
            if ($output_file) {
                $f = fopen($output_file, 'w');
                fputcsv($f, $processor->brokenLinkCSVHeader(), ',', '"', '\\', "\r\n");
            }

            // write to file AND / OR stdout
            foreach ($broken as $link) {
                if ($f) {
                    fputcsv($f, $link, ',', '"', '\\', "\r\n");
                }
                if ($output_to_stdout) {
                    $output->writeln($processor->formatBrokenLinkReport($link));
                }

            }
        }

        return $result ? Command::SUCCESS : Command::FAILURE;
    }

    protected function configure(): void
    {
        $this->sentry = new Sentry();

        $this->addArgument(
            'input-file',
            InputArgument::REQUIRED,
            'The file containing the JSON data to process.'
        );

        $this->addArgument(
            'output-file',
            InputArgument::OPTIONAL,
            'The file report data will be written to.'
        );

        $this->addOption(
            'error-file',
            'ef',
            InputOption::VALUE_OPTIONAL,
            'The file errors will be written to.',
            'errors-' . (new DateTime())->format('Y-m-d-H-i-s') . '.txt'
        );

        $this->addOption(
            'output-to-stdout',
            'os',
            InputOption::VALUE_OPTIONAL,
            'Whether to write output to stdout.',
            true
        );
    }
}