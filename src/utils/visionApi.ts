// src/services/visionApi.ts
import axios from 'axios';

// Interface for Vision API results (only name and confidence)
interface VisionApiResult {
  name: string;
  confidence: number;
}

// Replace with your actual Google Vision API key
const VISION_API_KEY = 'AIzaSyDDb6LzElx8fwVsKEs6OjsEPz3936b5iYI';
const VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${VISION_API_KEY}`;

export async function analyzeImageWithVision(imageBase64: string): Promise<VisionApiResult[]> {
  try {
    const requestBody = {
      requests: [
        {
          image: {
            content: imageBase64.split(',')[1], // Remove "data:image/jpeg;base64," prefix
          },
          features: [
            {
              type: 'LABEL_DETECTION',
              maxResults: 10,
            },
          ],
        },
      ],
    };

    const response = await axios.post(VISION_API_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const labels = response.data.responses[0]?.labelAnnotations || [];
    const foodItems = labels
      .filter((label: any) => label.description.toLowerCase().includes('food') || isFoodRelated(label.description))
      .map((label: any) => ({
        name: String(label.description),
        confidence: label.score * 100,
      }));

    if (foodItems.length === 0) {
      throw new Error('No food items detected in the image.');
    }

    return foodItems;
  } catch (error) {
    console.error('Error calling Vision API:', error);
    throw new Error('Failed to analyze image with Vision API');
  }
}

function isFoodRelated(description: string): boolean {
  const foodKeywords = ['food', 'dish', 'meal', 'fruit', 'vegetable', 'meat', 'dessert'];
  return foodKeywords.some(keyword => description.toLowerCase().includes(keyword));
}