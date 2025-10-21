"""Exports course data from UC Berkeley course catalog to a JSON file."""

import json
import requests
from bs4 import BeautifulSoup
import re
import time

def get_berkeley_courses():
    """Fetch course data from UC Berkeley's course catalog."""
    
    # UC Berkeley course catalog API endpoint
    base_url = "https://classes.berkeley.edu/api/classes"
    
    # Common UC Berkeley departments to scrape
    departments = [
        "COMPSCI", "MATH", "STAT", "PHYSICS", "CHEM", "BIOLOGY", 
        "ECON", "PSYCH", "HISTORY", "ENGLISH", "PHILOS", "POLSCI",
        "ART", "MUSIC", "THEATER", "ARCH", "CIVENG", "MECENG",
        "EECS", "DATA", "INFO", "BIOENG", "CHEMENG", "MATSCI"
    ]
    
    courses = []
    connections = []
    
    for dept in departments:
        print(f"Fetching courses for department: {dept}")
        
        try:
            # Fetch department courses
            response = requests.get(f"{base_url}/search", params={
                "department": dept,
                "term": "2024-FALL"  # Current term
            })
            
            if response.status_code == 200:
                dept_courses = response.json()
                
                for course in dept_courses.get('classes', []):
                    course_data = {
                        "id": course.get('course_id', ''),
                        "name": course.get('title', ''),
                        "department": dept,
                        "units": course.get('units', ''),
                        "description": course.get('description', '')
                    }
                    
                    courses.append(course_data)
                    
                    # Extract prerequisites from description
                    prereqs = extract_prerequisites(course.get('description', ''))
                    for prereq in prereqs:
                        connections.append({
                            "source": prereq,
                            "target": course.get('course_id', '')
                        })
            
            # Rate limiting
            time.sleep(1)
            
        except Exception as e:
            print(f"Error fetching {dept}: {e}")
            continue
    
    return courses, connections

def extract_prerequisites(description):
    """Extract prerequisite course codes from course description."""
    prereqs = []
    
    if not description:
        return prereqs
    
    # Common patterns for prerequisites
    patterns = [
        r'Prerequisites?:?\s*([A-Z]{2,4}\s*\d{1,3}[A-Z]?)',
        r'Prerequisites?:?\s*([A-Z]{2,4}\s*\d{1,3})',
        r'([A-Z]{2,4}\s*\d{1,3}[A-Z]?)\s*or\s*([A-Z]{2,4}\s*\d{1,3}[A-Z]?)',
        r'([A-Z]{2,4}\s*\d{1,3})\s*and\s*([A-Z]{2,4}\s*\d{1,3})'
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, description, re.IGNORECASE)
        for match in matches:
            if isinstance(match, tuple):
                prereqs.extend(match)
            else:
                prereqs.append(match)
    
    # Clean up course codes
    cleaned_prereqs = []
    for prereq in prereqs:
        # Remove extra spaces and standardize format
        cleaned = re.sub(r'\s+', ' ', prereq.strip())
        if cleaned:
            cleaned_prereqs.append(cleaned)
    
    return list(set(cleaned_prereqs))  # Remove duplicates

def main():
    """Main function to scrape and save course data."""
    print("Starting UC Berkeley course data scraping...")
    
    courses, connections = get_berkeley_courses()
    
    # Create full data structure
    full_data = {
        "nodes": courses,
        "links": connections
    }
    
    # Save to JSON file
    with open("../frontend/data/berkeley-courses-data.json", mode="w", encoding="utf-8") as data_file:
        json.dump(full_data, data_file, indent=2, ensure_ascii=False)
    
    print(f"Scraped {len(courses)} courses with {len(connections)} connections")
    print("Data saved to frontend/data/berkeley-courses-data.json")

if __name__ == "__main__":
    main() 