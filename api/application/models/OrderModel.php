<?php
class OrderModel extends CI_Model {
	public function __construct() {
		parent:: __construct();

		$this->load->database();
		$this->load->helper('common_helper');

		$this->table = 'orders';
	}

	public function create($data) {
		$this->db->insert($this->table, $data);
		return $this->db->insert_id();
	}

	public function formatItemsHtml($items) {
		$html = '';
		for ($i=0;$i<count($items);$i++) {
			$item = $items[$i];
			$name = $item['name'];
			$price = $items['price'];
			$hours = (int)$item['hours'];

			$html .= '<tr>
				<td width="75%" align="left" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding: 5px 10px;">
						'.$name.' ('.$hours.' hr'.($hours > 1 ? 's' : '').')
				</td>
				<td width="25%" align="left" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding: 5px 10px;">
						$'.round($price*$hours, 2).'
				</td>
			</tr>';
		}

		return $html;
	}

	public function get($id) {
		$this->db->select('*');
		$this->db->where('id', $id);
		$result = $this->db->get($this->table)->result_array();
		if (empty($result)) {
			return false;
		}

		return $result[0];
	}

	public function getAll(
		$where,
		$just_count = false,
		$page = 0,
		$limit = 100
	) {
		$select = 'o.id, o.amount_after_tax, o.amount_before_tax, o.created_at, o.is_refunded, o.refund_date, o.store_id, o.tax, ';
		$select .= 'pm.number, ';
		$select .= 'od.bike_id, ';
		$select .= 's.name AS store_name, s.image AS store_img, ';
		$select .= 'sb.hourly_rate, ';
		$select .= 'b.name, b.image';

		if ($just_count) {
			$select = 'COUNT(*) AS count';
		}

		$this->db->select($select);
		$this->db->join('payment_methods pm', 'o.payment_method = pm.id');
		$this->db->join('order_details od', 'o.id = od.order_id');
		$this->db->join('stores s', 'o.store_id = s.id');
		$this->db->join('store_bikes sb', 'od.bike_id = sb.id');
		$this->db->join('bikes b', 'sb.bike_id = b.id');

		if (!$just_count) {
			$start = $page*$limit;
			$this->db->limit($limit, $start);
		}

		if (!empty($where)) {
			$this->db->where($where);
		}

		if (!$just_count) {
			$this->db->group_by('o.id');
			$this->db->order_by('o.created_at', 'DESC');
		}

		$results = $this->db->get('orders o')->result_array();

		if ($just_count) {
			return $results[0]['count'];
		}

		return $results;
	}

	public function getDetails($id) {
		$select = 'od.bike_id, ';
		$select .= 'sb.hourly_rate, ';
		$select .= 'b.description, b.name, b.image';

		$this->db->select($select);
		$this->db->join('order_details od', 'o.id = od.order_id');
		$this->db->join('store_bikes sb', 'od.bike_id = sb.id');
		$this->db->join('bikes b', 'sb.bike_id = b.id');
		$this->db->where('o.id', $id);
		$this->db->group_by('sb.id');
		$result = $this->db->get('orders o')->result_array();

		if ($empty($result)) {
			return false;
		}

		return $result[0];
	}

	public function getOrderData($cart, $storeId) {
		$bikes = [];
		$array = [];

		for ($i=0;$i<count($cart['items']);$i++) {
			$item = $cart['items'][$i];
			$bike = $item['bike'];
			$store = $item['store'];
			$hour = $item['hours'];
			$bikeId = $bike['id'];

			if ($store['id'] == $storeId) {
				$array[] = [
					'bike_id' => $bikeId,
					'hours' => $hour
				];
				$bikes[] = $bikeId;
			}
		}

		usort($array, function($a, $b) {
			return $a['bike_id'] <=> $b['bike_id'];
		});

		$prices = $this->getBikePrices(array_unique($bikes));

		$final = [];
		$subtotal = 0;

		for ($i=0;$i<count($array);$i++) {
			$bike_id = $array[$i]['bike_id'];
			$hours = $array[$i]['hours'];

			for ($x=0;$x<count($prices);$x++) {
				if ($bike_id == $prices[$x]['id']) {
					$price = $hours*$prices[$x]['hourlyRate'];
					$subtotal = $subtotal+$price;

					if ($hours > 0) {
						$final[] = [
							'bikeId' => $bike_id,
							'hours' => $hours,
							'image' => $prices[$x]['image'],
							'name' => $prices[$x]['name'],
							'price' => $price
						];
						break;
					}
				}
			}
		}

		$tax = round($subtotal*0.0875, 2);
		$total = $subtotal+$tax;

		return [
			'items' => $final,
			'subtotal' => $subtotal,
			'tax' => $tax,
			'total' => $total
		];
	}

	public function getBikePrices($bikes) {
		$select = "s.id AS storeId, sb.hourly_rate AS hourlyRate, sb.id, sb.quantity, b.description, b.image, b.name";
		$this->db->select($select);
		$this->db->join('bikes b', 'sb.bike_id = b.id');
		$this->db->join('stores s', 'sb.store_id = s.id');
		$this->db->where_in('sb.id', $bikes);
		$results = $this->db->get('store_bikes sb')->result_array();
		return $results;
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

	public function insertOrderDetails($items, $orderId) {
		for ($i=0;$i<count($items);$i++) {
			$this->db->insert('order_details', [
				'bike_id' => $items[$i]['bikeId'],
				'hours' => $items[$i]['hours'],
				'order_id' => $orderId
			]);
		}
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

	public function update($id, $data) {
		$this->db->where('id', $id);
		$this->db->update($this->table, $data);
	}
}
