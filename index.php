<?php
try {

    require './lib/RequestProcessor.php';

    if ($_SERVER['REQUEST_URI'] === '/') {
        require './lib/pages/main.php';
    }

    $requestProcessor = new RequestProcessor();

    /** Add joke to favorites */
    if ($_SERVER['REQUEST_URI'] === '/joke/favorites' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        $result = $requestProcessor->addJokeToFavorites($data);

        die(json_encode([
            'result' => $result
        ]));
    }

    /** Add joke to favorites */
    if ($_SERVER['REQUEST_URI'] === '/joke/favorites' && $_SERVER['REQUEST_METHOD'] === 'GET') {
        $result = $requestProcessor->getFavorites() ?? [];

        foreach ($result as $index => $joke) {
            $result[$index]['id'] = $joke['joke_id'];
            $result[$index]['categories'] = json_decode($joke['categories']);
            unset($result[$index]['joke_id']);
        }

        die(json_encode($result));
    }

    /** Add joke to favorites */
    if ($_SERVER['REQUEST_URI'] === '/joke/favorites' && $_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        $result = $requestProcessor->deleteFavorite($data['id']);

        die(json_encode([
            'result' => $result
        ]));
    }

    /** Add joke to favorites */
    if ($_SERVER['REQUEST_URI'] === '/joke/like' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        $result = $requestProcessor->addLike($data['id']);

        die(json_encode([
            'result' => $result
        ]));
    }

    /** Add joke to favorites */
    if ($_SERVER['REQUEST_URI'] === '/joke/like' && $_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        $result = $requestProcessor->deleteLike($data['id']);

        die(json_encode([
            'result' => $result
        ]));
    }

    /** Add joke to favorites */
    if ($_SERVER['REQUEST_URI'] === '/joke/likes' && $_SERVER['REQUEST_METHOD'] === 'GET') {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        $result = $requestProcessor->getLikes();

        die(json_encode($result));
    }

} catch (Exception $exception) {
    die($exception->getMessage());
}