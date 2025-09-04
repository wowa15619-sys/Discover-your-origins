import { GoogleGenAI, Type } from "@google/genai";
import { AncestryReport, UserData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateAncestryReport(userData: UserData): Promise<AncestryReport> {
  
  // Extract image data for the API
  const imageParts = userData.image.match(/^data:(image\/(?:png|jpeg|webp));base64,(.*)$/);
  if (!imageParts) {
    throw new Error("Invalid image data URL format");
  }
  
  const mimeType = imageParts[1];
  const base64Data = imageParts[2];
  
  const imagePart = {
    inlineData: {
      mimeType,
      data: base64Data,
    },
  };

  let prompt = `
    Analyze the facial features from the provided image to generate a plausible, detailed genetic ancestry report for the person shown.
    The report should be tailored to features suggesting Middle Eastern origins.
    The report must include:
    1. A brief, engaging summary.
    2. A percentage breakdown for different regions (e.g., Arabian Peninsula, North Africa, Levant, Anatolia, Persia). For each region, you MUST provide a confidence level (using only one of these exact Arabic words: 'مرتفع'، 'متوسط'، 'منخفض') based on the clarity of the visual markers.
    3. Interesting and detailed historical context for the top 2-3 major regions identified in the breakdown.

    Ensure the percentages add up to 100.
    The response must be in Arabic.
  `;

  if (userData.includeRegions && userData.includeRegions.length > 0) {
    prompt += `\nCRITICAL: Prioritize the analysis, percentage breakdown, and historical context on the following user-specified regions: ${userData.includeRegions.join('، ')}. Provide especially detailed historical context for these specific regions if they appear in the results. These regions are the user's main interest.`;
  }

  if (userData.excludeRegions && userData.excludeRegions.length > 0) {
    prompt += `\nCRITICAL: Strictly exclude these regions from the entire report: ${userData.excludeRegions.join('، ')}. Do not list them in the breakdown or mention them in the summary or historical context.`;
  }

  const textPart = { text: prompt };

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      summary: {
        type: Type.STRING,
        description: "ملخص عام جذاب لنتائج الأصول الجينية باللغة العربية.",
      },
      regionalBreakdown: {
        type: Type.ARRAY,
        description: "تفصيل النسب المئوية للمناطق الجينية باللغة العربية مع مستوى الثقة.",
        items: {
          type: Type.OBJECT,
          properties: {
            region: {
              type: Type.STRING,
              description: "اسم المنطقة الجغرافية باللغة العربية.",
            },
            percentage: {
              type: Type.NUMBER,
              description: "النسبة المئوية للأصل من هذه المنطقة.",
            },
            confidence: {
              type: Type.STRING,
              description: "مستوى الثقة في النسبة المئوية ('مرتفع'، 'متوسط'، 'منخفض') باللغة العربية."
            }
          },
          required: ["region", "percentage", "confidence"],
        },
      },
      historicalContexts: {
        type: Type.ARRAY,
        description: "معلومات تاريخية عن الأصول الجينية الرئيسية باللغة العربية.",
        items: {
            type: Type.OBJECT,
            properties: {
                region: {
                    type: Type.STRING,
                    description: "اسم المنطقة المرتبطة بالمعلومة التاريخية باللغة العربية."
                },
                context: {
                    type: Type.STRING,
                    description: "فقرة قصيرة تشرح السياق التاريخي لهذه المنطقة الجينية باللغة العربية."
                }
            },
            required: ["region", "context"]
        }
      }
    },
    required: ["summary", "regionalBreakdown", "historicalContexts"],
  };

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    const jsonString = response.text.trim();
    const parsedResponse = JSON.parse(jsonString);

    // Validate and normalize percentages to sum to 100
    if (parsedResponse.regionalBreakdown && parsedResponse.regionalBreakdown.length > 0) {
      let totalPercentage = parsedResponse.regionalBreakdown.reduce((sum: number, item: { percentage: number; }) => sum + item.percentage, 0);
      if (totalPercentage > 0 && totalPercentage !== 100) {
          const scale = 100 / totalPercentage;
          let runningTotal = 0;
          parsedResponse.regionalBreakdown.forEach((item: { percentage: number; }, index: number) => {
              if (index === parsedResponse.regionalBreakdown.length - 1) {
                  item.percentage = 100 - runningTotal;
              } else {
                  const newPercentage = Math.round(item.percentage * scale);
                  item.percentage = newPercentage;
                  runningTotal += newPercentage;
              }
          });
          // Final check to ensure the last element is non-negative
          if(parsedResponse.regionalBreakdown[parsedResponse.regionalBreakdown.length - 1].percentage < 0) {
            parsedResponse.regionalBreakdown[parsedResponse.regionalBreakdown.length - 1].percentage = 0;
          }
      }
    }


    return parsedResponse as AncestryReport;
  } catch (error) {
    console.error("Error fetching or parsing ancestry report:", error);
    throw new Error("Could not generate ancestry report from Gemini API.");
  }
}