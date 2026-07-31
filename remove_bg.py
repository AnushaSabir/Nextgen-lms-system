from PIL import Image

def remove_black_background(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    
    for item in datas:
        # Check if pixel is pure black or very dark
        if item[0] < 20 and item[1] < 20 and item[2] < 20:
            newData.append((item[0], item[1], item[2], 0))  # Transparent
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(output_path, "PNG")

input_img = r"C:\Users\M.A COM\.gemini\antigravity\brain\be31b7a4-34ea-4ad9-84cc-841565e003cf\.user_uploaded\media__1785433073173.jpg"
output_img = r"d:\NextGen-LMS\public\logo.png"

remove_black_background(input_img, output_img)
print("Background removed and saved to", output_img)
