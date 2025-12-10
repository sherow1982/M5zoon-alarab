import json
from datetime import datetime

def unify_and_clean_reviews(input_path, output_path):
    """
    Reads reviews from a nested JSON structure, cleans the data,
    and restructures it by product category.

    - Replaces null locations with 'غير محدد'.
    - Standardizes date format to 'YYYY-MM-DD'.
    - Removes duplicate comments for the same product.
    - Groups all reviews into categories in a new unified file.
    """
    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            products_data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error reading or parsing {input_path}: {e}")
        return

    unified_reviews = {
        "watches": [],
        "perfumes": [],
        "jewelry": [],
        "accessories": [],
        "general": []
    }

    for product in products_data:
        category = product.get("category")
        if category not in unified_reviews:
            # Skip categories not present in the target structure
            continue

        seen_comments = set()
        for review in product.get("reviews", []):
            comment = review.get("comment")
            # Skip review if the comment is a duplicate for this product
            if comment in seen_comments:
                continue
            seen_comments.add(comment)

            # 1. Clean location: Replace null with a default value
            location = review.get("location") if review.get("location") is not None else "غير محدد"

            # 2. Standardize date format
            try:
                date_obj = datetime.fromisoformat(review.get("date"))
                standard_date = date_obj.strftime('%Y-%m-%d')
            except (ValueError, TypeError):
                standard_date = "0000-00-00" # Default for invalid format

            unified_reviews[category].append({
                "id": review.get("id"),
                "productType": category.rstrip('s'), # 'perfumes' -> 'perfume'
                "customerName": review.get("author"),
                "rating": review.get("rating"),
                "comment": comment,
                "date": standard_date,
                "verified": review.get("verified"),
                "helpful": review.get("helpful"),
                "location": location
            })

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(unified_reviews, f, ensure_ascii=False, indent=2)

    print(f"Successfully created unified and cleaned reviews at: {output_path}")

if __name__ == '__main__':
    # Define file paths
    input_file = '/workspaces/emirates-gifts/data/reviews.json'
    output_file = '/workspaces/emirates-gifts/data/unified-reviews.json'
    
    # Run the cleaning and unification process
    unify_and_clean_reviews(input_file, output_file)