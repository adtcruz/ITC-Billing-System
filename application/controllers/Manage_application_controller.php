<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Manage_application_controller extends CI_Controller
{
	public function index ()
	{
		session_start();
		if(array_key_exists("type",$_SESSION)){
			if($_SESSION["type"]==="superadmin"){

				$this->load->model('Manage_application_model','mapm');

				$logList = $this->mapm->getTopFiveLogEntries();
				$nAdmin = $this->mapm->getNumberOfAdminAccounts();
				$nTechn = $this->mapm->getNumberOfTechnicianAccounts();

				$this->load->view('Manage_application_view',array('logList'=>$logList, 'nAdmin' => $nAdmin, 'nTechn' => $nTechn));
			}
			if(($_SESSION["type"]==="admin")||($_SESSION["type"]==="technician")){
				$this->load->view('Manage_application_view');
			}
		}
	}
}
?>