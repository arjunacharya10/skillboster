import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

import { type ChallengeRequest, type Challenge } from "@shared/schema";

interface OpenAIChallenge {
  title: string;
  description: string;
  timeHours: number;
  timeMinutes: number;
  requirements: string[];
  resources: {
    title: string;
    url: string;
  }[];
  tags: string[];
}

export async function generateChallenges(
  request: ChallengeRequest
): Promise<Omit<Challenge, "id" | "createdAt">[]> {
  try {
    const { field, expertiseLevel, timeHours, timeMinutes, focusArea, count } = request;

    const totalMinutes = timeHours * 60 + timeMinutes;
    
    // Determine if this is a professional field or a hobby/personal development area
    const isProfessional = [
      "software-development", "data-science", "design", "marketing", 
      "content-creation", "business", "finance", "education", 
      "healthcare", "project-management"
    ].includes(field);
    
    const isArtistic = [
      "writing", "visual-art", "music", "photography", "filmmaking"
    ].includes(field);
    
    const isCraft = [
      "crafts", "woodworking", "cooking", "gardening", "home-diy"
    ].includes(field);
    
    const isPersonalDevelopment = [
      "language-learning", "fitness", "meditation", "volunteering", "public-speaking"
    ].includes(field);
    
    let domainType = "";
    if (isProfessional) domainType = "professional field";
    else if (isArtistic) domainType = "creative practice";
    else if (isCraft) domainType = "craft or making activity";
    else if (isPersonalDevelopment) domainType = "personal development area";
    else domainType = "area of interest";

    const systemPrompt = `You are an expert coach specializing in creating growth and development challenges. 
    Your task is to generate ${count} practical, realistic, and actionable challenges for a person in the ${domainType} of ${field} 
    with an expertise level of ${expertiseLevel}. 
    Each challenge should be completable within approximately ${totalMinutes} minutes.
    ${focusArea ? `Focus specifically on the area of: ${focusArea}` : ""}
    
    The challenges should be specific, actionable, and help the user develop relevant skills in their field.
    For requirements, list 3-6 specific things that must be accomplished to complete the challenge.
    For resources, provide 1-3 actual links or resources (with titles and URLs) that would help complete the challenge.
    For tags, provide 2-5 relevant skill tags that the challenge helps develop.
    
    Structure each challenge exactly according to the specified JSON format:
    {
      "challenges": [
        {
          "title": "Challenge Title",
          "description": "Detailed description of the challenge",
          "timeHours": 1,
          "timeMinutes": 30,
          "requirements": ["Requirement 1", "Requirement 2", "Requirement 3"],
          "resources": [
            { "title": "Resource Title", "url": "https://example.com" }
          ],
          "tags": ["Skill1", "Skill2", "Skill3"]
        }
      ]
    }
    `;

    const userPrompt = `Generate ${count} challenges for someone with ${expertiseLevel} level in ${field}${
      focusArea ? ` focusing on ${focusArea}` : ""
    } that can be completed in ${totalMinutes} minutes or less.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    
    if (!content) {
      throw new Error("Failed to generate challenges: Empty response from OpenAI");
    }

    const jsonResponse = JSON.parse(content);
    
    if (!jsonResponse.challenges || !Array.isArray(jsonResponse.challenges)) {
      throw new Error("Invalid response format from OpenAI");
    }

    return jsonResponse.challenges.map((challenge: OpenAIChallenge) => ({
      title: challenge.title,
      description: challenge.description,
      field,
      expertiseLevel,
      timeHours: challenge.timeHours || timeHours,
      timeMinutes: challenge.timeMinutes || timeMinutes,
      requirements: challenge.requirements,
      resources: challenge.resources,
      tags: challenge.tags,
    }));
  } catch (err) {
    console.error("Error generating challenges:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to generate challenges: ${errorMessage}`);
  }
}
