import google.generativeai as genai

# Use the stable gemini-pro model
genai.configure(api_key="AIzaSyDR5jCP7I6cLZJ1WydkL6ugOk__TblG_Iw")

# CHANGE: Using "gemini-pro" instead of "gemini-1.5-flash"
model = genai.GenerativeModel("gemini-pro")

try:
    print("Testing connection to Google AI Studio...")
    response = model.generate_content("Say 'The AI is alive!'")
    print("\n✅ SUCCESS!")
    print(f"AI Response: {response.text}")
except Exception as e:
    print("\n❌ STILL ERROR:")
    print(e)