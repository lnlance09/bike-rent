<?php
class ReviewModel extends CI_Model {
	public function __construct() {
		parent:: __construct();

		$this->load->database();
		$this->load->helper('common_helper');

		$this->table = 'store_reviews';
	}

	public function checkIfExists($id) {
		$this->db->select("COUNT(*) AS count");
		$this->db->where('id', $id);
		$result = $this->db->get($this->table)->result();
		if ($result[0]->count == 0) {
			return false;
		}
		return true;
	}

	public function create($data) {
		$this->db->insert($this->table, $data);
	}

	public function delete($id) {
		$this->db->where('id', $id);
		$this->db->delete($this->table);
	}

	public function get($id) {
		$this->db->select('sr.comment, sr.date_created, sr.id, sr.rating, sr.store_id, sr.user_id');
		$this->db->where('sr.id', $id);
		$result = $this->db->get('store_reviews sr')->result_array();
		if (empty($result)) {
			return false;
		}

		return $result[0];
	}

	public function search(
		$store_id,
		$user_id,
		$just_count,
		$page = 0,
		$limit = 25
	) {
		$select = "sr.comment, sr.date_created, sr.id, sr.rating, sr.store_id, sr.user_id";
		$select .= ", s.name AS store_name";
		$select .= ", u.name AS user_name, CASE
					WHEN u.img IS NOT NULL THEN CONCAT('".S3_PATH."', u.img)
				END AS user_img";

		if ($just_count) {
			$select = 'COUNT(*) AS count';
		}

		$this->db->select($select);
		$this->db->join('stores s', 'sr.store_id = s.id');
		$this->db->join('users u', 'sr.user_id = u.id');

		if ($store_id) {
			$this->db->where('sr.store_id', $store_id);
		}

		if ($user_id) {
			$this->db->where('sr.user_id', $user_id);
		}

		if (!$just_count) {
			$start = $page*$limit;
			$this->db->limit($limit, $start);
		}

		$this->db->order_by('sr.date_created', 'DESC');

		$results = $this->db->get('store_reviews sr')->result_array();

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
