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