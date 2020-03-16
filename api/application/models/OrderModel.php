<?php
class OrderModel extends CI_Model {
	public function __construct() {
		parent:: __construct();
	}

	public function create($title, $entry, $tags) {
		$this->db->insert('blog_posts', [
			'title' => $title,
			'entry' => $entry
		]);
	}

	public function get($id) {
		$this->db->select('');
		$this->db->where('id', $id);
		$result = $this->db->get('blog_posts')->result_array();
	}

	public function getAll($where, $sort) {
		
	}

	public function update($id, $data, $tags) {
		$this->db->where('id', $id);
		$this->db->update('blog_posts', $data);

		if ($tags) {
			// $this->tags->insertTags($id, $tags, 'fallacy', $userId);
		}
	}
}
