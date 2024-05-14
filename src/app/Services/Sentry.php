<?php declare(strict_types=1);

namespace alanrogers\linkchecker\app\Services;
use Sentry\SentrySdk;
use Sentry\State\HubInterface;
use function Sentry\init;

class Sentry
{
    private HubInterface $hub;

    public function __construct()
    {
        init([
            'dsn' => $_SERVER['SENTRY_DSN'] ?? 'https://e4e7d905a85c6845b49a7d2dd98a4910@sentry.alanrogers.com/9'
        ]);

        $this->hub = SentrySdk::getCurrentHub();
    }

    public function report(string $message): void
    {
        $this->hub->captureMessage($message);
    }
}