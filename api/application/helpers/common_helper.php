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
