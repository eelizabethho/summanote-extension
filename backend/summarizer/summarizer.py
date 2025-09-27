from openai import OpenAI
import os

# Create client (reads API key from environment variable)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Send a prompt and print the result
resp = client.chat.completions.create(
    model="gpt-5",
    messages=[
        {"role": "system", "content": "Summarize this text in one word."},
        {"role": "user", "content": "Artificial intelligence is machines showing intelligence, unlike humans or animals, defined as intelligent agents that act to achieve goals."}
    ]
)

print(resp.choices[0].message.content)
