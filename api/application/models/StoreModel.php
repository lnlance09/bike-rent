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

	public function getBikes(
		$store_id,
		$bike_id,
		$just_count,
		$page = 0,
		$limit = 25
	) {
		if ($store_id && !$bike_id) {
			$select = "s.id AS storeId, sb.hourly_rate AS hourlyRate, sb.id, sb.quantity, b.description, b.image, b.name, b.id AS bike_id";
		}

		if ($bike_id) {
			$select = "s.address, s.city, s.description, s.id, s.image, s.lat, s.lon, s.name, s.order, s.state, s.zip_code";
		}

		if ($just_count) {
			$select = 'COUNT(*) AS count';
		}

		$this->db->select($select);

		if ($store_id && !$bike_id) {
			$this->db->join('bikes b', 'sb.bike_id = b.id');
			$this->db->join('stores s', 'sb.store_id = s.id');
			$this->db->where('sb.store_id', $store_id);
		}

		if ($bike_id) {
			$this->db->join('stores s', 'sb.store_id = s.id');

			if ($store_id) {
				$this->db->where('sb.store_id', $store_id);
			}

			$this->db->where('sb.bike_id', $bike_id);
		}

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

	public function getImages(
		$id,
		$just_count,
		$page = 0,
		$limit = 25
	) {
		$select = "image";

		if ($just_count) {
			$select = 'COUNT(*) AS count';
		}

		$this->db->select($select);
		$this->db->where('si store_id', $id);

		if (!$just_count) {
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
		$page = 0,
		$limit = 25,
		$get_avg = false
	) {
		$select = "date_created, comment, rating";

		if ($just_count) {
			$select = 'COUNT(*) AS count';
		}

		if ($get_avg) {
			$select = 'AVG(rating) AS average_rating';
		}

		$this->db->select($select);
		$this->db->where('sr.store_id', $id);

		if (!$just_count) {
			$start = $page*$limit;
			$this->db->limit($limit, $start);
		}

		$results = $this->db->get('store_reviews sr')->result_array();

		if ($just_count) {
			return $results[0]['count'];
		}

		if ($get_avg) {
			return $results[0]['average_rating'];
		}

		return $results;
	}

	public function getStores() {
		$this->db->select("CONCAT(name, ', ', name, '') AS `key`, CONCAT(name, ', ', name, '') AS text, id AS value");
		$results = $this->db->get('stores')->result_array();
		return $results;
	}

	public function search(
		$radius,
		$lat,
		$lon,
		$cityId,
		$storeId,
		$just_count,
		$page = 0,
		$limit = 25
	) {
		$select = "s.address, s.city, s.closing_time AS closingTime, s.description, s.id, s.image, s.lat, s.lon, s.name, s.opening_time AS openingTime, s.order, s.phone_number AS phone, s.state, s.zip_code, ";

		$select .= "GROUP_CONCAT(DISTINCT b.id ORDER BY b.id ASC SEPARATOR '| ') bike_ids, GROUP_CONCAT(DISTINCT b.name ORDER BY b.id ASC SEPARATOR '| ') AS bike_names";

		if ($just_count) {
			$select = 'COUNT(*) AS count';
		}

		$this->db->select($select);

		if (!$just_count) {
			$this->db->join('store_bikes sb', 's.id = sb.store_id', 'left');
			$this->db->join('bikes b', 'sb.bike_id = b.id');
		}

		if (!empty($cityId)) {
			$this->db->where('location_id', $cityId);
		}

		if (!empty($storeId)) {
			$this->db->where('s.id', $storeId);
		}

		if (!$just_count) {
			$start = $page*$limit;
			$this->db->limit($limit, $start);
		}

		if (!$just_count) {
			$this->db->group_by('s.id');
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

	public function updateInventory($id, $bikes) {
		for ($i=0;$i<count($bikes);$i++) {
			$bike_id = trim($bikes[$i]);

			$this->db->select("COUNT(*) AS count");
			$this->db->where([
				'bike_id' => $bike_id,
				'store_id' => $id
			]);
			$result = $this->db->get('store_bikes')->result();
			if ($result[0]->count == 0) {
				$this->db->insert('store_bikes', [
					'bike_id' => $bike_id,
					'store_id' => $id
				]);
			}
		}

		$this->db->where('store_id', $id);
		$this->db->where_not_in('bike_id', $bikes);
		$this->db->delete('store_bikes');
	}
}
