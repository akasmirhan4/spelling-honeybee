"use client";

type WordListProps = {
  words: string[];
};

export function WordList({ words }: WordListProps): JSX.Element {
  return (
    <div className="border-gray mr-10 flex flex-1 flex-col rounded-md border">
      <h3 className="px-6 py-4">{`You have found ${words.length} word${words.length > 1 ? "s" : ""}`}</h3>
      <div className="flex flex-col overflow-y-auto">
        {words.map((word, index) => (
          <div
            key={index}
            className="border-gray mx-4 mb-3 w-1/2 border-b px-2 py-1"
          >
            <span className="">{word}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
