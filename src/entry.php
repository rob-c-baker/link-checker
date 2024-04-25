#!/usr/bin/env php
<?php declare(strict_types=1);

require dirname(__DIR__).'/vendor/autoload.php';

use alanrogers\linkchecker\app\Commands\CrawlSite;
use alanrogers\linkchecker\app\Commands\ProcessCrawl;
use Symfony\Component\Console\Application;

(function() {

    $app = new Application();

    $app->add(new CrawlSite());
    $app->add(new ProcessCrawl());

    $app->run();

})();
