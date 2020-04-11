<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Order extends CI_Controller {
	public function __construct() {
		parent:: __construct();

		$this->base_url = $this->config->base_url();

		$this->load->model('OrderModel', 'order');
		$this->load->model('UsersModel', 'users');
	}

	public function index() {
		
	}

	public function create() {
		$cart = $this->input->post('cart');
		$email = $this->input->post('email');
		$paymentId = $this->input->post('paymentId');
		$storeId = $this->input->post('storeId');
		$user = $this->user;

		$card = $this->users->getPaymentMethod($paymentId);
		if (!$card) {
			echo json_encode([
				'error' => 'Please select a payment method'
			]);
			exit;
		}

		if ($card['email'] !== $email && !$user) {
			echo json_encode([
				'error' => 'Please select a payment method'
			]);
			exit;
		}

		if ($user ? $card['user_id'] != $user->id : false) {
			echo json_encode([
				'error' => 'Please select a payment method'
			]);
			exit;
		}

		if (!is_array($cart) || empty($cart)) {
			echo json_encode([
				'error' => 'Your cart is empty'
			]);
			exit;
		}

		$orderData = $this->order->getOrderData($cart, $storeId);
		$items = $orderData['items'];
		$orderId = $this->order->create([
			'amount_after_tax' => $orderData['total'],
			'amount_before_tax' => $orderData['subtotal'],
			'payment_method' => $paymentId,
			'store_id' => $storeId,
			'tax' => $orderData['tax']
		]);

		$this->order->insertOrderDetails($items, $orderId);
		// FormatArray($card);
		// FormatArray($orderData);

		$itemsHtml = $this->order->formatItemsHtml($items);
		$email_template = $this->media->generateTemplate('order-confirmation', [
			'items' => $itemsHtml,
			'card_number' => '************'.substr($card['number'], -4),
			'card_type' => $card['type'],
			'confirmation_number' => '',
			'exp_month' => $card['exp_month'],
			'exp_year' => $card['exp_year'],
			'subtotal' => $orderData['subtotal'],
			'tax_price' => $orderData['tax'],
			'total' => $orderData['total']
		]);
		$title = $email_template['title'];
		$msg = $email_template['msg'];
		$from = EMAIL_RECEIVERS;
		$to = [
			[
				'email' => $email,
				'name' => $card['name']
			]
		];
		$mail = $this->media->sendEmail($title, $msg, $from, $to);

		if (!$mail) {
			echo json_encode([
				'error' => 'Something went wrong.'
			]);
			exit;
		}

		/*
		$payPalToken = $this->order->getPayPalToken();
		if (empty($payPalToken)) {
			echo json_encode([
				'error' => 'There was an error with PayPal'
			]);
			exit;
		}

		$purchase = $this->order->makePurchase(
			$type,
			$number,
			$cvc,
			$expMonth,
			$expYear,
			$firstName,
			$lastName,
			$total,
			$token
		);
		*/

		echo json_encode([
			'error' => false,
			'orderId' => $orderId
		]);
	}

	public function createRefund() {
		$id = $this->input->post('id');

		$user = $this->user;
		if (!$user) {
			echo json_encode([
				'error' => 'You must be logged in'
			]);
			exit;
		}

		$this->order->update($id, [
			'is_refunded' => 1,
			'refund_date' => date('Y-m-d H:i:s')
		]);

		echo json_encode([
			'error' => false
		]);
	}

	public function getAll() {
		$storeId = $this->input->get('storeId');
		$userId = $this->input->get('userId');

		$page = 0;
		$limit = 100;

		$where = [];
		if (!empty($storeId)) {
			$where['o.store_id'] = $storeId;
		}

		if (!empty($userId)) {
			$user = $this->user;
			if ($user ? $this->user->id == $userId : false) {
				echo json_encode([
					'error' => 'You do not have permission to do that'
				]);
				exit;
			}

			$where['pm.user_id'] = $userId;
		}

		$count = $this->order->getAll($where, true);
		$results = $this->order->getAll($where, false);

		if ($count > 0) {
			$count = count($results);
			$pages = ceil($count/$limit);
			$has_more = $page+1 < $pages ? true : false;
		} else {
			$count = 0;
			$pages = 0;
			$has_more = false;
		}

		echo json_encode([
			'count' => $count,
			'pagination' => [
				'hasMore' => $has_more,
				'nextPage' => $page+1,
			],
			'orders' => $results
		], true);
	}

	public function getDetails() {
		$id = $this->input->get('id');

		$user = $this->user;
		if (!$user) {
			echo json_encode([
				'error' => 'You do not have permission to do that'
			]);
			exit;
		}

		$count = $this->order->getDetails($id);

		echo json_encode([
			'error' => false
		]);
	}

	public function getPaymentMethods() {
		$user = $this->user;
		if (!$user) {
			echo json_encode([
				'error' => 'You must be logged in'
			]);
			exit;
		}

		$methods = $this->users->getPaymentMethods($user->id);

		echo json_encode([
			'error' => false,
			'methods' => $methods
		]);
	}
}
