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

SELECT * FROM dbo.get_equipment_schedule('BC0002')
/* EXPECT RESULT
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