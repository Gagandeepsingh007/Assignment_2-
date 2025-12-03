import time
import requests
import mss
import mss.tools
import io
from PIL import Image

# --- Configuration ---
SERVER_URL = "https://subflexuously-phenotypic-veda.ngrok-free.dev/upload-image"
CAPTURE_INTERVAL_SECONDS = 30

def capture_and_send_screenshot():
    """
    Captures the entire screen, converts it to a PNG byte stream,
    and sends it to the specified server endpoint.
    """
    print(f"Capturing screenshot at {time.ctime()}...")
    
    try:
        # Use mss for fast screen capture
        with mss.mss() as sct:
            # Grab the data
            sct_img = sct.grab(sct.monitors[0]) # Grabs the first monitor

            # Convert to PIL Image for easy saving to bytes
            img = Image.frombytes("RGB", sct_img.size, sct_img.rgb)
            
            # Save the image to an in-memory file
            byte_buffer = io.BytesIO()
            img.save(byte_buffer, format="PNG")
            screenshot_bytes = byte_buffer.getvalue()

        # Prepare the files for the POST request
        # The key 'file' should match what your server expects for multipart/form-data
        files = {'file': ('screenshot.png', io.BytesIO(screenshot_bytes), 'image/png')}

        print(f"Sending screenshot to {SERVER_URL}...")
        
        # Send the request
        response = requests.post(SERVER_URL, files=files, timeout=10, allow_redirects=False)
        # response = requests.post(url, files=files, timeout=10, allow_redirects=False)
        print(response.status_code, response.headers)

        # Check the server's response
        response.raise_for_status() # Raises an HTTPError for bad responses (4xx or 5xx)
        print(f"Successfully sent screenshot. Server responded with: {response.status_code}")

    except requests.exceptions.RequestException as e:
        print(f"Error sending screenshot: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

def main():
    """
    Main loop to continuously capture and send screenshots.
    """
    print(f"Starting screenshot sender. A screenshot will be taken and sent every {CAPTURE_INTERVAL_SECONDS} seconds.")
    print(f"Ensure a server is running at {SERVER_URL} to receive the images.")
    print("Press Ctrl+C to stop.")

    try:
        while True:
            capture_and_send_screenshot()
            time.sleep(CAPTURE_INTERVAL_SECONDS)
    except KeyboardInterrupt:
        print("\nScript stopped by user.")

# if __name__ == "__main__":
#     main()