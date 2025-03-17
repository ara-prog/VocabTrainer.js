import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VocabTrainer() {
  const [vocabList, setVocabList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [mode, setMode] = useState("multipleChoice"); // Eingabe oder Multiple Choice

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://sheets.googleapis.com/v4/spreadsheets/1n5TBrOe5uOo79q--StsoiM1pDM7885kJ-ZeBDFtD_UQ/values/Sheet1?key=YOUR_API_KEY"
      );
      const data = await response.json();
      const formattedData = data.values.slice(1).map(([id, wordA, wordB, exampleA, exampleB, imageUrl, correct, incorrect]) => ({
        id,
        wordA,
        wordB,
        exampleA,
        exampleB,
        imageUrl,
        correct: parseInt(correct, 10) || 0,
        incorrect: parseInt(incorrect, 10) || 0,
      }));
      setVocabList(formattedData);
    }
    fetchData();
  }, []);

  const handleAnswer = (isCorrect) => {
    const updatedList = [...vocabList];
    if (isCorrect) {
      updatedList[currentIndex].correct += 1;
    } else {
      updatedList[currentIndex].incorrect += 1;
    }
    setVocabList(updatedList);
    setShowAnswer(false);
    setShowExample(false);
    setCurrentIndex((prev) => (prev + 1) % vocabList.length);
  };

  if (vocabList.length === 0) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-2">
        <Button onClick={() => setMode("multipleChoice")}>Multiple Choice</Button>
        <Button onClick={() => setMode("input")}>Eingabe</Button>
      </div>
      <Card className="w-96 text-center">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold">{vocabList[currentIndex].wordA}</h2>
          {vocabList[currentIndex].imageUrl && (
            <img src={vocabList[currentIndex].imageUrl} alt="Vocab Image" className="mx-auto my-2 w-40 h-40 object-cover" />
          )}
          {showAnswer && <p className="mt-2 text-lg">{vocabList[currentIndex].wordB}</p>}
          {showExample && (
            <p className="mt-2 text-sm italic">{vocabList[currentIndex].exampleA} - {vocabList[currentIndex].exampleB}</p>
          )}
        </CardContent>
      </Card>
      <div className="flex gap-4">
        <Button onClick={() => setShowAnswer(true)}>Antwort zeigen</Button>
        <Button onClick={() => setShowExample(true)}>Beispielsatz zeigen</Button>
        <Button variant="success" onClick={() => handleAnswer(true)}>Richtig</Button>
        <Button variant="destructive" onClick={() => handleAnswer(false)}>Falsch</Button>
      </div>
    </div>
  );
}
