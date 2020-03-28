<?php
defined('BASEPATH') OR exit('No direct script access allowed');

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
