<?php
class StoreModel extends CI_Model {
	public function __construct() {
		parent:: __construct();

		$this->load->database();
		$this->load->helper('common_helper');

		$this->table = 'stores';
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

	public function get($id) {
		$this->db->select('address, city, closing_time, description, id, image, lat, lon, name, opening_time, order, phone_number, state, zip_code');
		$this->db->where('s.id', $id);
		$result = $this->db->get('stores s')->result_array();
		if (empty($result)) {
			return false;
		}

		return $result[0];
	}

	public function getBikes(
		$store_id,
		$bike_id,
		$just_count,
		$page = false,
		$limit = 25
	) {
		if ($store_id) {
			$select = "sb.quantity, b.id, b.description, b.image, b.name";
		}

		if ($bike_id) {
			$select = "s.address, s.city, s.description, s.id, s.image, s.lat, s.lon, s.name, s.order, s.state, s.zip_code";
		}

		if ($just_count) {
			$select = 'COUNT(*) AS count';
		}

		$this->db->select($select);

		if ($store_id) {
			$this->db->where('sb.store_id', $store_id);
			$this->db->join('bikes b', 'sb.bike_id = b.id');
		}

		if ($bike_id) {
			$this->db->where('sb.bike_id', $bike_id);
			$this->db->join('stores s', 'sb.store_id = s.id');
		}

		if (!$just_count) {
			$limit = 25;
			$start = $page*$limit;
			$this->db->limit($limit, $start);
		}

		$results = $this->db->get('store_bikes sb')->result_array();

		if ($just_count) {
			return $results[0]['count'];
		}

		return $results;
	}

	public function getImages(
		$id,
		$just_count,
		$page = false,
		$limit = 25
	) {
		$select = "image";

		if ($just_count) {
			$select = 'COUNT(*) AS count';
		}

		$this->db->select($select);
		$this->db->where('si store_id', $id);

		if (!$just_count) {
			$limit = 25;
			$start = $page*$limit;
			$this->db->limit($limit, $start);
		}

		$results = $this->db->get('store_images si')->result_array();

		if ($just_count) {
			return $results[0]['count'];
		}

		return $results;
	}

	public function getLocations($q) {
		$this->db->select("CONCAT(city, ', ', state, '') AS `key`, CONCAT(city, ', ', state, '') AS text, id AS value");
		$this->db->like('city', $q);
		$this->db->limit(25);
		$this->db->group_by('city, state');
		$result = $this->db->get('locations')->result_array();
		return $result;
	}

	public function getReviews(
		$id,
		$just_count,
		$page = false,
		$limit = 25
	) {
		$select = "date_created, review, stars";

		if ($just_count) {
			$select = 'COUNT(*) AS count';
		}

		$this->db->select($select);
		$this->db->where('sr store_id', $id);

		if (!$just_count) {
			$limit = 25;
			$start = $page*$limit;
			$this->db->limit($limit, $start);
		}

		$results = $this->db->get('store_reviews sr')->result_array();

		if ($just_count) {
			return $results[0]['count'];
		}

		return $results;
	}

	public function search(
		$radius,
		$lat,
		$lon,
		$just_count,
		$page = false,
		$limit = 25
	) {
		$select = "s.address, s.city, s.description, s.id, s.image, s.lat, s.lon, s.name, s.order, s.state, s.zip_code";

		if ($just_count) {
			$select = 'COUNT(*) AS count';
		}

		$this->db->select($select);

		if (!empty($radius)) {
			$this->db->like('city', $q);
		}

		if (!$just_count) {
			$limit = 25;
			$start = $page*$limit;
			$this->db->limit($limit, $start);
		}

		$results = $this->db->get('stores s')->result_array();

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
