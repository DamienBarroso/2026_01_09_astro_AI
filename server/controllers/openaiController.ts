import { Request, Response, NextFunction } from "express";
import OpenAI from 'openai';
import 'dotenv/config';

import { ServerError } from "../types";
// npm install openai

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string
});

// note: 2 DIFFERENT response objs here: 1 response from api to server, 1 res from server to client
// add OPEN_API_KEY to .env file

export default {

generateAstroData: async (req: Request, res: Response, next: NextFunction) => {
  const { userId, birthdate, birthplace, birthtime } = res.locals;

  if (!userId) {
    const error: ServerError = {
      log: 'no userId found',
      status: 500,
      message: { err: 'user must be created before generating astro data' },
    };
    return next(error);
  }

  const systemPrompt = `
You are an expert astrocartographer. Given a person's birth information:
- Date of birth: ${birthdate}
- Birth place: ${birthplace}
- Birth time: ${birthtime}

Extract and return ONLY this information in JSON format:
{
  "zodiac_sign": "exact zodiac sign",
  "age": "calculate age in years",
  "best_locations": ["location1", "location2", "location3", "location4", "location5"]
}

list of valid zodiac signs: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

Rules:
1. Calculate age based on current date ${new Date().toISOString().split('T')[0]}
2. Calculate astrology chart, based on birth details
3. Carefully and manually read the astrology chart.
4. Based on user astrology chart, calculate exactly 5 best locations for astrocartography, giving preference to sun, jupiter, and venus lines
5. Use proper location names (city, country format)
6. Make sure zodiac sign is valid, according to list above.
7. No additional text, only JSON
`.trim();


    try {
      const resp = await openai.responses.create({
        model: 'gpt-4o-mini',
        input: systemPrompt,
      });

      if (!resp.output_text){
        const error: ServerError = {
          log: 'OpenAI did not return a response',
          status: 500,
          message: {err: 'An error occurred while querying OpenAI'},
        };
        return next(error);
      }

      // store raw response for parsing onto res.locals
      console.log('rawOpenAIResp: ', resp.output_text)

      res.locals.rawOpenAIResp = resp.output_text;
      return next();

    } catch (err) {
      const error: ServerError = {
      log: `queryOpenAI: ${err}`,
      status: 500,
      message: { err: 'An error occurred while querying OpenAI' },
    };
    return next(error)
    }
  }

};
