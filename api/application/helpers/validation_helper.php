<?php
defined('BASEPATH') OR exit('No direct script access allowed');

function validateCvc($cvc, $msg) {
	if (strlen($cvc) > 4 || strlen($cvc) < 3 || !is_numeric($cvc)) {
		echo json_encode([
			'error' => $msg
		]);
		exit;
	}
}

function validateEmail($email, $msg) {
	if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
		echo json_encode([
			'error' => $msg
		]);
		exit;
	}
}

function validateEmptyField($str, $msg) {
	if (empty($str)) {
		echo json_encode([
			'error' => $msg
		]);
		exit;
	}
}

function validateExpDate($expiry, $msg) {
	if (strlen($expiry) !== 4) {
		echo json_encode([
			'error' => $msg
		]);
		exit;
	}

	$month = substr($expiry, 0, 2);
	$year = substr($expiry, 2);

	if ($month > 12 || $month < 1) {
		echo json_encode([
			'error' => 'Please enter a valid expiration month'
		]);
		exit;
	}

	if ($year < date('y')) {
		echo json_encode([
			'error' => 'This card has expired'
		]);
		exit;
	}
}

function validateItemsDifferent($item_one, $item_two, $msg) {
	if ($item_one == $item_Two) {
		echo json_encode([
			'error' => $msg
		]);
		exit;
	}
}

function validateItemsMatch($item_one, $item_two, $msg) {
	if ($item_one != $item_two) {
		echo json_encode([
			'error' => $msg
		]);
		exit;
	}
}

function validateLoggedIn($user, $msg) {
	if (!$user) {
		echo json_encode([
			'error' => $msg
		]);
		exit;
	}
}

function validateName($username, $msg) {
	if (preg_match('/[\'^£$%&*()}{@#~?><>,|=_+¬-]/', $username)) {
		echo json_encode([
			'error' => $msg
		]);
		exit;
	}
}

function validateNumber($number, $msg) {
	if (!is_numeric($number)) {
		echo json_encode([
			'error' => $msg
		]);
		exit;
	}
}

function validatePassword($password, $msg) {
	if (strlen($password) < 7) {
		echo json_encode([
			'error' => $msg
		]);
		exit;
	}
}

function validateRating($rating, $msg) {
	if ($rating < 1 || $rating > 5) {
		echo json_encode([
			'error' => $msg
		]);
		exit;
	}
}

function validateUsername($username, $msg) {
	if (preg_match('/[\'^£$%&*()}{@#~?><>,|=_+¬-]/', $username)
	|| strpos($username, " ")) {
		echo json_encode([
			'error' => $msg
		]);
		exit;
	}

	if (strlen($username) > 18) {
		echo json_encode([
			'error' => $msg
		]);
		exit;
	}
}
