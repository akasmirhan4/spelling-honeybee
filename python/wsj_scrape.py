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


def get_total_answers(answers):
    total = 0
    for answer in answers:
        if len(answer) == 4:
            total += 1
        elif len(answer) > 4:
            total += len(answer)
        # if answer has 7 unique letters, add 7 to total
        if len(set(answer)) == 7:
            total += 7
        # print(answer, total)
    return total


# genius 70%
# amazing 50%
# great 40%
# nice 25%
# solid 15%
# good 8%
# moving up 5%
# good start 2%

if __name__ == "__main__":
    game = get_today_game()
    output = {
        "displayDate": game["displayDate"],
        "centerLetter": game["centerLetter"],
        "outerLetters": game["outerLetters"],
        "validLetters": game["validLetters"],
        "answers": game["answers"],
    }
    print(json.dumps(output, indent=4))
    # print("NY Times Spelling Bee")
    # print("date: ", game["displayDate"])
    # print("center letter: ", game["centerLetter"])
    # print("outer letters: ", game["outerLetters"])
    # min_scores = {
    #     "genius": round(get_total_answers(game["answers"]) * 0.7),
    #     "amazing": round(get_total_answers(game["answers"]) * 0.5),
    #     "great": round(get_total_answers(game["answers"]) * 0.4),
    #     "nice": round(get_total_answers(game["answers"]) * 0.25),
    #     "solid": round(get_total_answers(game["answers"]) * 0.15),
    #     "good": round(get_total_answers(game["answers"]) * 0.08),
    #     "moving up": round(get_total_answers(game["answers"]) * 0.05),
    #     "good start": round(get_total_answers(game["answers"]) * 0.02),
    # }
    # print("Score Minimum Score: ", min_scores)

    # print("answers:", game["answers"])
    # print("total answers: ", get_total_answers(game["answers"]))
