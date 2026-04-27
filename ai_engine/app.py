import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from pathlib import Path
import traceback

# LangChain Imports
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import CharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings

# --- LOAD ENV ---
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

# --- GEMINI SDK CONFIGURATION ---
# transport='rest' is used for better stability on localhost/Windows
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"), transport='rest')

# Using the version as per your requirement
model = genai.GenerativeModel("gemini-2.5-flash")

app = Flask(__name__)
CORS(app)

# =========================
# EMBEDDINGS (LOCAL)
# =========================
# Runs on your CPU, no API key needed. Highly accurate for medical text.
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vector_db = None

# =========================
# STATUS ENDPOINT
# =========================
@app.route('/status', methods=['GET'])
def get_status():
    global vector_db
    if vector_db is None and os.path.exists("faiss_index"):
        vector_db = FAISS.load_local(
            "faiss_index",
            embeddings,
            allow_dangerous_deserialization=True
        )
    return jsonify({
        "is_trained": vector_db is not None,
        "vector_count": vector_db.index.ntotal if vector_db else 0,
        "engine": "MamaCare AI - Gemini 2.5 + RAG"
    })

# =========================
# TRAIN ENDPOINT
# =========================
@app.route('/train', methods=['POST'])
def train_model():
    global vector_db
    data = request.json
    documents = data.get('documents', [])

    if not documents:
        return jsonify({"error": "No documents provided"}), 400

    try:
        splitter = CharacterTextSplitter(
            separator="\n",
            chunk_size=800, 
            chunk_overlap=150
        )

        chunks = splitter.create_documents(documents)

        # Build FAISS database
        vector_db = FAISS.from_documents(chunks, embeddings)
        vector_db.save_local("faiss_index")

        print(f"✅ Medical Knowledge Base updated. Chunks: {len(chunks)}")
        return jsonify({
            "message": f"Trained on {len(documents)} healthcare docs",
            "vector_count": vector_db.index.ntotal
        })

    except Exception as e:
        print("TRAIN ERROR:", e)
        return jsonify({"error": str(e)}), 500

# =========================
# CHAT ENDPOINT (TRILINGUAL + AUTO)
# =========================
@app.route('/chat', methods=['POST'])
def chat():
    global vector_db
    data = request.json
    
    # 1. Get query and language from request
    user_query = data.get('query')
    # Default to 'auto' to ensure intelligence across all platforms
    language = data.get('language', 'auto') 

    print(f"\n--- New Chat Request ---")
    print(f"Query: {user_query}")
    print(f"Language Strategy: {language}")

    if not user_query:
        return jsonify({"error": "Query is required"}), 400

    # 2. Locate the database folder using absolute paths
    current_dir = os.path.dirname(os.path.abspath(__file__))
    index_path = os.path.join(current_dir, "faiss_index")

    if not os.path.exists(index_path):
        print("❌ CRITICAL: faiss_index folder not found!")
        return jsonify({
            "response": "Mami, I never learn the medical rules yet. Abeg tell Admin for click 'Sync AI Brain' button for website."
        })

    try:
        # 3. Load/Reload the Vector Database
        vector_db = FAISS.load_local(
            index_path,
            embeddings,
            allow_dangerous_deserialization=True
        )

        # 4. Search for the top 3 most relevant medical guidelines
        docs = vector_db.similarity_search(user_query, k=3)
        context = "\n".join([f"- {doc.page_content}" for doc in docs])
        print(f"✅ Found {len(docs)} relevant medical facts.")

        # 5. Configure Language and Tone Instructions (ADDED AUTO DETECTION)
        if language == 'fr':
            lang_instr = "Respond ONLY in French. Use a compassionate tone for a mother (Maman)."
            fallback = "Je suis désolé, je n'ai pas cette information médicale précise. Veuillez consulter un agent de santé communautaire."
        elif language == 'pg':
            lang_instr = "Respond ONLY in Cameroon Pidgin English. Use words like 'pikin', 'mami', 'hot body', 'don'. Be very clear."
            fallback = "Mami, I no get that information for here oh. Abeg see some community health worker for help you."
        elif language == 'en':
            lang_instr = "Respond ONLY in English. Be clear, friendly, and professional."
            fallback = "I'm sorry, I don't have that specific medical information. Please consult a community health worker."
        else:
            # ✅ THIS IS THE AUTO DETECTION LOGIC
            lang_instr = "Detect the user's language and respond in that same language (English, French, or Cameroon Pidgin)."
            fallback = "I don't know / Je ne sais pas / I no know."

        # 6. Build the Healthcare Prompt
        prompt = f"""
You are MamaCare AI, a professional medical decision-support assistant for caregivers in Cameroon.
{lang_instr}

INSTRUCTIONS:
1. Use ONLY the Medical Context below to provide first-aid guidance.
2. If symptoms look very dangerous (like breathing failure, blue lips, or unconsciousness), tell them to go to the hospital IMMEDIATELY.
3. If the answer is NOT in the context, use this exact phrase: "{fallback}"
4. Stick to first aid and basic care (like ORS for diarrhea).

MEDICAL CONTEXT FROM DATABASE:
{context}

CAREGIVER'S QUESTION:
{user_query}

YOUR RESPONSE:
"""

        # 7. Generate AI Response using Gemini
        response = model.generate_content(prompt)
        
        # Clean the response text
        bot_answer = response.text.strip()
        print(f"✅ AI Response generated successfully.")

        return jsonify({
            "response": bot_answer,
            "sources": [doc.page_content for doc in docs]
        })

    except Exception as e:
        print("\n❌ CHAT ERROR:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# =========================
# RUN SERVER
# =========================
if __name__ == '__main__':
    print("🚀 MamaCare AI Engine starting...")
    print("📍 Medical Support URL: http://127.0.0.1:8000")
    app.run(port=8000, debug=True)