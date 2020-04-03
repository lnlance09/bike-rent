<?php
class UsersModel extends CI_Model {
	public function __construct() {
		parent:: __construct();

		$this->load->database();
		$this->load->helper('common_helper');
		$this->db->query("SET time_zone='+0:00'");
	}

	public function addPaymentMethod($data) {
		$this->db->insert('payment_methods', $data);
	}

	public function createUser($data) {
		$this->db->select('COUNT(*) AS count');
		$this->db->where('username', $data['username']);
		$query = $this->db->get('users')->result();

		if ($query[0]->count == 0) {
			$this->db->insert('users', $data);
			return true;
		}

		return false;
	}

	public function generateBearerToken($data, $token = null) {
		$this->load->library('firebasetoken');
		$secret = 'secret';

		if (!$token) {
			return $this->firebasetoken->encode($data, $secret);
		}
		return $this->firebasetoken->decode($token, $secret);
	}

	public function generateUsername($name) {
		$name = str_replace(' ', '', $name);
		return $name.rand(1000, 9999);
	}

	public function getPaymentMethod($id) {
		$this->db->select('created_at, cvc, exp_month, exp_year, id, name, number, preferred, type, user_id');
		$this->db->where('id', $id);
		$result = $this->db->get('payment_methods')->result_array();
		if (empty($result)) {
			return false;
		}

		return $result[0];
	}

	public function getPaymentMethods($id) {
		$this->db->select('created_at, cvc, exp_month, exp_year, id, name, number, preferred, type, user_id');
		$this->db->where('user_id', $id);
		$results = $this->db->get('payment_methods')->result_array();
		return $results;
	}

	public function getUserByCurrentPassword($id, $password) {
		$sql = "SELECT COUNT(*) AS count 
				FROM users 
				WHERE id = ? 
				AND (password = ? OR password_reset = ?)";
		$params = [$id, sha1($password), sha1($password)];
		$result = $this->db->query($sql, $params)->result_array();

		if ($result[0]['count'] == 1) {
			return true;
		}

		return false;
	}

	public function getUserInfo($id, $select = '*') {
		$this->db->select($select);

		if (is_numeric($id)) {
			$this->db->where('u.id', $id);
		} else {
			$this->db->where('u.username', $id);
		}

		$query = $this->db->get('users u')->result_array();

		if (empty($query)) {
			return false;
		}

		return $query[0];
	}

	public function getUsers() {
		$this->db->select('*');
		return $this->db->get('users')->result_array();
	}

	public function login($email, $password) {
		$column = filter_var($email, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

		$select = "u.id, u.name, u.username, u.img, email, email_verified AS emailVerified, verification_code AS verificationCode, date_created AS dateCreated, u.privilege";
		$this->db->select($select);

		$where = $column.' = "'.$email.'" ';

		if ($password) {
			$where .= 'AND (password = "'.sha1($password).'" OR password_reset = "'.sha1($password).'")';
		}

		$this->db->where($where);
		return $this->db->get('users u')->result_array();
	}

	public function register($data) {
		$this->db->select('email, username');

		if ($data['email']) {
			$this->db->where('email', $data['email']);
		}

		$this->db->or_where('username', $data['username']);
		$query = $this->db->get('users')->result_array();

		if (count($query) === 0) {
			$password = $data['password'];
			$data['password'] = sha1($password);
			$this->db->insert('users', $data);

			return [
				'error' => false,
				'user' => [
					'email' => $data['email'],
					'emailVerified' => false,
					'id' => $this->db->insert_id(),
					'img' => null,
					'name' => $data['name'],
					'username' => $data['username'],
					'verificationCode' => $data['verification_code']
				]
			];
		}

		if ($query[0]['email'] === $data['email']) {
			return [
				'error' => true, 
				'msg' => 'A user with that email already exists'
			];
		}

		if ($query[0]['username'] === $data['username']) {
			return [
				'error' => true, 
				'msg' => 'A user with that username already exists'
			];
		}

		return false;
	}

	public function search($q, $where, $page = 0, $just_count = false, $limit = 20) {
		$params = [];

		$select = "u.id, u.name, u.username,
				CASE
					WHEN u.img IS NOT NULL THEN CONCAT('".S3_PATH."', u.img)
				END AS img";

		if ($just_count) {
			$select = "COUNT(*) AS count";
		}

		$sql = "SELECT ".$select."
				FROM users u ";
		
		if ($q) {
			$params = ['%'.$q.'%', '%'.$q.'%', '%'.$q.'%'];
			$sql .= " WHERE (u.name LIKE ? OR u.username LIKE ?)";
		}

		if (!empty($where)) {
			$sql .= $q ? " AND " : " WHERE ";

			foreach($where as $key => $val) {
				$sql .= $key." = ? ";
				$params[] = $val;
			}
		}

		if (!$just_count) {
			$start = $page*$limit;
			$sql .= " LIMIT ".$start.", ".$limit;
		}

		$results = $this->db->query($sql, $params)->result_array();
		if (empty($results)) {
			return false;
		}

		if ($just_count) {
			return $results[0]['count'];
		}

		return $results;
	}

	public function setDefaultPaymentMethod($id, $user_id) {
		$this->db->where('user_id', $user_id);
		$this->db->update('payment_methods', [
			'preferred' => 0
		]);

		$this->db->where('id', $id);
		$this->db->update('payment_methods', [
			'preferred' => 1
		]);
	}

	public function setNewPassword($email, $data) {
		$this->db->where('email', $email);
		$this->db->update('users', $data);
	}

	public function updateUser($id, $data) {
		$this->db->where('id', $id);
		$this->db->update('users', $data);
	}

	public function userExists($id) {
		$this->db->select('COUNT(*) AS count');
		$this->db->where('id', $id);
		$query = $this->db->get('users')->result();
		if ($query[0]->count == 0) {
			return false;
		}
		return true;
	}

	public function userLookupByEmail($email) {
		$this->db->select("date_created, id, img, name");
		$this->db->where('email', $email);
		$this->db->or_where('username', $email);
		$query = $this->db->get('users')->result_array();
		if (empty($query)) {
			return false;
		}

		return [
			'date_created' => $query[0]['date_created'],
			'id' => $query[0]['id'],
			'img' => $query[0]['img'],
			'name' => $query[0]['name']
		];
	}
}
