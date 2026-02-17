import { type NextRequest, NextResponse } from "next/server";
import { OpenRouter } from "@openrouter/sdk";

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const stream = await openrouter.chat.send({
      chatGenerationParams: {
        model: "nvidia/nemotron-nano-12b-v2-vl:free",
        messages: [
          {
            role: "system",
            content: `
You are an AI assistant for a professional laundry and dry cleaning service website.

Your job:
1. Analyze clothing images.
2. Detect garment type.
3. Detect stains if visible.
4. Recommend correct service.
5. Return ONLY strict valid JSON.
6. Do NOT include explanations or text outside JSON.

If information is uncertain, lower confidence_score.
`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `
Analyze the uploaded clothing image.

Return ONLY valid JSON in this exact structure:

{
  "cloth_type": "string",
  "category": "casual | formal | ethnic | home_fabric | unknown",
  "fabric_type": "string_or_unknown",
  "stain_detected": true_or_false,
  "stain_type": "string_or_none",
  "recommended_service": "normal_wash | dry_clean | stain_treatment | steam_iron",
  "complexity_level": "low | medium | high",
  "care_risk_level": "low | medium | high",
  "auto_select_service": true_or_false,
  "auto_fill_booking_fields": {
    "suggested_service": "string",
    "priority": "normal | express"
  },
  "confidence_score": 0_to_1
}

Do not add any extra keys.
Do not explain anything.
`
              },
              {
                type: "image_url",
                imageUrl: {
                  url: image
                }
              }
            ]
          }
        ],
        stream: true
      }
    });

    let fullResponse = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
      }
    }

    try {
      const jsonStart = fullResponse.indexOf('{');
      const jsonEnd = fullResponse.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonContent = fullResponse.substring(jsonStart, jsonEnd + 1);
        const parsedData = JSON.parse(jsonContent);
        return NextResponse.json(parsedData);
      }
      throw new Error("No JSON found in response");
    } catch (parseError) {
      console.error("Failed to parse AI response:", fullResponse);
      return NextResponse.json({ error: "Invalid response from AI", raw: fullResponse }, { status: 500 });
    }

  } catch (error) {
    console.error("AI analysis error:", error);
    return NextResponse.json({ error: "Failed to analyze garment" }, { status: 500 });
  }
}
