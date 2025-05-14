import os
import json
from tqdm import tqdm
from google.cloud import texttospeech

# Set the path to your Google Cloud credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = ".config.json"

def text_to_speech(text, filename):
    """Convert text to Egyptian Arabic speech and save as MP3"""
    try:
        client = texttospeech.TextToSpeechClient()

        synthesis_input = texttospeech.SynthesisInput(text=text)

        # Use Egyptian Arabic voice
        voice = texttospeech.VoiceSelectionParams(
            language_code="ar-XA",  # Egyptian Arabic
            name="ar-XA-Chirp3-HD-Algenib"  # Choose a supported voice
        )

        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.LINEAR16,  # WAV format
            sample_rate_hertz=24000  # High quality sample rate
        )

        response = client.synthesize_speech(
            input=synthesis_input, voice=voice, audio_config=audio_config
        )

        # Save the audio file
        with open(filename, "wb") as out:
            out.write(response.audio_content)
        return True
    except Exception as e:
        print(f"Error converting text to speech for {filename}: {str(e)}")
        return False

def process_translations(json_file="Audio_Translations.json"):
    output_dir = "audio_output"
    os.makedirs(output_dir, exist_ok=True)

    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            translations = json.load(f)
    except Exception as e:
        print(f"Error reading JSON file: {str(e)}")
        return

    print("Converting text to Egyptian Arabic speech...")
    skipped = 0
    created = 0
    failed = 0

    for key, text in tqdm(translations.items()):
        output_file = os.path.join(output_dir, f"{key}.wav")  # Changed to .wav extension
        
        # Skip if file already exists
        if os.path.exists(output_file):
            print(f"Skipped (already exists): {output_file}")
            skipped += 1
            continue
            
        if text_to_speech(text, output_file):
            print(f"Created: {output_file}")
            created += 1
        else:
            print(f"Failed to create: {output_file}")
            failed += 1

    print(f"\nSummary:")
    print(f"- Skipped (already exist): {skipped}")
    print(f"- Successfully created: {created}")
    print(f"- Failed to create: {failed}")
    print(f"Total files processed: {skipped + created + failed}")

if __name__ == "__main__":
    process_translations()
