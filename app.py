from flask import Flask, render_template, jsonify

app = Flask(__name__)

# Variable to store the high score
high_score = 0

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/game')
def game():
    return render_template('game.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/team')
def team():
    return render_template('team.html')

@app.route('/tutorial')
def tutorial():
    return render_template('tutorial.html')

@app.route('/submit_score/<int:score>', methods=['POST'])
def submit_score(score):
    global high_score
    if score > high_score:
        high_score = score
    return jsonify({"high_score": high_score})

if __name__ == '__main__':
    app.run(debug=True)
