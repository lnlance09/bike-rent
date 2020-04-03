<?php
defined('BASEPATH') OR exit('No direct script access allowed');

function checkCreditCard($cc, $extra_check = false) {
	$cards = [
		"discover" => "([6011]{4})([0-9]{12})",
		"visa" => "(4\d{12}(?:\d{3})?)",
		"amex" => "(3[47]\d{13})",
		"jcb" => "(35[2-8][89]\d\d\d{10})",
		"maestro" => "((?:5020|5038|6304|6579|6761)\d{12}(?:\d\d)?)",
		"solo" => "((?:6334|6767)\d{12}(?:\d\d)?\d?)",
		"mastercard" => "(5[1-5]\d{14})",
		"switch" => "(?:(?:(?:4903|4905|4911|4936|6333|6759)\d{12})|(?:(?:564182|633110)\d{10})(\d\d)?\d?)"
	];

	$names = [
		"Discover",
		"Visa",
		"American Express",
		"JCB",
		"Maestro",
		"Solo",
		"Mastercard",
		"Switch"
	];

	$matches = [];
	$pattern = "#^(?:".implode("|", $cards).")$#";
	$result = preg_match($pattern, str_replace(" ", "", $cc), $matches);
	
	if ($extra_check && $result > 0) {
		$result = validatecard($cc) ? 1 : 0;
	}

	return $result > 0 ? $names[sizeof($matches)-2] : false;
}

function filterArray($data, $allowed) {
	$filtered = array_filter($data, function($key) use($allowed) {
		return in_array($key, $allowed);
	}, ARRAY_FILTER_USE_KEY);
	return $filtered;
}

function formatArray($array, $style = FALSE) {
	if($style) {
		echo '<div style="color:#000;text-shadow:none;text-align:left;">';
	}

	echo '<pre>';
	print_r($array);
	echo '</pre>';

	if($style) {
		echo '</div>';
	}
}

function generateAlphaNumString($length) {
	$characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
	$string = '';
	$max = strlen($characters) - 1;
	for ($i=0;$i<$length;$i++) {
		$string .= $characters[mt_rand(0, $max)];
	}

	return $string;
}

function removeStopWords($string) {
	require('stop_words.php');
	$exp = explode(' ', strtolower($string));
	for ($i=0;$i<count($exp);$i++) {
		if (in_array($exp[$i], $stop_words)) {
			unset($exp[$i]);
		}
	}

	$unique = array_unique($exp);
	return implode(' ', $unique);
}

function slugify($text) {
	$text = removeStopWords($text);
	$text = str_replace("'", '', $text);
	$text = str_replace('"', '', $text);
	$text = preg_replace('~[^\\pL\d]+~u', '-', $text);
	$text = trim($text, '-');
	$text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
	$text = strtolower($text);
	$text = preg_replace('~[^-\w]+~', '', $text);
	if (empty($text)) {
		return 'n-a';
	}

	return $text;
}
