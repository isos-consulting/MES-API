
// 📌 변경 password 검증
const passwordValidation = async (password: string) => {
	let smallLetter = "/([a-z])/g";
	let number = "/\d/g";
	let special = "/([!@#$%^&*()_+-*/=])/g";
	let backslash = "/[^\'\"\\\s]/g";
	
	let txt = password;
	let regCount = 0;

	const arr = txt.split('');
	
	if (arr.length < 8) { return false; }	

	if (!backslash.match(txt)) { return false; }	

	if (!smallLetter.match(txt) ) { ++regCount; }

	if (!number.match(txt) ) { ++regCount; }

	if (!special.match(txt) ) { ++regCount; }

	if (regCount < 2) {return false}

	return true
}

export default passwordValidation;