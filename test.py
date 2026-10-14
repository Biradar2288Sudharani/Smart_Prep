# WAPP which will alter the column size
# Program for alter the column sizes in Employee table and 9ambatch database

import mysql.connector
def altercolumnsize():
    try:
        con = mysql.connector.connect(host = "localhost", user = "root", password = "Shankar2sep@", database = "9ambatch" )
        cur = con.cursor()
        ats = "ALTER TABLE Employee MODIFY Name VARCHAR(110)"
        cur.execute(ats)
        print("Alter column size is done !!!")
    except mysql.connector.DatabaseError as db:
        print("Problem in MySQL :", db)
# Main Program
altercolumnsize()