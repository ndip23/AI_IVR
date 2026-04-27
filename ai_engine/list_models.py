import google.generativeai as genai

genai.configure(api_key="AIzaSyDR5jCP7I6cLZJ1WydkL6ugOk__TblG_Iw")

print("Checking available models for your API key...")

try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"✅ FOUND MODEL: {m.name}")
except Exception as e:
    print(f"❌ ERROR: {e}")