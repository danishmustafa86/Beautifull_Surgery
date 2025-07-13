#!/usr/bin/env python3
"""
Cleanup Script - Keep only JSON files
Deletes all files except JSON files in the excel_sheets_data directory
"""

import os
import glob

def cleanup_files():
    """Keep only JSON files and delete all others"""
    
    print("🧹 Starting File Cleanup...")
    print("=" * 50)
    
    # Directory to clean
    directory = "excel_sheets_data"
    
    if not os.path.exists(directory):
        print(f"❌ Directory '{directory}' not found!")
        return False
    
    print(f"📁 Cleaning directory: {directory}")
    
    # Get all files in the directory
    all_files = []
    for file_path in glob.glob(os.path.join(directory, "*")):
        if os.path.isfile(file_path):
            all_files.append(file_path)
    
    print(f"📋 Found {len(all_files)} files")
    
    # Separate JSON files from others
    json_files = []
    other_files = []
    
    for file_path in all_files:
        if file_path.lower().endswith('.json'):
            json_files.append(file_path)
        else:
            other_files.append(file_path)
    
    print(f"📄 JSON files to keep: {len(json_files)}")
    print(f"🗑️  Files to delete: {len(other_files)}")
    
    if json_files:
        print("\n📄 JSON files that will be kept:")
        for json_file in json_files:
            print(f"   ✅ {os.path.basename(json_file)}")
    
    if other_files:
        print("\n🗑️  Files that will be deleted:")
        for other_file in other_files:
            print(f"   ❌ {os.path.basename(other_file)}")
    
    # Confirm deletion
    if other_files:
        print(f"\n⚠️  Are you sure you want to delete {len(other_files)} files?")
        print("This action cannot be undone!")
        
        # Auto-confirm for script execution
        confirm = "y"  # You can change this to input("Enter 'y' to confirm: ") for manual confirmation
        
        if confirm.lower() == 'y':
            # Delete non-JSON files
            deleted_count = 0
            for file_path in other_files:
                try:
                    os.remove(file_path)
                    print(f"   🗑️  Deleted: {os.path.basename(file_path)}")
                    deleted_count += 1
                except Exception as e:
                    print(f"   ❌ Error deleting {os.path.basename(file_path)}: {e}")
            
            print(f"\n✅ Cleanup Complete!")
            print(f"📄 Kept {len(json_files)} JSON files")
            print(f"🗑️  Deleted {deleted_count} files")
        else:
            print("❌ Cleanup cancelled by user")
            return False
    else:
        print("\n✅ No files to delete - only JSON files found!")
    
    # Show final directory contents
    print("\n📁 Final directory contents:")
    remaining_files = glob.glob(os.path.join(directory, "*.json"))
    for file_path in remaining_files:
        file_size = os.path.getsize(file_path)
        print(f"   📄 {os.path.basename(file_path)} ({file_size:,} bytes)")
    
    return True

if __name__ == "__main__":
    cleanup_files() 