import os
import json

def main():
    # open mit_wordlist.txt
    current_dir = os.path.dirname(__file__)
    filename = "anagram_dictionary.txt"
    file_path = os.path.join(current_dir, filename)

    with open(file_path) as file:
        words = file.read().splitlines()
        # each line has a word and frequency separated by a tab
        # split each line into a tuple of (word, frequency)
        # sort the list of tuples by frequency



        
    print(f"Loaded {len(words)} words")
    print(words[:10])

    # save the sorted list of words to a new json file
    output_dir = os.path.join(current_dir, "output")
    os.makedirs(output_dir, exist_ok=True)
    output_filename = filename.replace(".txt", ".json")
    output_file_path = os.path.join(output_dir, output_filename)
    with open(output_file_path, "w") as file:
        json.dump(words, file, indent=4)


# run main() if this file is run as a script
if __name__ == "__main__":
    main()