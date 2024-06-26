import pytest
from app import app, db, Score

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    client = app.test_client()

    with app.app_context():
        db.create_all()
        yield client
        db.drop_all()

def test_add_score(client):
    response = client.post('/add_score', json={'total_score': 100})
    assert response.status_code == 200
    assert response.get_json()['message'] == 'Score added successfully!'

def test_get_scores(client):
    client.post('/add_score', json={'total_score': 100})
    client.post('/add_score', json={'total_score': 200})
    response = client.get('/get_scores')
    data = response.get_json()
    assert response.status_code == 200
    assert len(data) == 2
    assert data[0]['total_score'] == 100
    assert data[1]['total_score'] == 200
