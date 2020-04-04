<?php
class CityModel extends CI_Model {
	public function __construct() {
		parent:: __construct();

		$this->load->database();
		$this->load->helper('common_helper');

		$this->table = 'featured_locations';
	}

	public function checkIfExists($id) {
		$this->db->select('COUNT(*) AS count');
		$this->db->where('location_id', $id);
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
		$this->db->select('city, county, lat, lon, state, zip_code, fl.description, fl.image, fl.slug');
		$this->db->join('locations l', 'fl.location_id = l.id');
		$this->db->where('fl.id', $id);
		$result = $this->db->get('featured_locations fl')->result_array();
		if (empty($result)) {
			return false;
		}

		return $result[0];
	}

	public function getFeaturedCities() {
		$this->db->select("CONCAT(city, ', ', state, '') AS `key`, CONCAT(city, ', ', state, '') AS text, l.id AS value");
		$this->db->join('locations l', 'fl.location_id = l.id');
		$results = $this->db->get('featured_locations fl')->result_array();
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

	public function search(
		$q,
		$lat,
		$lon,
		$just_count,
		$page = false,
		$limit = 25
	) {
		$select = "fl.id, fl.description, fl.image, fl.slug, l.city AS title, l.county, l.lat, l.lon, l.state, l.zip_code";

		if ($just_count) {
			$select = 'COUNT(*) AS count';
		}

		$this->db->select($select);
		$this->db->join('locations l', 'fl.location_id = l.id');

		if (!empty($q)) {
			$this->db->like('city', $q);
		}

		if (!$just_count) {
			$limit = 25;
			$start = $page*$limit;
			$this->db->limit($limit, $start);
		}

		$results = $this->db->get('featured_locations fl')->result_array();

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
