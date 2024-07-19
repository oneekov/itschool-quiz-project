from app import app
from database import Database
from config import *

db = Database(db_name)

@app.route("/api/getQuizQA/<quizid>")
def getAnswers(quizid):
    response = db.get_qa_by_uid(int(quizid)) if quizid.isdigit() else "0" #защита от дураков (проверяем quizid на то, нету ли там других символов помимо цифр)
    return response if response != "0" else {"error": "Invalid uid"} #проверяем ответ от бд (если 0, то такого квиза нет)

@app.route("/api/getQuizData/<quizid>")
def getData(quizid):
    response = db.get_quiz_by_uid(int(quizid)) if quizid.isdigit() else "0" #защита от дураков (проверяем quizid на то, нету ли там других символов помимо цифр)
    return response if response != "0" else {"error": "Invalid uid"} #проверяем ответ от бд (если 0, то такого квиза нет)

# @app.route("/api/test/createTable") #убрать на релизе
# def createTable():
#     db.create_table()
#     return "ok"