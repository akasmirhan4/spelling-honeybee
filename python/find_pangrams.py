import json
import os
from main import init_results

import multiprocessing
from tqdm import tqdm
import matplotlib.pyplot as plt

RESET_CALCULATION = False
PLOT_HISTOGRAM = False

lower_bound = 20
upper_bound = 100

DICTIONARY_FILENAME = "anagram_dictionary.json"


def get_results(valid_letters):
    # load the JSON file containing the pangram data
    current_dir = os.path.dirname(__file__)
    file_path = os.path.join(current_dir, "output", "output_" + DICTIONARY_FILENAME)
    with open(file_path) as file:
        results = json.load(file)

    print(f"Loaded {len(results)} pangrams")

    center_letter = valid_letters[0]
    outer_letters = valid_letters[1:]
    # sort the outer letters
    outer_letters = "".join(sorted(outer_letters))

    valid_letters = center_letter + outer_letters

    print(valid_letters)

    selected_pangram = center_letter + outer_letters

    return results[selected_pangram]["answers"]


def process_pangram(args):
    pangram, words = args
    results = {}
    for center_letter in pangram:
        # replace the center letter with an empty string and sort the outer letters
        outer_letters = pangram.replace(center_letter, "")
        outer_letters = "".join(sorted(outer_letters))
        answers, n = init_results(words, outer_letters, center_letter, False)
        # print(f"{center_letter}-{outer_letters}: {n}")
        results[center_letter + outer_letters] = {
            "centerLetter": center_letter,
            "outerLetters": list(outer_letters),
            "validLetters": list(center_letter + outer_letters),
            "answers": answers,
            "count": n,
        }
    return results


def get_possible_games():
    if RESET_CALCULATION:
        # Load the JSON file containing the list of words
        current_dir = os.path.dirname(__file__)
        file_path = os.path.join(current_dir, "output", DICTIONARY_FILENAME)
        with open(file_path) as file:
            words = json.load(file)

        print(f"Loaded {len(words)} words")

        print("First 10 words:")
        print(words[:10])

        # Find words of at exactly 7 unique characters
        pangrams = [word for word in words if len(set(word)) == 7]

        clean_pangrams = []
        for pangram in pangrams:
            # remove duplicated letters
            pangram = "".join(sorted(set(pangram)))
            clean_pangrams.append(pangram)
        # remove duplicates from the list
        pangrams = list(set(clean_pangrams))
        print(f"Found {len(pangrams)} pangrams")

        # find "adehopt"
        print("adehopt" in pangrams)

        possible_games = {}

        with multiprocessing.Pool() as pool:
            with tqdm(total=len(pangrams)) as pbar:
                for result in pool.imap_unordered(
                    process_pangram, [(pangram, words) for pangram in pangrams]
                ):
                    for pangram, data in result.items():
                        possible_games[pangram] = data
                    pbar.update()

        print(f"Found {len(possible_games)} possible games")
        print(f"First 3 games:", dict(list(possible_games.items())[:3]))

        output_dir = os.path.join(current_dir, "output")
        os.makedirs(output_dir, exist_ok=True)
        output_file_path = os.path.join(output_dir, f"output_{DICTIONARY_FILENAME}")
        with open(output_file_path, "w") as file:
            json.dump(possible_games, file, indent=4)
    else:
        # Load the JSON file containing the list of words
        current_dir = os.path.dirname(__file__)
        file_path = os.path.join(current_dir, "output", f"output_{DICTIONARY_FILENAME}")
        with open(file_path) as file:
            possible_games = json.load(file)

    if PLOT_HISTOGRAM:
        # create a histogram of the number of words for each pangram
        histogram = {}
        for pangram, data in possible_games.items():
            count = data["count"]
            if count not in histogram:
                histogram[count] = []
            histogram[count].append(pangram)

        # plot
        x = list(histogram.keys())
        y = [len(histogram[key]) for key in x]
        plt.xlabel("Number of words")
        plt.ylabel("Number of pangrams")
        plt.bar(x, y)

        plt.plot()
    return possible_games


def main():
    possible_games = get_possible_games()
    print("Loaded", len(possible_games), "pangrams")

    # select games based on the upper and lower bounds
    selected_games = {}
    for pangram, data in possible_games.items():
        count = data["count"]
        if lower_bound <= count <= upper_bound:
            selected_games[pangram] = data

    # count the first letters of the pangrams
    first_letters = {}
    for pangram in selected_games.keys():
        first_letter = pangram[0]
        if first_letter not in first_letters:
            first_letters[first_letter] = 0
        first_letters[first_letter] += 1
    print(first_letters)
    print("Selected", len(selected_games), "pangrams")

    # store the selected games
    current_dir = os.path.dirname(__file__)
    output_dir = os.path.join(current_dir, "output")
    os.makedirs(output_dir, exist_ok=True)
    output_file_path = os.path.join(output_dir, "output_selected_games.json")
    with open(output_file_path, "w") as file:
        json.dump(selected_games, file, indent=4)




if __name__ == "__main__":
    main()
