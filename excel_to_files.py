#!/usr/bin/env python3
"""
Excel to Files Converter
Reads the Excel file and saves each sheet as a separate file
"""

import pandas as pd
import openpyxl
import os
import json
from datetime import datetime

def read_excel_and_save_sheets(file_path):
    """Read Excel file and save each sheet as separate files"""
    
    print("🏥 Healthtech Data Processing")
    print("=" * 50)
    print(f"📁 Reading file: {file_path}")
    
    try:
        # Check if file exists
        if not os.path.exists(file_path):
            print(f"❌ Error: File '{file_path}' not found!")
            return False
        
        # Load the workbook
        wb = openpyxl.load_workbook(file_path)
        sheet_names = wb.sheetnames
        
        print(f"✅ Found {len(sheet_names)} sheets: {', '.join(sheet_names)}")
        print("=" * 50)
        
        # Create output directory
        output_dir = "excel_sheets_data"
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            print(f"📁 Created output directory: {output_dir}")
        
        # Process each sheet
        for i, sheet_name in enumerate(sheet_names, 1):
            print(f"\n📋 Processing Sheet {i}/{len(sheet_names)}: {sheet_name}")
            
            try:
                # Read the sheet into a DataFrame
                df = pd.read_excel(file_path, sheet_name=sheet_name)
                
                # Clean sheet name for filename
                clean_sheet_name = sheet_name.replace(" ", "_").replace("/", "_").replace("\\", "_")
                
                # Save as different formats
                save_sheet_data(df, clean_sheet_name, output_dir)
                
                print(f"   ✅ Rows: {len(df)}, Columns: {len(df.columns)}")
                
            except Exception as e:
                print(f"   ❌ Error processing sheet '{sheet_name}': {e}")
        
        # Create summary file
        create_summary_file(file_path, sheet_names, output_dir)
        
        print("\n" + "=" * 50)
        print("🎉 Processing Complete!")
        print(f"📁 All files saved in: {output_dir}")
        print("=" * 50)
        
        return True
        
    except Exception as e:
        print(f"❌ Error reading Excel file: {e}")
        return False

def save_sheet_data(df, sheet_name, output_dir):
    """Save sheet data in multiple formats"""
    
    # 1. Save as CSV
    csv_file = os.path.join(output_dir, f"{sheet_name}.csv")
    df.to_csv(csv_file, index=False, encoding='utf-8')
    print(f"   📄 Saved CSV: {csv_file}")
    
    # 2. Save as JSON
    json_file = os.path.join(output_dir, f"{sheet_name}.json")
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(df.to_dict('records'), f, indent=2, ensure_ascii=False, default=str)
    print(f"   📄 Saved JSON: {json_file}")
    
    # 3. Save as Excel (single sheet)
    excel_file = os.path.join(output_dir, f"{sheet_name}.xlsx")
    df.to_excel(excel_file, index=False, sheet_name=sheet_name)
    print(f"   📄 Saved Excel: {excel_file}")
    
    # 4. Save as TXT (readable format)
    txt_file = os.path.join(output_dir, f"{sheet_name}.txt")
    with open(txt_file, 'w', encoding='utf-8') as f:
        f.write(f"Sheet: {sheet_name}\n")
        f.write(f"Rows: {len(df)}, Columns: {len(df.columns)}\n")
        f.write("=" * 50 + "\n\n")
        f.write(df.to_string(index=False))
    print(f"   📄 Saved TXT: {txt_file}")

def create_summary_file(file_path, sheet_names, output_dir):
    """Create a summary file with information about all sheets"""
    
    summary_file = os.path.join(output_dir, "SUMMARY.txt")
    
    with open(summary_file, 'w', encoding='utf-8') as f:
        f.write("HEALTHTECH DATA SUMMARY\n")
        f.write("=" * 50 + "\n")
        f.write(f"Original File: {file_path}\n")
        f.write(f"Processing Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"Total Sheets: {len(sheet_names)}\n\n")
        
        f.write("SHEETS INFORMATION:\n")
        f.write("-" * 30 + "\n")
        
        for i, sheet_name in enumerate(sheet_names, 1):
            try:
                df = pd.read_excel(file_path, sheet_name=sheet_name)
                clean_name = sheet_name.replace(" ", "_").replace("/", "_").replace("\\", "_")
                
                f.write(f"\n{i}. {sheet_name}\n")
                f.write(f"   Files: {clean_name}.csv, {clean_name}.json, {clean_name}.xlsx, {clean_name}.txt\n")
                f.write(f"   Rows: {len(df)}\n")
                f.write(f"   Columns: {len(df.columns)}\n")
                f.write(f"   Columns: {', '.join(df.columns.tolist())}\n")
                
                # Check for missing values
                missing_count = df.isnull().sum().sum()
                if missing_count > 0:
                    f.write(f"   Missing Values: {missing_count}\n")
                else:
                    f.write(f"   Missing Values: None\n")
                    
            except Exception as e:
                f.write(f"\n{i}. {sheet_name} - ERROR: {e}\n")
        
        f.write("\n" + "=" * 50 + "\n")
        f.write("FILE FORMATS EXPLANATION:\n")
        f.write("-" * 30 + "\n")
        f.write("• .csv - Comma-separated values, good for Excel/spreadsheets\n")
        f.write("• .json - JavaScript Object Notation, good for web applications\n")
        f.write("• .xlsx - Excel format, preserves formatting\n")
        f.write("• .txt - Text format, human-readable\n")
    
    print(f"📄 Created summary: {summary_file}")

def main():
    """Main function"""
    file_path = "Healthtech Data Test.xlsx"
    
    print("🚀 Starting Excel to Files Conversion...")
    
    success = read_excel_and_save_sheets(file_path)
    
    if success:
        print("\n✅ All sheets have been successfully converted to separate files!")
        print("\n📁 Check the 'excel_sheets_data' folder for your files.")
        print("\n📋 Each sheet is saved in 4 formats:")
        print("   • CSV - For spreadsheet applications")
        print("   • JSON - For web applications")
        print("   • Excel - For Excel applications")
        print("   • TXT - For easy reading")
    else:
        print("\n❌ Conversion failed. Please check the error messages above.")

if __name__ == "__main__":
    main() 