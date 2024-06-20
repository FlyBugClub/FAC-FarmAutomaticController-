EXEC dbo.insert_sensor_equipment N'
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