<?php
class InventoryModel extends CI_Model {
	public function __construct() {
		parent:: __construct();

		$this->load->database();
		$this->load->helper('common_helper');

		$this->table = 'store_bikes';
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
		return $this->db->insert_id();
	}

	public function get($id) {
		$this->db->select('address, city, closing_time, description, id, image, lat, lon, name, opening_time, order, phone_number, state, zip_code');
		$this->db->where('s.id', $id);
		$result = $this->db->get('stores s')->result_array();
		if (empty($result)) {
			return false;
		}

		return $result[0];
	}

	public function search(
		$storeId,
		$just_count,
		$page = 0,
		$limit = 25
	) {
		$select = "sb.id, sb.bike_id, sb.hourly_rate, sb.quantity, sb.store_id, b.name, b.description, b.image";

		if ($just_count) {
			$select = 'COUNT(*) AS count';
		}

		$this->db->select($select);

		if (!$just_count) {
			$this->db->join('bikes b', 'sb.bike_id = b.id');
		}

		if (!empty($storeId)) {
			$this->db->where('sb.store_id', $storeId);
		}

		$this->db->where('sb.visible', '1');

		if (!$just_count) {
			$start = $page*$limit;
			$this->db->limit($limit, $start);
		}

		$results = $this->db->get('store_bikes sb')->result_array();

		if ($just_count) {
			return $results[0]['count'];
		}

		return $results;
	}

	public function updateQuantity($add, $id) {
		$new_quantity = $add ? 'quantity+1' : 'quantity-1';
		$sql = "UPDATE store_bikes SET quantity = ".$new_quantity." WHERE id = ?";
		$this->db->query($sql, [$id]);
	}

	public function update($id, $data) {
		$this->db->where('id', $id);
		$this->db->update($this->table, $data);
	}
}
