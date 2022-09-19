<?php

require './lib/DBService.php';

class RequestProcessor
{
    /**
     * @var DBService
     */
    protected $dbservice;

    public function __construct()
    {
        $this->dbservice = new DBService();
    }

    public function addJokeToFavorites($data)
    {
        $this->dbservice->dbConnect();

        return $this->dbservice->insertInto('favorites', 'created_at, value, url, updated_at, icon_url, joke_id, categories' ,[
            $data['created_at'], $data['value'], $data['url'], $data['updated_at'], $data['icon_url'], $data['id'], json_encode($data['categories'])
        ]);
    }

    public function getFavorites()
    {
        $this->dbservice->dbConnect();
        return $this->dbservice->selectAll('favorites');
    }

    public function deleteFavorite($id)
    {
        $this->dbservice->dbConnect();
        return $this->dbservice->deleteByField('favorites', 'joke_id', $id);
    }

    public function addLike($id)
    {
        $this->dbservice->dbConnect();
        return $this->dbservice->insertInto('likes', 'joke_id', [$id]);
    }

    public function deleteLike($id)
    {
        $this->dbservice->dbConnect();
        return $this->dbservice->deleteByField('likes', 'joke_id', $id);
    }

    public function getLikes()
    {
        $this->dbservice->dbConnect();
        $data = $this->dbservice->selectAllField('likes', 'joke_id');
        $result = [];

        foreach ($data as $like) {
            $result[] = $like['joke_id'];
        }

        return $result;
    }
}