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
		$cvc = $this->input->post('cvc');
		$email = $this->input->post('email');
		$expiry = $this->input->post('expiry');
		$firstName = $this->input->post('firstName');
		$lastName = $this->input->post('lastName');
		$name = $this->input->post('cardName');
		$number = $this->input->post('cardNumber');
		$storeId = $this->input->post('storeId');
		$type = $this->input->post('cardType');

		$exp = explode("/", $expiry);
		$expMonth = $exp[0];
		$expYear = end($exp);

		$createOrder = $this->order->create([
			'amount_after_tax' => $amountAfterTax,
			'amount_before_tax' => $amountBeforeTax,
			'payment_method' => $paymentMethod,
			'store_id' => $storeId,
			'tax' => $tax
		]);


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
