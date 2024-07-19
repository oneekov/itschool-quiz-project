from flask import render_template
from app import app

@app.route('/')
def index():
    return render_template("index.html")

@app.route("/quiz/<quizid>")
def quiz(quizid):
    # question = "test" + quizid
    # answers = [
    #     ["f1", "test1"],
    #     ["f2", "test2"],
    #     ["f3", "test3"],
    #     ["f4", "test4"],
    # ] #test
    return render_template("quiz.html")