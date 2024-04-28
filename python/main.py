def find_words_with_letters(word_list, letters):
    valid_words = []
    for word in word_list:
        if set(word).issubset(letters):
            valid_words.append(word)
    return valid_words


def init_results(words, outer_letters, center_letter, print_results=True):
    # Find words containing the valid_letter & important_letter
    matching_words = find_words_with_letters(words, outer_letters + center_letter)

    # Filter out words that are less than 4 characters long
    matching_words = [word for word in matching_words if len(word) >= 4]

    # Filter out the matching words so that it must have at least one important letter
    matching_words = [word for word in matching_words if center_letter in word]

    if print_results:
        # Print the matching words
        for word in matching_words:
            print(word)
        print(f"Found {len(matching_words)} words")

    return matching_words, len(matching_words)
