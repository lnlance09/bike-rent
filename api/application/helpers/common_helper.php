<?php
	if(!defined('BASEPATH'))
		exit('No direct script access allowed');

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

	function getQRCode($uri, $size) {
		$params = [
			'chs' => $size.'x'.$size,
			'cht' => 'qr',
			'chl' => $uri,
			'choe' => 'UTF-8',
			'chld' => 'L|0',
		];

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, 'https://chart.googleapis.com/chart?'.http_build_query($params));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$data = curl_exec($ch);
		curl_close($ch);
		return $data;
	}
