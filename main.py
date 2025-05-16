from PIL import Image, ImageDraw, ImageFont

def render_expression_to_image(expr: str, output_path: str):
    font_path = "/System/Library/Fonts/Supplemental/Arial.ttf"  # adjust if needed
    font_size = 40
    font = ImageFont.truetype(font_path, font_size)

    # Temporary image to get text size
    temp_img = Image.new("RGBA", (1, 1))
    draw = ImageDraw.Draw(temp_img)
    bbox = draw.textbbox((0, 0), expr, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    padding = 20  # padding around text
    width = text_width + padding * 2
    height = text_height + padding * 2

    # Create final image with dynamic size
    image = Image.new("RGBA", (width, height), (255, 255, 255, 0))  # transparent background
    draw = ImageDraw.Draw(image)

    # Draw text centered with padding offset
    draw.text((padding, padding), expr, fill=(0, 0, 0, 255), font=font)

    image.save(output_path, optimize=True)

questions = ["112321 * 1324234 - 564 - 56756 * 456546", "6 - 1", "334 * 345"]
for i, q in enumerate(questions, 1):
    render_expression_to_image(q, f"question_{i}.png")
