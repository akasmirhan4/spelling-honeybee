from bs4 import BeautifulSoup
import requests
import json

### NY Times Spelling Bee
# {'displayWeekday': 'Saturday', 'displayDate': 'April 27, 2024', 'printDate': '2024-04-27', 'centerLetter': 'b', 'outerLetters': ['a', 'c', 'e', 'l', 'o', 'p'], 'validLetters': ['b', 'a', 'c', 'e', 'l', 'o', 'p'], 'pangrams': ['placebo'], 'answers': ['placebo', 'able', 'allocable', 'appealable', 'baba', 'babble', 'babe', 'babel', 'bale', 'ball', 'baobab', 'bebop', 'beep', 'bell', 'belle', 'blab', 'bleep', 'blob', 'bloc', 'bloop', 'boba', 'bobble', 'bocce', 'bola', 'boll', 'bolo', 'boob', 'booboo', 'boop', 'cabal', 'cabala', 'cable', 'callable', 'capable', 'celeb', 'cobble', 'collab', 'label', 'lobe', 'lobo', 'oboe', 'palpable', 'peaceable', 'pebble', 'peelable', 'pleb', 'plebe'], 'id': 18925, 'freeExpiration': 0, 'editor': 'Sam Ezersky'}


def get_today_game():
    website = "https://www.nytimes.com/puzzles/spelling-bee"
    response = requests.get(website)
    soup = BeautifulSoup(response.content, "html.parser")
    # get embedded javascript
    scripts = soup.find_all("script")
    # get the 3rd script tag
    script = scripts[2]

    # get the object "window.gameData"
    _gameData = script.string.split("window.gameData = ")[1].split(";")[0]
    # convert the string to a dictionary
    gameData = json.loads(_gameData)

    return gameData["today"]


if __name__ == "__main__":
    game = get_today_game()
    print("NY Times Spelling Bee")
    print("date: ", game["displayDate"])
    print("center letter: ", game["centerLetter"])
    print("outer letters: ", game["outerLetters"])
    print("answers:")
    print(game["answers"])
