<?php
class MediaModel extends CI_Model {
	public function __construct() {
		parent:: __construct();

		$this->load->library('aws');
	}

	public function addToS3($key, $file, $remove = true, $update = false) {
		$exists = $this->existsInS3($key);
		if (!$exists) {
			$this->aws->upload($key, $file);
		}

		if ($exists && $update) {
			$this->aws->del($key);
			$this->aws->upload($key, $file);
		}

		if ($remove && file_exists($file)) {
			unlink($file);
		}

		return S3_PATH.$key;
	}

	public function existsInS3($file) {
		return $this->aws->exist($file);
	}

	public function listFolder($folder) {
		$objects = $this->aws->listObjects($folder);
		return array_slice($objects['Contents'], 1);
	}

	public function renameS3Object($src, $target, $delete = false) {
		$this->aws->copyFile($src, $target);

		if ($delete) {
			$this->aws->del($src);
		}
	}
}
