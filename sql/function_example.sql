SELECT * FROM dbo.get_equipment_last_status('ESP0001')
/*  RESULT WILL HAVE THIS FORMAT
id_equipment	name_equipment	status		_state	_status
BC0002			PumpB			1			200		success
BC0104			Pumpr			NULL		201		equipment's status not found
DHT0505			abc				NULL		201		equipment's status not found


*/


SELECT * FROM dbo.get_equipment_schedule('BC0002');
/*  RESULT WILL HAVE THIS FORMAT
time_offset		times				_state	_status
15				03:32:00.0000000	200		success
15				23:50:00.0000000	200		success
5				20:12:00.0000000	200		success	
5				14:12:00.0000000	200		success
15				02:48:00.0000000	200		success
20				23:59:00.0000000	200		success
20				00:10:00.0000000	200		success
20				18:08:00.0000000	200		success
*/