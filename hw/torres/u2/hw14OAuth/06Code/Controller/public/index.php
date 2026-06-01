<?php
declare(strict_types=1);

use App\Support\DatabaseConnection;
use App\Support\JsonResponder;
use Dotenv\Dotenv;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../src/bootstrap.php';

if (is_file(__DIR__ . '/../.env')) {
    Dotenv::createImmutable(__DIR__ . '/..')->safeLoad();
}

date_default_timezone_set($_ENV['APP_TIMEZONE'] ?? 'America/Bogota');

(new DatabaseConnection())->boot();
$responder = new JsonResponder();

$app = AppFactory::create();
$app->addBodyParsingMiddleware();
$app->addRoutingMiddleware();
$app->addErrorMiddleware(($_ENV['APP_DEBUG'] ?? 'false') === 'true', true, true);

$app->options('/{routes:.*}', static function (Request $request, Response $response) use ($responder): Response {
    return $responder->cors($response, $request->getHeaderLine('Origin'));
});

$app->add(static function (Request $request, RequestHandler $handler) use ($responder): Response {
    $response = $handler->handle($request);
    return $responder->cors($response, $request->getHeaderLine('Origin'));
});

(require __DIR__ . '/../routes/api.php')($app, $responder);

$app->run();
