import io
import cv2
import numpy as np
from fastapi import HTTPException
from services.document_aligner import scan_document
from services.google_cloud import run_ocr
from services.business_validator import validate_business_info
from services.semahtic_search import extract_colon_key_values
from services.semahtic_search import match_ocr_keys
from services.semahtic_search import *
from io import BytesIO

async def process_ocr(file: BytesIO):
    file.seek(0)  # 파일 포인터를 처음으로 이동
    file_bytes = np.frombuffer(file.read(), dtype=np.uint8)  # frombuffer 사용
    image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    if image is None:
        return {"error": "올바른 이미지 파일이 아닙니다."}

    # 이미지 보정 수행
    # processed_image = scan_document(image)  # 여기서 image를 넘겨야 함

    # if processed_image is None:
    #     return {"error": "문서 영역을 찾을 수 없습니다."}

    document = run_ocr(image)
    
    print(document.text)
    extracted = extract_colon_key_values(document.text) # :이 들어간 데이터만 뽑은 후 dictionary형태로 변환
    result =  match_ocr_keys(extracted)

    print('@@@@@@@@@@@@@ OCR 결과 @@@@@@@@@@@@@')
    print(result)
    print('@@@@@@@@@@@@@ OCR 결과 @@@@@@@@@@@@@')

    return translate_keys(result)

def sync_process_ocr(file: bytes):
    """ OCR 실행 (동기 함수) """
    print("✅ sync_process_ocr 실행 중...")

    image = cv2.imdecode(np.frombuffer(file, np.uint8), cv2.IMREAD_COLOR)
    if image is None:
        return {"error": "올바른 이미지 파일이 아닙니다."}

    processed_image = scan_document(image)
    if processed_image is None:
        return {"error": "문서 영역을 찾을 수 없습니다."}

    text = run_ocr(processed_image)
    extracted = extract_colon_key_values(text)
    result = match_ocr_keys(extracted)

    print("✅ OCR 처리 완료")
    return translate_keys(result)