<?php
class OrderModel extends CI_Model {
	public function __construct() {
		parent:: __construct();

		$this->load->database();
		$this->load->helper('common_helper');

		$this->table = 'orders';
	}

	public function create($data) {
		$this->db->insert($this->tables, $data);
	}

	public function get($id) {
		$this->db->select('');
		$this->db->where('id', $id);
		$result = $this->db->get('blog_posts')->result_array();
	}

	public function getAll($where, $sort) {
		
	}

	public function getPayPalToken() {
		$headers = [
			'Accept: application/json',
			'Accept-Language: en_US'
		];

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, 'https://api.paypal.com/v1/oauth2/token');
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_USERPWD, $client_id.':'.$secret);
		curl_setopt($ch, CURLOPT_POSTFIELDS, 'grant_type=client_credentials');
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$data = curl_exec($ch);
		curl_close($ch);

		$decode = @json_decode($data, true);
		return $decode->access_token;
	}

	public function makePurchase(
		$card_type,
		$cc_number,
		$cvc,
		$exp_month,
		$exp_year,
		$first_name,
		$last_name,
		$total,
		$token
	) {
		$data = [
			"intent" => "sale",
			"redirect_urls" => [
				"return_url" => "receip.php",
				"cancel_url" => "eror.php"
			],
			"payer" => [
				"payment_method" => "credit_card",
				"funding_instruments" => [
					[
						"credit_card" => [
							"number" => $cc_number,
							"type" => $card_type,
							"expire_month" => $exp_month,
							"expire_year" => $exp_year,
							"cvv2" => $cvc,
							"first_name" => $first_name,
							"last_name" => $last_name
						]
					]
				]
			],
			"transactions" => [
				[
					"amount" => [
						"total" => $total,
						"currency" => "USD"
					],
					"invoice_number" => "" // TODO - find out what this is
				]
			]
		];

		$headers = [
			'Content-Type: application/json',
			'Authorization: Bearer '.$token
		];

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, 'https://api.paypal.com/v1/payments/payment');
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$data = curl_exec($ch);
		curl_close($ch);
		$data = json_decode($data);

		if ($data->state == 'approved') {

		}
	}

	public function update($id, $data, $tags) {
		$this->db->where('id', $id);
		$this->db->update($this->table, $data);

		if ($tags) {
			
		}
	}
}
