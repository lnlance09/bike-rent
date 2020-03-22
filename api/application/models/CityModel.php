<?php
class CityModel extends CI_Model {
	public function __construct() {
		parent:: __construct();

		$this->load->database();
		$this->load->helper('common_helper');

		$this->table = 'featured_locations';
	}

	public function checkIfExists($id) {
		$this->db->select("COUNT(*) AS count");
		$this->db->where('location_id', $id);
		$result = $this->db->get('featured_locations')->result();
		if ($result[0]->count == 0) {
			return false;
		}
		return true;
	}

	public function create($data) {
		$this->db->insert($this->table, $data);
	}

	public function get($id) {
		$this->db->select('city, county, lat, lon, state, zip_code');
		$this->db->join('locations l', 'fl.id = l.location_id');
		$this->db->where('fl.id', $id);
		$result = $this->db->get('featured_locations fl')->result_array();
		return $result;
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
		$select = "fl.id, fl.description, fl.image, l.city AS title, l.county, l.lat, l.lon, l.state, l.zip_code, CONCAT('/cities/', fl.id) AS url";

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

	/*
	public function insertLocation() {
		$json = file_get_contents(APPPATH.'third_party/locations.json');
		$locations = @json_decode($json, true);
		// FormatArray($locations);

		for ($i=0;$i<count($locations);$i++) {
			$place = $locations[$i];
			$city = $place['city'];
			$county = $place['county'];
			$lat = $place['latitude'];
			$lon = $place['longitude'];
			$state = $place['state'];
			$zip_code = str_pad($place['zip_code'], 5, '0', STR_PAD_LEFT);

			$this->db->select('COUNT(*) AS count');
			$this->db->where('zip_code', $zip_code);
			$result = $this->db->get('locations')->result_array();
			$count = (int)$result[0]['count'];

			if ($count == 0 && !empty($lat) && !empty($lon)) {
				$this->db->insert('locations', [
					'city' => $city,
					'county' => $county,
					'lat' => $lat,
					'lon' => $lon,
					'state' => $state,
					'zip_code' => $zip_code
				]);
			}
		}
	}
	*/
}
