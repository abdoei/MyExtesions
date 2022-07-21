console.log("Chrome extension Go!");
let data = undefined;

// window.alert(booody);
// window.alert("Good to go");

async function main() {
	let auth = await fetch("http://stda.minia.edu.eg/PortalgetJCI", {
		"headers": {
			"content-type": "application/x-www-form-urlencoded; charset=UTF-8"
		},
		"body": "param0=Portal.General&param1=GetStudentPortalData&param2=%7B%22UserID%22%3A%22%22%7D",
		"method": "POST",
		"mode": "cors"
	}).then((response) => response.json());
	
	let dataa = await fetch("http://stda.minia.edu.eg/PortalgetJCI", {
		"headers": {
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
		},
		"body": "param0=Portal.Results&param1=GetAllResults&param2=%7B%22UUID%22%3A%22" + auth[0].UUID + "%22%7D",
		"method": "POST",
		"mode": "cors"
	}).then((response) => response.json());
	data = dataa;
}

main();

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
	// console.log(message.f);
	var table = document.getElementsByClassName(
		"Secondery-table TableShow_PortalAllResults"
	);
	if (message.f % 2 == 0) {
		// remove all the empty rows
		for (let ti = 0; ti < table.length; ti++) {
			if (data[ti].AnnouncementDS.length != 0) {
				for (let i of table[ti].rows) {
					if (i.childElementCount == 0) i.remove();
				}

				// التيرم الأول
				table[ti].rows[0].insertCell(2).innerHTML = "<b>الفصل 1</b>";
				for (let ro = 1; ro < table[ti].rows.length - 1; ro++) {
					let myRow = table[ti].rows[ro];
					let myCour = data[ti].ds[0].StudyYearCourses[ro - 1];
					if (
						myCour.Parts[0].SemasterName ===
						"الفصل الدراسى الأول|First Term"
					) {
						let degMax = myCour.Parts[0].DegreesMax;
						if (
							degMax.split("|").length == 1 ||
							myCour.Parts.length == 2
						) {
							degMax = degMax.split("|");
						} else {
							degMax = degMax.split("|").slice(0, -1);
						}
						myRow.insertCell(2).innerHTML =
							"(" +
							degMax +
							")" +
							" / " +
							myCour.Parts[0].Degrees[0];
						myRow.cells[2].setAttribute(
							"style",
							"background-color: lightgray; text-align: left; padding : 7px; font-weight: bold; vertical-align: middle;"
						);
					} else {
						myRow.insertCell(2).innerHTML = "---";
						myRow.cells[2].setAttribute(
							"style",
							"background-color: lightgray; text-align: center; padding : 7px; font-weight: bold; vertical-align: middle;"
						);
					}
				}

				// التيرم الثاني
				table[ti].rows[0].insertCell(3).innerHTML = "<b>الفصل 2</b>";
				for (let ro = 1; ro < table[ti].rows.length - 1; ro++) {
					let myRow = table[ti].rows[ro];
					let myCour = data[ti].ds[0].StudyYearCourses[ro - 1];
					if (
						myCour.Parts[0].SemasterName ===
						"الفصل الدراسى الثانى|Second Term"
					) {
						let degMax = myCour.Parts[0].DegreesMax;
						if (degMax.split("|").length == 1) {
							degMax = degMax;
						} else {
							degMax = degMax.split("|").slice(0, -1);
						}
						myRow.insertCell(3).innerHTML =
							"(" +
							degMax +
							")" +
							" / " +
							myCour.Parts[0].Degrees[0];
						myRow.cells[3].setAttribute(
							"style",
							"background-color: lightgray; text-align: left; padding : 7px; font-weight: bold; vertical-align: middle;"
						);
					} else if (myCour.Parts.length == 2) {
						let degMax = myCour.Parts[1].DegreesMax;
						if (degMax.split("|").length == 1) {
							degMax = degMax;
						} else {
							degMax = degMax.split("|").slice(0, -1);
						}
						myRow.insertCell(3).innerHTML =
							"(" +
							degMax +
							")" +
							" / " +
							myCour.Parts[1].Degrees[0];
						myRow.cells[3].setAttribute(
							"style",
							"background-color: lightgray; text-align: left; padding : 7px; font-weight: bold; vertical-align: middle;"
						);
					} else {
						myRow.insertCell(3).innerHTML = "---";
						myRow.cells[3].setAttribute(
							"style",
							"background-color: lightgray; text-align: center; padding : 7px; font-weight: bold; vertical-align: middle;"
						);
					}
				}

				// المجموع
				table[ti].rows[0].insertCell(4).innerHTML = "<b>المجموع</b>";
				for (let ro = 1; ro < table[ti].rows.length - 1; ro++) {
					let myRow = table[ti].rows[ro];
					let myCour = data[ti].ds[0].StudyYearCourses[ro - 1];
					myRow.insertCell(4).innerHTML =
						myCour.Total +
						"/" +
						myCour.Max +
						"\t|\t" +
						((myCour.Total / myCour.Max) * 100).toFixed(0) +
						"%";
					myRow.cells[4].setAttribute(
						"style",
						"background-color: lightgray; text-align: left; padding : 7px; font-weight: bold; vertical-align: middle;"
					);
				}

				table[ti].rows[0].style.textAlign = "center";
			}
			if (data[ti].Year == 2019) {
				benefit = table[ti]
					.insertRow(table[ti].rows.length - 1)
					.insertCell(0);
				benefit.innerHTML = "✨ سبحان الله وبحمده، سبحان الله العظيم ✨";
				benefit.setAttribute(
					"style",
					"background-color: #3385ff; text-align: center; padding : 7px; font-weight: bold; vertical-align: middle;"
				);
				benefit.colSpan = 10;
				table[ti].rows[table[ti].rows.length - 2].setAttribute('id', 'BENEFIT');
			}
		}
	} else if (message.f % 2 == 1) {
		for (let ti = 0; ti < table.length; ti++) {
			if (data[ti].AnnouncementDS.length != 0) {
				for (let r of table[ti].rows) {
					for (let m = 0; m < 5; m++) {
						for (let c of r.cells) {
							// console.log(c);
							if (c.cellIndex > 1) {
								c.remove();
							}
						}
					}
				}
			}
		}
		document.getElementById('BENEFIT').remove();
	}
}