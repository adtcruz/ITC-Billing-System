<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Manage_selectable_work_controller extends CI_Controller
{
    public function __construct ()
    {
        parent::__construct ();
        session_start();
        if(array_key_exists("type",$_SESSION)){
            $this->load->model ('Manage_selectable_work_model', 'mswm');
        }
        else{
            $this->load->view('Login_view');
            return;
        }
    }

    public function index ()
    {
      if(($_SESSION["type"]=="admin")||($_SESSION["type"]=="technician")||($_SESSION["type"]=="superadmin"))
      {
        $workTable = $this->mswm->getTable();
        $this->load->view('Manage_selectable_work_view',array('workTable'=>$workTable));
      }
    }
}
?>
