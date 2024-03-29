import pyodbc 
from flask import Flask, jsonify
import json
# Thiết lập các thông số kết nối
server = 'sql.bsite.net\\MSSQL2016'  # Tên server và instance của SQL Server
database = 'ngunemay123_SampleDB'     # Tên cơ sở dữ liệu của bạn
username = 'ngunemay123_SampleDB'                  # Tên người dùng SQL Server
password = 'conchongu0123'                    # Mật khẩu SQL Server

# Tạo chuỗi kết nối
conn_str = f'DRIVER=ODBC Driver 17 for SQL Server;SERVER={server};DATABASE={database};UID={username};PWD={password}'
# Kết nối đến cơ sở dữ liệu
conn = pyodbc.connect(conn_str)
# Tạo một đối tượng cursor để thực thi các truy vấn SQL
cursor = conn.cursor()

# Truy vấn dữ liệu từ bảng 'Test2'


# In dữ liệu

app = Flask(__name__)

@app.route('/api/login/<string:email>', methods=['GET'])
def login(email):
    # cursor.execute('SELECT * FROM dbo.Users')
    # Lấy tất cả các dòng dữ liệu
   
    cursor.execute('SELECT * FROM dbo.Users WHERE gmail = ?', (email,))
    row = cursor.fetchone()
    if row:
        # Nếu tìm thấy user, trả về thông tin của user
        user = {
            'id': row.id_user,  # Giả sử id là cột định danh của người dùng
            # Các trường khác nếu cần thiết
        }
        return jsonify(user)
    else:
        # Nếu không tìm thấy user, trả về thông báo lỗi
        return jsonify({'error': 'User not found'}), 404
    

@app.route('/api/get_esp/<string:id_user>', methods=['GET'])
def get_esp(id_user):
    # cursor.execute('SELECT * FROM dbo.Users')
    # Lấy tất cả các dòng dữ liệu
   
    cursor.execute('SELECT * FROM dbo.Esp WHERE id_user = ?', (id_user,))
    rows = cursor.fetchall()
    esp = []
    if rows:
        for row in rows:
            result = {}
            result['id_equipment'] = row[2]
            esp.append(result)
            # Nếu tìm thấy user, trả về thông tin của user
        return jsonify(esp)
    else:
        # Nếu không tìm thấy user, trả về thông báo lỗi
        return jsonify({'error': 'esp not found'}), 404
    
    

@app.route('/api/get_equipmentlastinfo/<string:id_esp>',methods=['GET'])
def get_infodevive(id_esp):
    cursor.execute(f'''
    SELECT ev.id_equipment, ev.[values], ev.[status], ev.[datetime]
    FROM EquipmentValues ev
    INNER JOIN (
        SELECT id_equipment, MAX(id) AS max_id
        FROM EquipmentValues
        WHERE id_equipment IN (
            SELECT id_equipment
            FROM EquipmentManagement
            WHERE id_esp = '{id_esp}'
        )
        GROUP BY id_equipment
    ) AS max_id ON ev.id_equipment = max_id.id_equipment AND ev.id = max_id.max_id
                   ''')
    devive_list_last_status =  cursor.fetchall()
    json_data = [dict(zip(('id_equipment', 'values', 'status','datetime'), item)) for item in devive_list_last_status]
    print(json_data)
    return jsonify(json_data)
    
if __name__ == '__main__':
    app.run(debug=True)
    conn.close()
# Đóng kết nối

