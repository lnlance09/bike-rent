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

	public function getAll($where, $sort) {
		
	}

	public function update($id, $data, $tags) {
		$this->db->where('id', $id);
		$this->db->update('blog_posts', $data);

		if ($tags) {
			
		}
	}
}
