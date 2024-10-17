import re
import json
from pathlib import Path
from datetime import datetime, timedelta

def process_comment(comment):
    """
    Process the comment field to extract calendar and reformat the comment.
    """
    calendar = None

    # Extract calendar date in formats like "2020.01.20" or "2023-01-14"
    date_match = re.search(r'(\d{4}[.-]\d{2}[.-]\d{2})', comment)
    if date_match:
        calendar = date_match.group(1).replace('.', '-')  # Normalize to "YYYY-MM-DD"
        # Remove the date from the comment
        comment = comment.replace(date_match.group(0), '').strip()

    # Remove empty parentheses if they exist after processing
    comment = re.sub(r'\(\s*\)', '', comment)

    # Process quotes: Move content inside “ ” to the front and separate with ｜.
    quote_match = re.search(r'“(.*?)”', comment)
    if quote_match:
        quote_content = quote_match.group(1)
        # Remove the quotes and reformat the comment
        comment = comment.replace(f'“{quote_content}”', '').strip()
        comment = f"{quote_content}｜{comment}"

    return comment, calendar


def process_file(file_path):
    """
    Process a single JSON file to update the comment and calendar fields.
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for entry in data:
        if 'comment' in entry:
            # Process the comment field
            comment, calendar = process_comment(entry['comment'])
            entry['comment'] = comment

            # Add calendar field if extracted
            if calendar:
                entry['calendar'] = calendar

        # Ensure calendar field exists for files like cal2021.json
        if 'calendar' not in entry and 'comment' in entry:
            # Attempt to extract calendar from comment if missing
            _, calendar = process_comment(entry['comment'])
            if calendar:
                entry['calendar'] = calendar

    # Save the updated file
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def add_calendar_to_movies(file_path):
    """
    Add a 'calendar' field to each movie in the JSON file, assigning dates sequentially for 2021.
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        movies = json.load(f)

    # Start from 2021-01-01
    start_date = datetime(2021, 1, 1)
    for i, movie in enumerate(movies):
        # Assign a date to each movie
        movie['calendar'] = (start_date + timedelta(days=i)).strftime('%Y-%m-%d')

    # Save the updated JSON back to the file
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(movies, f, ensure_ascii=False, indent=2)


def main():
    # Define the list of files to process
    files = [
        "data/movies/cal2017.json",
        "data/movies/cal2018.json",
        "data/movies/cal2019.json",
        "data/movies/cal2020.json",
        "data/movies/cal2021.json",
        "data/movies/cal2022.json",
        "data/movies/cal2023.json",
        "data/movies/cal2024.json",
    ]

    for file_path in files:
        print(f"Processing {file_path}...")
        process_file(file_path)
        print(f"Finished processing {file_path}.")

    # Call the function with the path to cal2021.json
    add_calendar_to_movies('data/movies/cal2021.json')

if __name__ == "__main__":
    main()
