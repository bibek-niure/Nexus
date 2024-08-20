import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export const analyzeSentiment = (text: string) => {
  const result = sentiment.analyze(text);
  if (result.score > 0) return "positive";
  if (result.score < 0) return "negative";
    else return "neutral";
};