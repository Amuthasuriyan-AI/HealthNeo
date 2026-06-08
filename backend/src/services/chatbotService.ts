import { Configuration, OpenAIApi } from 'openai';
import { config } from '../config/config';

/**
 * OpenAI Chatbot Service
 * Handles AI chatbot conversations using OpenAI API
 */
export class ChatbotService {
  private openai: OpenAIApi;
  private systemPrompt: string;

  constructor() {
    const configuration = new Configuration({
      apiKey: config.openai.apiKey,
    });
    this.openai = new OpenAIApi(configuration);

    // System prompt for medical AI
    this.systemPrompt = `You are MediBot AI, a helpful healthcare assistant. 
    
IMPORTANT DISCLAIMER: Always include this message in your first response to users:
"This AI assistant provides informational support only and does not replace professional medical advice, diagnosis, or treatment."

Your responsibilities:
1. Provide accurate health information
2. Help users understand symptoms (not diagnose)
3. Suggest when professional medical consultation is needed
4. Provide medicine information
5. Give general wellness advice
6. Always encourage users to consult healthcare professionals for serious concerns

Guidelines:
- Never provide definitive diagnoses
- Always recommend consulting a healthcare professional for serious concerns
- Be empathetic and supportive
- Provide reliable medical information
- Clarify limitations of AI assistance
- Suggest appropriate next steps (appointment booking, etc.)`;
  }

  /**
   * Send message to ChatGPT
   */
  async chat(
    userMessage: string,
    conversationHistory: Array<{ role: string; content: string }>
  ): Promise<string> {
    try {
      const messages = [
        { role: 'system', content: this.systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ];

      const response = await this.openai.createChatCompletion({
        model: config.openai.model,
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
      });

      return (
        response.data.choices[0].message?.content ||
        'Sorry, I could not generate a response.'
      );
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to get chatbot response');
    }
  }

  /**
   * Analyze symptoms
   */
  async analyzeSymptoms(symptoms: string): Promise<string> {
    const prompt = `Based on these symptoms: "${symptoms}"
    Please provide:
    1. Possible conditions (not diagnosis)
    2. Risk level (low/medium/high)
    3. Recommended actions
    4. When to see a doctor
    
    Remember: This is informational only, not a diagnosis.`;

    return this.chat(prompt, []);
  }

  /**
   * Provide medicine information
   */
  async getMedicineInfo(medicineName: string): Promise<string> {
    const prompt = `Provide detailed information about ${medicineName}:
    1. Generic and brand names
    2. Common uses
    3. Dosage information
    4. Common side effects
    5. Precautions
    6. Drug interactions
    
    Note: Always recommend consulting a pharmacist or doctor.`;

    return this.chat(prompt, []);
  }

  /**
   * Generate health tip
   */
  async generateHealthTip(): Promise<string> {
    const prompt = `Generate a helpful, practical daily health tip for a general audience.
    Keep it concise (2-3 sentences) and actionable.`;

    return this.chat(prompt, []);
  }
}

export const chatbotService = new ChatbotService();
