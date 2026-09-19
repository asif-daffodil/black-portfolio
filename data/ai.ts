export interface AiFocusArea {
  id: string;
  code: string;
  title: string;
  badge: string;
  summary: string;
  highlights: string[];
  tech: string[];
}

export interface AiCodeSnippet {
  title: string;
  language: string;
  filename: string;
  code: string;
}

export const aiFocusAreas: AiFocusArea[] = [
  {
    id: 'ai-laravel-openai',
    code: 'AI-CORE-01',
    title: 'Laravel + OpenAI / Gemini Integration',
    badge: 'ENTERPRISE AI',
    summary: 'Bridging enterprise PHP/Laravel backends with frontier LLMs (OpenAI GPT-4o, Google Gemini 1.5/2.0) via robust streaming pipelines and strict JSON schema guarantees.',
    highlights: [
      'Server-Sent Events (SSE) for real-time token streaming to frontend clients.',
      'Deterministic output parsing using typed Pydantic-style JSON Schema contracts.',
      'Asynchronous queued prompt execution via Laravel Horizon & Redis.',
    ],
    tech: ['Laravel 11', 'OpenAI API', 'Gemini API', 'SSE Streaming', 'Redis Queues'],
  },
  {
    id: 'ai-agentic-workflows',
    code: 'AI-CORE-02',
    title: 'Autonomous Agentic Workflows & Tool-Use',
    badge: 'AUTONOMOUS WORKFLOWS',
    summary: 'Designing multi-turn autonomous coding and operations agents capable of recursive task planning, inspecting workspaces, and calling external APIs dynamically.',
    highlights: [
      'ReAct (Reasoning + Acting) loop execution with deterministic stop conditions.',
      'Function calling pipelines linking database queries, bash commands, and CRM updates.',
      'Multi-agent orchestration with specialized role agents and automated consensus.',
    ],
    tech: ['Agentic Workflows', 'Tool Calling', 'Function Schemas', 'Multi-Agent Loops'],
  },
  {
    id: 'ai-rag',
    code: 'AI-CORE-03',
    title: 'RAG & Vector Semantic Retrieval',
    badge: 'CONTEXT RETRIEVAL',
    summary: 'Developing enterprise Retrieval-Augmented Generation architectures to ground generative models in proprietary institutional databases and documentation.',
    highlights: [
      'Text chunking with sliding token windows and recursive hierarchical splitting.',
      'High-dimensional embedding generation using OpenAI text-embedding-3 / Gemini.',
      'Hybrid semantic vector search + full-text BM25 ranking in PostgreSQL (pgvector) / Pinecone.',
    ],
    tech: ['RAG', 'pgvector', 'Vector Embeddings', 'Cosine Similarity', 'Hybrid Search'],
  },
  {
    id: 'ai-enhanced-apis',
    code: 'AI-CORE-04',
    title: 'AI-Enhanced APIs & Resilient Microservices',
    badge: 'API RESILIENCE',
    summary: 'Hardening generative endpoints for production workloads with intelligent caching, token budgeting, circuit breaking, and latency optimization.',
    highlights: [
      'Semantic response caching via Redis to eliminate redundant LLM API costs.',
      'Automatic fallback routing across providers (OpenAI -> Anthropic -> Gemini).',
      'Token consumption metering, rate limiting, and tenant budget isolation.',
    ],
    tech: ['Redis Cache', 'Circuit Breakers', 'Token Budgeting', 'Provider Failover'],
  },
];

export const aiCodeSnippet: AiCodeSnippet = {
  title: 'Autonomous Agent Tool-Calling Service',
  language: 'php',
  filename: 'app/Services/AI/AgenticFlightService.php',
  code: `<?php

namespace App\\Services\\AI;

use Illuminate\\Support\\Facades\\Http;
use Illuminate\\Support\\Facades\\Cache;
use App\\Tools\\DatabaseInspectionTool;
use App\\Tools\\TelemetryAnalyzerTool;

class AgenticFlightService
{
    protected string $apiKey;
    protected string $model = 'gpt-4o';

    public function __construct()
    {
        $this->apiKey = config('services.openai.key');
    }

    /**
     * Execute autonomous multi-turn reasoning loop with function tool-calling
     */
    public function executeMissionDirective(string $directive, array $context = []): array
    {
        $messages = [
            ['role' => 'system', 'content' => 'You are an autonomous flight navigation AI.'],
            ['role' => 'user', 'content' => $directive]
        ];

        $tools = $this->getRegisteredFlightTools();

        for ($iteration = 0; $iteration < 5; $iteration++) {
            $response = Http::withToken($this->apiKey)
                ->timeout(30)
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => $this->model,
                    'messages' => $messages,
                    'tools' => $tools,
                    'tool_choice' => 'auto',
                    'temperature' => 0.2,
                ])->json();

            $message = $response['choices'][0]['message'];
            $messages[] = $message;

            // Stop condition: model returned final answer
            if (empty($message['tool_calls'])) {
                return [
                    'status' => 'SUCCESS',
                    'output' => $message['content'],
                    'iterations' => $iteration + 1
                ];
            }

            // Execute called tools and append results back to context
            foreach ($message['tool_calls'] as $toolCall) {
                $toolName = $toolCall['function']['name'];
                $arguments = json_decode($toolCall['function']['arguments'], true);

                $toolResult = $this->dispatchTool($toolName, $arguments);

                $messages[] = [
                    'role' => 'tool',
                    'tool_call_id' => $toolCall['id'],
                    'content' => json_encode($toolResult)
                ];
            }
        }

        return ['status' => 'MAX_ITERATIONS_REACHED', 'messages' => $messages];
    }
}`,
};
