<?php
class BlogModel extends CI_Model {
	public function __construct() {
		parent:: __construct();

		$this->load->database();
		$this->load->helper('common_helper');

		$this->table = 'blog_posts';
	}

	public function create($data) {
		$this->db->insert($this->table, $data);
	}

	public function delete($id) {
		$this->db->where('id', $id);
		$this->db->delete($this->table);
	}

	public function get($id) {
		$this->db->select('');
		$this->db->where('id', $id);
		$result = $this->db->get('blog_posts')->result_array();
	}

	public function getAll($where, $sort) {
		
	}

	public function search(
		$city_id,
		$just_count,
		$page = 0,
		$limit = 25
	) {
		$select = "b.city_id, b.date_created, b.date_updated, b.entry, b.id, title, l.city, l.state";

		if ($just_count) {
			$select = 'COUNT(*) AS count';
		}

		$this->db->select($select);

		if (!empty($city_id)) {
			$this->db->where('city_id', $city_id);
		}

		$this->db->join('locations l', 'b.city_id = l.id');

		if (!$just_count) {
			$start = $page*$limit;
			$this->db->limit($limit, $start);
		}

		$this->db->order_by('date_created DESC');
		$results = $this->db->get('blog_posts b')->result_array();

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
