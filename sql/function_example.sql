SELECT * FROM dbo.get_equipment_last_status('ESP0001')
/*  RESULT WILL HAVE THIS FORMAT
id_equipment	name_equipment	status		_state	_status
BC0002			PumpB			1			200		success
BC0104			Pumpr			NULL		201		equipment's status not found
DHT0505			abc				NULL		201		equipment's status not found


*/


	