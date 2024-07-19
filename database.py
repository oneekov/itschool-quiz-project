import sqlite3, os.path, json
from config import *

#класс для работы с БД
class Database:
    def __init__(self, name):
        #если БД отсутствует, запихиваем туда таблицу
        if os.path.exists(name):
            self.db = sqlite3.connect(name, check_same_thread=False)
            self.cursor = self.db.cursor()
        else:
            self.db = sqlite3.connect(name, check_same_thread=False)
            self.cursor = self.db.cursor()
            self.create_table()

    #просто создаём таблицу
    def create_table(self):
        self.cursor.execute("""CREATE TABLE "quiz" (
	"uid"	INTEGER,
	"name"	TEXT,
	"questions"	TEXT,
    "timer" INTEGER)""")
        self.cursor.execute("""CREATE TABLE "admins" (
	"username"	TEXT,
	"hash"	TEXT,
	"salt"	TEXT,
	"permissions"	TEXT)""")
        if create_test_quiz: self.cursor.execute("INSERT INTO quiz (uid, name, questions, timer) VALUES (?, ?, ?)", (1, "Тестовый квиз для демонстрации возможностей",
            """[
	{"question": "Что такое HTML?",
	"answers": ["Открытый текстовый протокол", "Язык гипертекстовой разметки", "Методология разработки программного обеспечения", "Графический редактор"],
	"correctanswer": 2,
	"hint": "Подсказка 1"},
	{"question": "Какая из следующих конструкций используется для цикла в JavaScript?",
	"answers": ["for", "if", "switch", "while"],
	"correctanswer": 1,
	"hint": "Подсказка 2"},
	{"question": "Что такое CSS?",
	"answers": ["Каскадные таблицы стилей", "Язык программирования", "Веб-сервер", "Тип базы данных"],
	"correctanswer": 1,
	"hint": "Подсказка 3"},
	{"question": "Как объявить переменную в Python?",
	"answers": ["var x = 5", "let x = 5", "const x = 5", "x = 5"],
	"correctanswer": 4,
	"hint": "Подсказка 4"},
	{"question": "Что такое SQL?",
	"answers": ["Язык структурированных запросов", "Графический интерфейс", "Система управления контентом", "Программный фреймворк"],
	"correctanswer": 1,
	"hint": "Подсказка 5"}
]""", 300000)) #страшно, но работает :troll:
        self.db.commit()
    
    #функция для получения информации об квизе по uid
    def get_quiz_by_uid(self, uid):
        self.cursor.execute("SELECT * FROM quiz WHERE uid = ?", (uid,))
        quiz = self.cursor.fetchone()
        return "0" if quiz == None else {"uid": quiz[0], "name": quiz[1], "qa": json.loads(quiz[2]), "timer": quiz[3]}
    
    #функция для получения вопросов и ответов об квизе по uid
    def get_qa_by_uid(self, uid):
        self.cursor.execute("SELECT questions FROM quiz WHERE uid = ?", (uid,))
        return "0" if self.cursor.fetchone() == None else json.loads(self.cursor.fetchone()[0])

    #функция для добавления квиза
    def add_quiz(self, name, qa): #задел для админ панели
        #qa нужно передавать в формате строки!!!
        self.cursor.execute("SELECT uid FROM quiz WHERE uid=(select max(uid) from quiz)")
        uid = self.cursor.fetchone()[0] + 1
        self.cursor.execute("INSERT INTO quiz (uid, name, questions) VALUES (?, ?, ?)", (uid, name, qa))
        self.db.commit()

    #догадайтесь сами
    def close(self):
        self.db.close()