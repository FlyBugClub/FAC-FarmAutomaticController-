import pyodbc 
from flask import Flask, jsonify
import json
# Thiết lập các thông số kết nối
server = 'sql.bsite.net\MSSQL2016'  # Tên server và instance của SQL Server
database = 'ngunemay123_SampleDB'     # Tên cơ sở dữ liệu của bạn
username = 'ngunemay123_SampleDB'                   # Tên người dùng SQL Server
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
@app.route('/api/hello', methods=['GET'])
def hello():
    cursor.execute('SELECT * FROM tbl_Humid')
    # Lấy tất cả các dòng dữ liệu
    rows = cursor.fetchall()

    # Chuyển đổi dữ liệu thành một danh sách các từ điển
    results = []
    for row in rows:
        result = {}
        for i, column in enumerate(cursor.description):
            result[column[0]] = row[i]
        results.append(result)

    # Trả về dữ liệu dưới dạng JSON
    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=True)
    conn.close()
# Đóng kết nối

