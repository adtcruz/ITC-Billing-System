<div class="row">
	<?php $this->load->view('Sidenav');?>
	<!-- FILLER TO PUSH MAIN CONTENT TO THE RIGHT -->
	<div class="col s3 m3 l3"><br/><br/></div>
	<!-- MAIN CONTENT CONTAINER -->
	<div class="col s9 m9 l9">
		<br/>
		<br/>
		<h3 class="center-align">User Logs</h3>
		<br/>
		<div class="row">
			<div class="col s1 m1 l1">&nbsp;</div>
			<?php echo $logsTable;?>
			<div class="col s1 m1 l1">&nbsp;</div>
		</div>
	</div>
</div>
