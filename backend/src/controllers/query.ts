import { Request, Response } from 'express';
import { enhanceQuery } from '../services/queryEnhancer';
import { retrieveArticles } from '../services/articleRetriever';
import { retrieveLLMAnswer } from '../services/llmAnswerRetriever';

export const handleQuery = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body || !req.body.query) {
      res.status(400).json({ error: 'No query provided' });
      return;
    }
    const query = req.body.query;
    const enhancedQueries = await enhanceQuery(query);
    const articles = await retrieveArticles(enhancedQueries);
    const answersResponse = await retrieveLLMAnswer(query, articles);

    res.json({ answersResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process the query' });
  }
}