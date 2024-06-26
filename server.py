from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///scores.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)

class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    total_score = db.Column(db.Integer, nullable=False)

@app.route('/add_score', methods=['POST'])
def add_score():
    data = request.get_json()
    new_score = Score(total_score=data['total_score'])
    db.session.add(new_score)
    db.session.commit()
    return jsonify({'message': 'Score added successfully!'})

@app.route('/get_scores', methods=['GET'])
def get_scores():
    scores = Score.query.all()
    return jsonify([{'id': score.id, 'total_score': score.total_score} for score in scores])

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True, use_reloader=False)
