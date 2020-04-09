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
		$this->db->select('id, description, image, name, visible');
		$this->db->where('id', $id);
		$result = $this->db->get('bikes')->result_array();
		if (empty($result)) {
			return false;
		}

		return $result[0];
	}

	public function getAll($sort = null) {
		$this->db->select('id, description, image, name, visible');
		$results = $this->db->get('bikes b')->result_array();
		return $results;
	}

	public function search(
		$visible,
		$just_count,
		$page = 0,
		$limit = 25
	) {
		$select = "id, id AS bike_id, description, image, name, visible";

		if ($just_count) {
			$select = 'COUNT(*) AS count';
		}

		$this->db->select($select);
		$this->db->where('visible', 1);

		if (!$just_count) {
			$start = $page*$limit;
			$this->db->limit($limit, $start);
		}

		$results = $this->db->get('bikes b')->result_array();

		if ($just_count) {
			return $results[0]['count'];
		}

		return $results;
	}

	public function update($id, $data) {
		$this->db->where('id', $id);
		$this->db->update($this->table, $data);
	}
}
