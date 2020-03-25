<?php
class BikeModel extends CI_Model {
	public function __construct() {
		parent:: __construct();

		$this->load->database();
		$this->load->helper('common_helper');

		$this->table = 'bikes';
	}

	public function create($data) {
		$this->db->insert($this->table, $data);
	}

	public function get($id) {
		$this->db->select('');
		$this->db->where('id', $id);
		$result = $this->db->get('bikes')->result_array();
	}

	public function getAll($sort = null) {
		$this->db->select('id, description, image, name');
		// $this->db->join('locations l', 'fl.id = l.location_id');
		$results = $this->db->get('bikes b')->result_array();
		return $results;
	}

	public function search(
		$just_count,
		$page = false,
		$limit = 25
	) {
		$select = "id, description, image, name";

		if ($just_count) {
			$select = 'COUNT(*) AS count';
		}

		$this->db->select($select);
		// $this->db->join('locations l', 'fl.location_id = l.id');

		if (!$just_count) {
			$limit = 25;
			$start = $page*$limit;
			$this->db->limit($limit, $start);
		}

		$results = $this->db->get('bikes b')->result_array();

		if ($just_count) {
			return $results[0]['count'];
		}

		return $results;
	}

	public function update($id, $data, $tags) {
		$this->db->where('id', $id);
		$this->db->update('blog_posts', $data);

		if ($tags) {
			
		}
	}
}
