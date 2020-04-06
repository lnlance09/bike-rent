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
		$orderId = $this->order->create([
			'amount_after_tax' => $orderData['total'],
			'amount_before_tax' => $orderData['subtotal'],
			'payment_method' => $paymentId,
			'store_id' => $storeId,
			'tax' => $orderData['tax']
		]);


		$this->order->insertOrderDetails($orderData['items'], $orderId);

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
