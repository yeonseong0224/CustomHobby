import pandas as pd

# 엑셀 파일 읽기
df = pd.read_excel("취미 설문조사.xlsx")

print("=" * 80)
print("📋 엑셀 파일의 실제 컬럼명 목록:")
print("=" * 80)
for i, col in enumerate(df.columns, 1):
    print(f"{i}. [{col}]")
print("=" * 80)
print(f"\n총 {len(df.columns)}개 컬럼")
print(f"총 {len(df)}개 행")

