---
title: EconSearch
emoji: 🏛️
colorFrom: gray
colorTo: gray
sdk: docker
pinned: false
license: mit
short_description: AI-powered academic economics research assistant.
---

# 🏛️ EconSearch: Advanced Research & Policy Analysis Interface

**EconSearch** is a high-precision research interface designed specifically for economists, policy analysts, and academics. Unlike general-purpose search engines, EconSearch leverages **Google's Gemini 2.5 Flash** model with grounding capabilities to synthesize peer-reviewed journals (AER, QJE, JPE) and high-quality working papers (NBER, CEPR) into structured, actionable intelligence.

The interface is built with a "classical" design philosophy—prioritizing high readability, strictly rectangular action elements, and a distraction-free "paper-white" environment suitable for deep work.

## ✨ Key Features

*   **Rigorous Academic Search:** Restricts results to seminal works, high-impact recent studies, and reputable platforms.
*   **Structured Synthesis:** Instead of generic abstracts, every paper is broken down into:
    *   **Executive Summary:** Concise, academic tone.
    *   **Key Findings:** Bulleted empirical results.
    *   **Policy Implementations:** Practical applications for policymakers.
*   **Metadata Rich:** Includes Citation Counts, DOIs/Paper IDs, Authors, Journals, and Publication Years.
*   **Smart Filtering:** Filter results by specific Authors, Journals/Platforms, and Publication Periods.
*   **Refinement Logic:** Suggests "Clarification Queries" to narrow down broad topics and allows for query continuation.
*   **Direct Access:** Provides direct links to original papers and lists related topics for lateral research.

## 🛠️ Technical Architecture

*   **Model:** Google Gemini 2.5 Flash (`gemini-2.5-flash`) via the `@google/genai` SDK.
*   **Grounding:** Utilizes Google Search Grounding tools to ensure factual accuracy and retrieve real-world URLs and citation estimates.
*   **Frontend:** React 19 (TypeScript).
*   **Styling:** Tailwind CSS with a custom "Academic" configuration (Serif typography, high-contrast monochrome palette).
*   **State Management:** React Hooks for handling asynchronous search states.

## 🚀 Installation & Setup

To run this project locally:

1.  **Clone the repository**
    ```bash
    git clone https://huggingface.co/spaces/your-username/econsearch
    cd econsearch
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory and add your Google GenAI API key:
    ```bash
    API_KEY=your_google_api_key_here
    ```

    *Note: You can obtain an API key from [Google AI Studio](https://aistudio.google.com/).*

4.  **Run Locally**
    ```bash
    npm start
    ```

## 🎨 Design Philosophy

The UI rejects modern "flashy" trends (gradients, rounded corners, emojis) in favor of an aesthetic that mimics a clean academic journal:
*   **Font:** Helvetica Neue (Headers/Meta) mixed with Georgia/Times New Roman (Content).
*   **Palette:** Warm Paper White (`#fdfbf7`), Soft Black (`#1a1a1a`), and Strict Black accents.
*   **UX:** Information density is managed via collapsible "Analysis & Policy" sections.

## 📄 License

MIT
