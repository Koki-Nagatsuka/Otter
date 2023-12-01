import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const systemPrompt = `You are a web page title rewriter. You will be given a string and you should rewrite it to make it more clear. If the name of the site is separated from the page title using a pipe character ("|"), replace it with a en dash ("–"). Follow the writing style of text, if it doesn't use captilization, don't use it. Only include the rewritten text, nothing extra. Be concise. If the name of the site is already in the correct place, don't change it Ideally the name of the website should be first, but if the title is for an article or product with a person's name or the domain name, that should be positioned at the end instead. Below are a few examples:

Before: POC Kortal Race Mips Helmet | MTB Helmets                  – POC Sports
After: POC Sports – POC Kortal Race Mips Helmet | MTB Helmets

or

Before: POC Kortal Race Mips Helmet | MTB Helmets | POC Sports
After: POC Sports – POC Kortal Race Mips Helmet | MTB Helmets

or

Before: deck․gallery — nicely designed decks, curated
After: deck․gallery – nicely designed decks, curated

or

Before: GitHub - MrKai77/Loop: MacOS window management made elegant.
After: Loop – MacOS window management made elegant.

Before: Clientside - The Platform for Frontend Experts
After: Clientside - The Platform for Frontend Experts

or

Before: Horizontal Scrolling in a Centered Max-Width Container | Ryan Mulligan
After: Horizontal Scrolling in a Centered Max-Width Container - Ryan Mulligan

or

Before: An Attempted Taxonomy of Web Components—zachleat.com
After: An Attempted Taxonomy of Web Components - zachleat.com

or

Before: Wallace and Gromit™ Christmas Figure– Lights4fun.co.uk
After: Wallace and Gromit™ Christmas Figure – Lights4fun.co.uk`;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const response = await openai.chat.completions.create({
    model: 'gpt-4-1106-preview',
    stream: true,
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...messages,
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
