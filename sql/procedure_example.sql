EXEC dbo.insert_device_pro N'
	{
		"id_esp":"ESP0001",
		"device":
			 [
				{
					"id":"DHT0505",
					"name":"abc",
					"id_equipment":"BC0404",
					"type":"Sensor"
				},
				{	
				    "id":"BC0404",
				    "name":"def",
				    "type":"Equipment"
				}
			]
		
	}
	';
--EXPECT RESULT state	status
--				203		id sensor and id equipment has been exists

EXEC dbo.edit_device_pro
N'
	{
	  "id_esp":"ESP0003",
	  "id_equipment":"BC0303",
	  "name_equipment":"ádassdasd",
	  "sensors":
	   [
		  {
			"id":"DHT0505",
			"name":"mathettatca"	
		  },
		  {	
			"id":"PH141",
			"name":"dongnho"
		  }
	  ]
	}
'

--EXPECT RESULT state	status
--				200		success



EXEC [dbo].[insert_schedule_pro] 'BC0001',14,'03:32:00';
/*
	EXPECT RESULT
	_state	_status
	200		'success'
*/


EXEC dbo.edit_schedule_pro 'BC0001', 20;
/*	EXPECT RESULT
	_state	_status
	200		'success'
*/


EXEC dbo.edit_schedule_pro 'BC0001', 20;
EXEC dbo.edit_schedule_pro 'BC0001',@old_time ='03:32:00',@new_time = '03:34:00';--use 2 last arguement with out using @offset
/*	EXPECT RESULT
	_state	_status
	200		'success'
*/


EXEC dbo.delete_schedule_pro 'BC0003';
/*	EXPECT RESULT
	_state	_status
	200		success 
*/

EXEC dbo.delete_schedule_pro 'BC0001', @times ='23:59:00.0000000'--just use times arguement
EXEC dbo.delete_schedule_pro 'BC0001', 20 --just use offset

/*	EXPECT RESULT
	_state	_status
	200		success
*/


--arguement's list @id_esp varchar(23),
/*
@new_id_user varchar(20) =NULL,
@new_name_esp VARCHAR(20) = NULL,
@new_description VARCHAR(100) = NULL,
@new_latitude float =NULL,
@new_longtitude float = NULL
*/
EXEC dbo.edit_farm_pro '202403215' ,@new_name_esp = 'dongnho'



EXEC dbo.edit_esp_last_status_pro '202403215' , '"a" : "abc"'
/*	EXPECT RESULT
	_state	_status
	200		success
*/
