<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class BillForPayment_controller extends CI_Controller
{
	// constructor
	public function __construct ()
	{
		parent::__construct ();
		session_start ();
        $this->load->model ('BillForPayment_model', 'bfp');
	}

	// index function
	public function index()
	{
		// if $_SESSION['type'] == 'client' && $_SESSION['username'] is set, continue. Else, show 404 page.
		if (($_SESSION['type'] == 'client') && !array_key_exists("username",$_SESSION))
		{
			show_404();
		}
		else
		{
			// load mpdf library
			$this->load->library('m_pdf');

            // get data from database
            $db_data = $this->bfp->getData ($this->uri->segment(2));

			// initialize the page to be converted to pdf
			$html = $this->load->view ("BillForPayment_view", $db_data, true);

			// set pdf file name
			$pdfFilePath = "BillForPayment.pdf";

			// use mpdf function to write pdf
			$this->m_pdf->pdf->WriteHTML($html);

			// output the pdf then download
			$this->m_pdf->pdf->Output(); // add $pdfFilePath and "D" as parameters download automatically*/
		}
	}
}
