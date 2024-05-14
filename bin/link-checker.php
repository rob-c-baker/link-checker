#!/usr/bin/env php
<?php declare(strict_types=1);

// Entry point for Link Checker

require dirname(__DIR__) . '/vendor/autoload.php';

define('BASE_PATH', dirname(__DIR__));

use alanrogers\linkchecker\app\Commands\CrawlSite;
use alanrogers\linkchecker\app\Commands\ProcessCrawl;
use Symfony\Component\Console\Application;

// .env files
Dotenv\Dotenv::createImmutable(dirname(__DIR__))->safeLoad();

(function() {

    $app = new Application();

    $app->add(new CrawlSite());
    $app->add(new ProcessCrawl());

    $app->run();

})();
