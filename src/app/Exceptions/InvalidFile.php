<?php declare(strict_types=1);

namespace rbaker\linkchecker\app\Exceptions;

use Exception;
use Symfony\Component\Console\Exception\ExceptionInterface;

class InvalidFile extends Exception implements ExceptionInterface
{

}