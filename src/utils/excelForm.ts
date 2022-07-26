import express from 'express';
import { Workbook, Style, Fill } from "exceljs";
import ApiResult from '../interfaces/common/api-result.interface';
import createApiError from './createApiError';
import { errorState } from '../states/common.state';

export const setExcelToResponse = async (res: express.Response, result: ApiResult<any>, stateTag = 'excelForm') => {
  if (result.count === 0) {
    throw createApiError(
			400, 
			{
				admin_message: `해당 엑셀 정보가 존재하지 않습니다.`,
				user_message: '해당 엑셀 정보가 존재하지 않습니다.'
			}, 
			stateTag,
			errorState.NO_DATA
		);
  }
  
  const workbook = new Workbook();
  
  workbook.description = result.raws[0]['excel_form_cd'];

  const sheet = workbook.addWorksheet(result.raws[0]['excel_form_nm'], {properties: { defaultColWidth: 13 } });

  sheet.columns = result.raws.map((value, index) => {
    const suffix = index === result.raws.length - 1 ? '' : ', ';
    workbook.keywords += `${value.excel_form_column_cd}${suffix}`

    return {
      header: value.excel_form_column_nm,
      key: value.excel_form_column_cd,
      width: 13
    };
  });

  let offset = 9; // to offset by 3 rows
	sheet.spliceRows(1, 0, ...new Array(offset))

  const headerFill: Fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD9D9D9' },
  };

	const headerStyle: Partial<Style> = {
    font: { 
			bold: true , 
			size: 10 ,
		},
		alignment: {vertical: 'middle' }
  };

	const headerStyleRequired: Partial<Style> = {
    font: { 
			bold: true , 
			size: 10 ,
			color: { argb: 'FFFF0000' } 
		},
		alignment: {vertical: 'middle' }
  };

  const options = { includeEmpty: true }

	const headerRow = sheet.getRow(10);
  
  headerRow.eachCell(options, (cell, cellNum) => {
    cell.style = result?.raws[cellNum - 1]?.column_fg ? headerStyleRequired : headerStyle;
    cell.fill = headerFill;
  });

  sheet.mergeCells('A1:H1');
	sheet.mergeCells('A2:H2');
	sheet.mergeCells('A3:H3');
	sheet.mergeCells('A4:H4');
	sheet.mergeCells('A5:H5');
	sheet.mergeCells('A6:H6');
	sheet.mergeCells('A7:H7');
	sheet.mergeCells('J2:R2');
  
	sheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
		if (rowNumber === 1) {
			row.height = 26.25 
		}else {
			row.height = 20
		}
	});

  sheet.getCell('A1').value = '엑셀 업로드 사용 시 참고 사항';
  sheet.getCell('A1').font = { size: 18, bold: true };
  sheet.getCell('A1').alignment = { horizontal: 'left',vertical:'middle' };

	sheet.getCell('A2').value = '※ 빨간색 글자의 컬럼은 필수 입력 사항 입니다.';
	sheet.getCell('A2').alignment = { horizontal: 'left',vertical:'middle' };
	sheet.getCell('A2').font = { size: 10 , bold: true ,color: { argb: 'FF0070C0' }};

	sheet.getCell('J2').value = '※ 공장유형코드는 엑셀 업로드 시 유형에대 한 값을 입력하는 경우의 예를 들기 위한 컬럼으로 실제와 다름 ( 실제 업로드 양식에는 포함되지 않는 내용 )';
	sheet.getCell('J2').alignment = { horizontal: 'left',vertical:'middle' };
	sheet.getCell('J2').font = { size: 10 , bold: true ,color: { argb: 'FFFF0000' }};

	sheet.getCell('A3').value = '※ 코드 값은 MES프로그램에 등록 된 코드값과 동일하게 입력해야 합니다. ( 띄어쓰기도 동일 해야 함 )';
	sheet.getCell('A3').alignment = { horizontal: 'left',vertical:'middle' };
	sheet.getCell('A3').font = { size: 10 , bold: true ,color: { argb: 'FF0070C0' }};

	sheet.getCell('A4').value = '※ 아래 정의 된 컬럼은 프로그램에 맞춰 정의된 컬럼으로 임의 추가, 수정, 삭제 시 업로드가 정상작동 되지 않습니다.';
	sheet.getCell('A4').alignment = { horizontal: 'left',vertical:'middle' };
	sheet.getCell('A4').font = { size: 10 , bold: true ,color: { argb: 'FF0070C0' }};

	sheet.getCell('A5').value = '※ 일자 형식은 yyyy-mm-dd 형식으로 입력해주세요. ( ex 2000-01-01 )';
	sheet.getCell('A5').alignment = { horizontal: 'left',vertical:'middle' };
	sheet.getCell('A5').font = { size: 10 , bold: true ,color: { argb: 'FF0070C0' }};

	sheet.getCell('A6').value = '※ 사용/미사용 과 같이 OO여부 로 작성된 컬럼의 값은 0 , 1 로 입력해주세요. ( ex 사용여부 : 사용(0), 미사용(1) )';
	sheet.getCell('A6').alignment = { horizontal: 'left',vertical:'middle' };
	sheet.getCell('A6').font = { size: 10 , bold: true ,color: { argb: 'FF0070C0' }};
	
	sheet.getCell('A7').value = '※ 이미지 등록이 필요한 경우에는 데이터 등록 후 MES프로그램에서 등록이 가능합니다.';
	sheet.getCell('A7').alignment = { horizontal: 'left',vertical:'middle' };
	sheet.getCell('A7').font = { size: 10 , bold: true ,color: { argb: 'FF0070C0' }};

  res.setHeader('Content-Type', 'application/vnd.openxmlformats');
  res.setHeader(
		'Content-Disposition',
		`attachment; filename=${encodeURI(result.raws[0]['excel_form_nm'])}.xlsx`,
	);

  // await workbook.xlsx.write(res);
  return await workbook.xlsx.writeBuffer();
  
  // res.end();
};
