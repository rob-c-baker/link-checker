<?php declare(strict_types=1);

namespace rbaker\linkchecker\app\Services;
use Sentry\SentrySdk;
use Sentry\State\HubInterface;
use function Sentry\init;

class Sentry
{
    private HubInterface $hub;

    public function __construct()
    {
        init([
            'dsn' => $_SERVER['SENTRY_DSN']
        ]);

        $this->hub = SentrySdk::getCurrentHub();
    }

    public function report(string $message): void
    {
        $this->hub->captureMessage($message);
    }
}