<?php declare(strict_types=1);

namespace rbaker\linkchecker\app\Exceptions;

use Exception;
use Symfony\Component\Console\Exception\ExceptionInterface;

class InvalidURL extends Exception implements ExceptionInterface
{

}