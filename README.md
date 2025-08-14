# Flowriter

A VS Code extension that seamlessly integrates AI-powered text transformations into your workflow, providing an elegant, non-blocking user experience.

*<!-- TODO: Add a GIF demo of the extension in action! -->*

## Features

- **In-place AI Actions:** Get definitions or translations for any word by simply typing a dot (`.`) after it.
- **Seamless Workflow:** No need to leave your editor or copy-paste. Suggestions appear right in the autocompletion list.
- **Innovative UX:** Flowriter solves API latency issues with a unique, animated inline placeholder, ensuring your typing flow is never interrupted.
- **LLM Powered:** Connects to your preferred LLM API for powerful and accurate text transformations.

## The Flow UX: A Better Way to Wait

Calling an external API always introduces a small delay. Other tools solve this with disruptive loading spinners or notifications that break your concentration.

Flowriter introduces a new, elegant solution. When you trigger an action, the target word is instantly replaced with an animated, same-length placeholder. This provides immediate, non-blocking feedback right where your attention is. You can continue your work, and when the API call completes, the placeholder is seamlessly replaced by the result.

## Getting Started

### Installation

1.  Install the extension from the [VS Code Marketplace](https://marketplace.visualstudio.com) (link to be added).

## Configuration

Before using Flowriter, you need to configure your LLM provider details.

1.  Open VS Code Settings (`Cmd/Ctrl + ,`).
2.  Search for `flowriter`.
3.  You will see three settings:
    -   **Flowriter: Api Endpoint**: **Crucially, set this to the correct endpoint for your LLM service** (e.g., `https://api.example.com/v1/chat/completions`). The default is an example and will not work.
    -   **Flowriter: Api Key**: Enter your LLM API key here.
    -   **Flowriter: Model Name**: Enter the specific model name you wish to use (e.g., `gpt-4`, `claude-3-opus-20240229`).
4.  Settings are saved automatically.

## How to Use

1.  In a supported file (like `.js`, `.ts`, `.md`, etc.), type any word.
2.  Immediately after the word, type a dot (`.`).
3.  A suggestion box will appear with `definition` and `translation` options.
4.  Select an option using your arrow keys and press `Enter` or `Tab`.
5.  Watch as the word is replaced by a subtle animation, which is then replaced by the final result from the AI.

## License

This project is licensed under the MIT License.
