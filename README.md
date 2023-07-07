# TransGrammar
Grammar correction and highlighting tool

**TransGrammar** is a Syntactic and Semantic Assistant (SSA) that detects, highlights, and corrects grammatical and typographical errors in natural language text.

### [Learn more at transphere.com &rarr;](https://www.transphere.com/)

# Requirements
1. Python 3.10.7
2. Node v16.17.1

# Quick Start
     git clone https://github.com/Transphere-Sunyu/trans-grammar.git

# Install Packages
Backend

     cd backend && python -m venv venv
     
     source venv/bin/activate && pip3 install -r requirements.txt

     python3 -m spacy download en

Frontend
     
     cd frontend && npm i && npm run build
# Login to hugging face 
Enter your access token from your hugging face account

      huggingface-cli login
      
# Run the web application
Backend

     cd backend && uvicorn main:app --reload
     
Frontend
     
     cd frontend && npm run start
    

Open the website in your browser at http://localhost:3000
