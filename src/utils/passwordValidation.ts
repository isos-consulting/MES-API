
// 📌 변경 password 검증
const passwordValidation = async (password: string) => {
	const smallLetter = new RegExp(/([a-z])/)
	const number = new RegExp(/[0-9]/)
	const special = new RegExp(/[!@#$%^&*()_+\-=\[\]{};:\\|,.<>\/?]/)
	const backslash = new RegExp(/([\'\"\\\s])/)
	
	let txt = password;
	let regCount = 0;

	const arr = txt.split('');
	
	if (arr.length < 8) { return false; }	

	if (backslash.test(txt)) { console.log(txt);return false; }	

	if (smallLetter.test(txt) ) { ++regCount; }

	if (number.test(txt) ) { ++regCount; }

	if (special.test(txt) ) { ++regCount; }

	if (regCount < 2) {return false}

	return true
}

export default passwordValidation;