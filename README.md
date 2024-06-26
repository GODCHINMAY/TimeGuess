# TimeGuess

This personal project involved creating a virtual environment between Flask and React to create a time guessing game. The game starts with the user
viewing 5 randomly generated, valid clocks (ex: 5:45 will show the hour hand 3/4 of the way to 6). The user enters the time they beleive it is.

Each round has 15 seconds, in the end, the total score is summed by adding the variations from the actual time measured by minutes. 

After the 5 rounds, the actual versus entered times with minute deviations is displayed along with a graph showing the % of people the user did better than.

The user then has the option to play the game again.

The graph is outputed by logging the total time into the SQLAlchemy database and using Axios + React-chart2-js libraries. 

TechStack: Python, Flask, React, JavaScript, CSS, SQLAlchemy