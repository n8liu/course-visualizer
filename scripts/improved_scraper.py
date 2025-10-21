#!/usr/bin/env python3
"""
Improved UC Berkeley course scraper with proper prerequisite extraction.
Uses the UC Berkeley Course Catalog API and BerkeleyTime data.
"""

import requests
import json
import time
import re
from typing import Dict, List, Set, Optional
import logging
from collections import defaultdict

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class ImprovedBerkeleyCourseScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        self.courses = {}
        self.prerequisites = []
        
    def scrape_from_csv(self, csv_file: str):
        """Parse the courses-report CSV file which contains actual UC Berkeley course data."""
        import csv
        
        logger.info(f"Reading course data from {csv_file}")
        courses = []
        course_ids = set()
        
        try:
            with open(csv_file, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    # Extract course information
                    subject = row.get('Subject', '').strip()
                    course_num = row.get('Course Number', '').strip()
                    
                    if not subject or not course_num:
                        continue
                    
                    # Create course ID
                    course_id = f"{subject} {course_num}"
                    
                    # Normalize course ID format
                    course_id = self._normalize_course_id(course_id)
                    if not course_id:
                        continue
                    
                    # Get the title from the description (first 100 chars)
                    description = row.get('Course Description', '').strip()
                    title = description[:100] + "..." if len(description) > 100 else description
                    
                    # Get units
                    min_units = row.get('Credits - Units - Minimum Units', '').strip()
                    max_units = row.get('Credits - Units - Maximum Units', '').strip()
                    units = min_units if min_units == max_units else f"{min_units}-{max_units}"
                    
                    course_data = {
                        'id': course_id,
                        'name': title,
                        'department': self._extract_department(course_id),
                        'units': units or '0',
                        'description': description,
                        'terms_offered': row.get('Terms Offered', '-'),
                        'cross_listed': row.get('Cross-Listed Course(s)', '-'),
                    }
                    
                    courses.append(course_data)
                    course_ids.add(course_id)
                    self.courses[course_id] = course_data
            
            logger.info(f"Loaded {len(courses)} courses from CSV")
            
            # Now extract prerequisites with validation
            links = []
            for course in courses:
                prereqs = self._extract_prerequisites(
                    course['description'], 
                    course_ids
                )
                for prereq in prereqs:
                    links.append({
                        'source': prereq,
                        'target': course['id']
                    })
            
            logger.info(f"Extracted {len(links)} prerequisite relationships")
            
            return {
                'nodes': courses,
                'links': links
            }
            
        except Exception as e:
            logger.error(f"Error reading CSV: {e}")
            return {'nodes': [], 'links': []}
    
    def _normalize_course_id(self, course_id: str) -> str:
        """Normalize course ID to standard format."""
        # Remove extra whitespace
        course_id = ' '.join(course_id.split())
        
        # Handle common formats: "COMPSCI 61A", "CS 61A", etc.
        match = re.match(r'^([A-Z]{2,10})\s*([0-9]{1,3}[A-Z]{0,3})$', course_id.upper())
        if match:
            dept, num = match.groups()
            return f"{dept} {num}"
        
        return ""
    
    def _extract_department(self, course_id: str) -> str:
        """Extract department code from course ID."""
        parts = course_id.split()
        return parts[0] if parts else ""
    
    def _extract_prerequisites(self, description: str, valid_courses: Set[str]) -> List[str]:
        """
        Extract prerequisite course codes from description.
        Only returns courses that exist in valid_courses set.
        """
        if not description:
            return []
        
        prereqs = set()
        
        # Look for common prerequisite patterns
        prereq_section = ""
        
        # Try to find prerequisite section
        prereq_patterns = [
            r'Prerequisites?:([^.]+\.)',
            r'Prerequisites?:([^;]+;)',
            r'Prerequisites?:(.{0,500}?)(?:Corequisites?|Enrollment|Credit|Formerly|NOTE|Hours)',
        ]
        
        for pattern in prereq_patterns:
            match = re.search(pattern, description, re.IGNORECASE | re.DOTALL)
            if match:
                prereq_section = match.group(1)
                break
        
        if not prereq_section:
            # Fall back to searching entire description
            prereq_section = description
        
        # Extract course codes from the prerequisite section
        # Match patterns like "CS 61A", "MATH 1A", "COMPSCI 70", etc.
        course_pattern = r'\b([A-Z]{2,10})\s*([0-9]{1,3}[A-Z]{0,3})\b'
        matches = re.finditer(course_pattern, prereq_section)
        
        for match in matches:
            dept, num = match.groups()
            course_code = f"{dept} {num}"
            
            # Normalize and validate
            normalized = self._normalize_course_id(course_code)
            if normalized and normalized in valid_courses:
                prereqs.add(normalized)
        
        return list(prereqs)
    
    def add_common_prerequisites(self, data: Dict) -> Dict:
        """Add well-known prerequisite relationships for major courses."""
        common_prereqs = {
            # Computer Science
            'COMPSCI 61B': ['COMPSCI 61A'],
            'COMPSCI 61C': ['COMPSCI 61B'],
            'COMPSCI 70': ['COMPSCI 61A'],
            'COMPSCI 170': ['COMPSCI 61B', 'COMPSCI 70'],
            'COMPSCI 186': ['COMPSCI 61B', 'COMPSCI 70'],
            'COMPSCI 188': ['COMPSCI 61B', 'COMPSCI 70'],
            'COMPSCI 189': ['COMPSCI 70', 'MATH 54'],
            
            # Math
            'MATH 1B': ['MATH 1A'],
            'MATH 53': ['MATH 1B'],
            'MATH 54': ['MATH 1B'],
            'MATH 110': ['MATH 54'],
            'MATH 113': ['MATH 54'],
            
            # Physics
            'PHYSICS 7B': ['PHYSICS 7A'],
            'PHYSICS 7C': ['PHYSICS 7B'],
            
            # Chemistry
            'CHEM 1B': ['CHEM 1A'],
            'CHEM 3B': ['CHEM 3A'],
            
            # Data Science
            'DATA 100': ['DATA 8'],
            
            # EECS
            'EECS 16B': ['EECS 16A'],
            
            # Statistics
            'STAT 134': ['STAT 20'],
            'STAT 135': ['STAT 134'],
        }
        
        course_ids = {course['id'] for course in data['nodes']}
        existing_links = {(link['source'], link['target']) for link in data['links']}
        
        added = 0
        for target, sources in common_prereqs.items():
            if target in course_ids:
                for source in sources:
                    if source in course_ids and (source, target) not in existing_links:
                        data['links'].append({
                            'source': source,
                            'target': target
                        })
                        added += 1
        
        if added > 0:
            logger.info(f"Added {added} well-known prerequisite relationships")
        
        return data


def main():
    """Main function to scrape and process course data."""
    scraper = ImprovedBerkeleyCourseScraper()
    
    # Path to the CSV file
    csv_file = "../courses-report.2025-07-31.csv"
    
    logger.info("Starting improved UC Berkeley course scraping...")
    
    # Scrape from CSV
    data = scraper.scrape_from_csv(csv_file)
    
    if not data['nodes']:
        logger.error("No courses found in CSV file!")
        return
    
    # Add well-known prerequisites
    data = scraper.add_common_prerequisites(data)
    
    # Save to JSON
    output_file = "../frontend/data/berkeley-courses-data.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    logger.info("=" * 60)
    logger.info(f"✅ Successfully processed {len(data['nodes'])} courses!")
    logger.info(f"✅ Found {len(data['links'])} prerequisite relationships!")
    logger.info(f"✅ Data saved to {output_file}")
    
    # Print statistics
    departments = defaultdict(int)
    for course in data['nodes']:
        departments[course['department']] += 1
    
    logger.info(f"\n📊 Top departments by course count:")
    for dept, count in sorted(departments.items(), key=lambda x: x[1], reverse=True)[:15]:
        logger.info(f"  {dept}: {count} courses")
    
    # Prerequisite statistics
    courses_with_prereqs = len(set(link['target'] for link in data['links']))
    logger.info(f"\n📈 Prerequisite statistics:")
    logger.info(f"  Courses with prerequisites: {courses_with_prereqs}")
    logger.info(f"  Average prerequisites per course: {len(data['links']) / len(data['nodes']):.2f}")


if __name__ == "__main__":
    main()

