import requests

print("====================================================")
print("💖  MamaCare AI - Maternal & Child Health Support")
print("    Integrated AI-IVR Decision Support System")
print("====================================================\n")

# Step 1: Choose Language for testing
print("Select Language to Test:")
print("1. English (en)")
print("2. French (fr)")
print("3. Cameroon Pidgin (pg)")
lang_choice = input("\nEnter number (1/2/3): ")

lang_map = {"1": "en", "2": "fr", "3": "pg"}
selected_lang = lang_map.get(lang_choice, "en")

print(f"\n✅ Testing started in: {selected_lang.upper()}")
print("Type 'exit' to stop testing.\n")

while True:
    # Step 2: Get Input
    query = input("🧑 User: ")
    if query.lower() == 'exit':
        print("\nTesting ended. Stay safe! 👋")
        break

    if not query.strip():
        continue

    try:
        # Step 3: Send request to Python AI Engine
        # We include the 'language' field so Python knows which prompt to use
        response = requests.post(
            'http://127.0.0.1:8000/chat', 
            json={
                "query": query,
                "language": selected_lang
            }
        )
        
        data = response.json()

        if response.status_code == 200:
            # Step 4: Display the AI result
            print(f"\n💖 MamaCare AI: {data['response']}")
            
            # PROOF OF RAG: Display the medical sources found in your DB
            print("\n🔍 [Medical Context Retrieved from MongoDB]:")
            for i, src in enumerate(data.get('sources', []), 1):
                print(f"   {i}. {src}")
            print("-" * 60 + "\n")
        else:
            print(f"\n❌ AI Engine Error: {data.get('error')}\n")

    except Exception as e:
        print(f"\n❌ Connection Error: Ensure app.py is running on Port 8000. ({e})\n")