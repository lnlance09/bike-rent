<?php
class CityModel extends CI_Model {
	public function __construct() {
		parent:: __construct();

		$this->load->database();
		$this->load->helper('common_helper');
	}

	public function create($title, $entry, $tags) {
		$this->db->insert('blog_posts', [
			'title' => $title,
			'entry' => $entry
		]);
	}

	public function get($id) {
		$this->db->select('');
		$this->db->where('id', $id);
		$result = $this->db->get('blog_posts')->result_array();
	}

	public function getAll($where, $sort) {
		
	}

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
				// die;
			}
		}
	}

	public function update($id, $data, $tags) {
		$this->db->where('id', $id);
		$this->db->update('blog_posts', $data);
	}
}
